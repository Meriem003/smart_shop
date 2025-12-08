package com.microtech.smartshop.service;

import com.microtech.smartshop.dto.request.CreateOrderRequest;
import com.microtech.smartshop.dto.request.OrderItemRequest;
import com.microtech.smartshop.entity.Customer;
import com.microtech.smartshop.entity.Product;
import com.microtech.smartshop.enums.CustomerTier;
import com.microtech.smartshop.exception.BusinessRuleException;
import com.microtech.smartshop.exception.ResourceNotFoundException;
import com.microtech.smartshop.repository.CustomerRepository;
import com.microtech.smartshop.repository.ProductRepository;
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
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(orderService, "tauxTVA", new BigDecimal("0.20"));
    }


    @Test
    void test1_creerCommande_erreur_si_client_non_trouve() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(999L);
        when(customerRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> orderService.createOrder(request));
    }

    @Test
    void test2_creerCommande_erreur_si_aucun_article() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setCustomerId(1L);
        request.setItems(List.of());
        
        Customer customer = new Customer();
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));

        assertThrows(BusinessRuleException.class, () -> orderService.createOrder(request));
    }

    @Test
    void test3_creerCommande_erreur_si_produit_non_trouve() {
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
    void test4_creerCommande_erreur_si_stock_insuffisant() {
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
}
