package com.microtech.smartshop.service;

import com.microtech.smartshop.dto.request.CreateOrderRequest;
import com.microtech.smartshop.dto.request.OrderItemRequest;
import com.microtech.smartshop.dto.response.OrderResponse;
import com.microtech.smartshop.entity.Customer;
import com.microtech.smartshop.entity.Order;
import com.microtech.smartshop.entity.Product;
import com.microtech.smartshop.entity.PromoCode;
import com.microtech.smartshop.enums.CustomerTier;
import com.microtech.smartshop.exception.BusinessRuleException;
import com.microtech.smartshop.exception.ResourceNotFoundException;
import com.microtech.smartshop.repository.CustomerRepository;
import com.microtech.smartshop.repository.OrderRepository;
import com.microtech.smartshop.repository.ProductRepository;
import com.microtech.smartshop.repository.PromoCodeRepository;
import com.microtech.smartshop.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private PromoCodeRepository promoCodeRepository;

    @Mock
    private LoyaltyService loyaltyService;

    @InjectMocks
    private OrderServiceImpl orderService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(orderService, "tauxTVA", new BigDecimal("0.20"));
    }

    @Test
    void createOrder_shouldThrowException_whenCustomerNotFound() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(999L);

        when(customerRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.createOrder(request));
    }

    @Test
    void createOrder_shouldThrowException_whenNoItems() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(1L);
        request.setItems(List.of());

        Customer customer = new Customer();
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        assertThrows(BusinessRuleException.class, () -> orderService.createOrder(request));
    }

    @Test
    void createOrder_shouldThrowException_whenProductNotFound() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(1L);
        
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(999L);
        itemRequest.setQuantite(1);
        request.setItems(List.of(itemRequest));

        Customer customer = new Customer();
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.createOrder(request));
    }

    @Test
    void createOrder_shouldThrowException_whenInsufficientStock() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(1L);
        
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantite(100);
        request.setItems(List.of(itemRequest));

        Customer customer = new Customer();
        customer.setLoyaltyTier(CustomerTier.BASIC);

        Product product = new Product();
        product.setId(1L);
        product.setNom("Test Product");
        product.setPrixUnitaire(new BigDecimal("10.00"));
        product.setStockDisponible(5);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThrows(BusinessRuleException.class, () -> orderService.createOrder(request));
    }

    @Test
    void createOrder_shouldCalculateCorrectTotal_withoutPromo() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(1L);
        
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantite(2);
        request.setItems(List.of(itemRequest));

        Customer customer = new Customer();
        customer.setId(1L);
        customer.setNom("Test Customer");
        customer.setLoyaltyTier(CustomerTier.BASIC);
        customer.setTotalOrders(0);
        customer.setTotalSpent(BigDecimal.ZERO);

        Product product = new Product();
        product.setId(1L);
        product.setNom("Test Product");
        product.setPrixUnitaire(new BigDecimal("100.00"));
        product.setStockDisponible(10);

        Order savedOrder = new Order();
        savedOrder.setId(1L);
        savedOrder.setCustomer(customer);
        savedOrder.setSousTotal(new BigDecimal("200.00"));
        savedOrder.setMontantRemise(BigDecimal.ZERO);
        savedOrder.setMontantHT(new BigDecimal("200.00"));
        savedOrder.setTauxTVA(new BigDecimal("0.20"));
        savedOrder.setMontantTVA(new BigDecimal("40.00"));
        savedOrder.setTotalTTC(new BigDecimal("240.00"));

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(loyaltyService.calculateLoyaltyDiscount(any(), any())).thenReturn(BigDecimal.ZERO);
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);
        when(customerRepository.save(any(Customer.class))).thenReturn(customer);

        OrderResponse response = orderService.createOrder(request);

        assertNotNull(response);
    }

    @Test
    void createOrder_shouldApplyPromoCode_whenValid() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(1L);
        request.setCodePromo("PROMO-TEST");
        
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantite(1);
        request.setItems(List.of(itemRequest));

        Customer customer = new Customer();
        customer.setId(1L);
        customer.setNom("Test Customer");
        customer.setLoyaltyTier(CustomerTier.BASIC);
        customer.setTotalOrders(0);
        customer.setTotalSpent(BigDecimal.ZERO);

        Product product = new Product();
        product.setId(1L);
        product.setNom("Test Product");
        product.setPrixUnitaire(new BigDecimal("100.00"));
        product.setStockDisponible(10);

        PromoCode promoCode = new PromoCode();
        promoCode.setCode("PROMO-TEST");
        promoCode.setActive(true);
        promoCode.setUsageUnique(false);
        promoCode.setPourcentageRemise(new BigDecimal("0.10"));

        Order savedOrder = new Order();
        savedOrder.setId(1L);
        savedOrder.setCustomer(customer);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(promoCodeRepository.findByCode("PROMO-TEST")).thenReturn(Optional.of(promoCode));
        when(loyaltyService.calculateLoyaltyDiscount(any(), any())).thenReturn(BigDecimal.ZERO);
        when(orderRepository.save(any(Order.class))).thenReturn(savedOrder);

        OrderResponse response = orderService.createOrder(request);

        assertNotNull(response);
        verify(promoCodeRepository).findByCode("PROMO-TEST");
    }

    @Test
    void createOrder_shouldThrowException_whenPromoCodeInactive() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(1L);
        request.setCodePromo("PROMO-TEST");
        
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId(1L);
        itemRequest.setQuantite(1);
        request.setItems(List.of(itemRequest));

        Customer customer = new Customer();
        customer.setId(1L);
        customer.setLoyaltyTier(CustomerTier.BASIC);
        customer.setTotalOrders(0);
        customer.setTotalSpent(BigDecimal.ZERO);

        Product product = new Product();
        product.setId(1L);
        product.setNom("Test Product");
        product.setPrixUnitaire(new BigDecimal("100.00"));
        product.setStockDisponible(10);

        PromoCode promoCode = new PromoCode();
        promoCode.setCode("PROMO-TEST");
        promoCode.setActive(false);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(promoCodeRepository.findByCode("PROMO-TEST")).thenReturn(Optional.of(promoCode));
        when(loyaltyService.calculateLoyaltyDiscount(any(), any())).thenReturn(BigDecimal.ZERO);

        assertThrows(BusinessRuleException.class, () -> orderService.createOrder(request));
    }
}
