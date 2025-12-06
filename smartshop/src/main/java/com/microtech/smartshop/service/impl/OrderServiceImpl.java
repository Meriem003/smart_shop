package com.microtech.smartshop.service.impl;

import com.microtech.smartshop.dto.request.CreateOrderRequest;
import com.microtech.smartshop.dto.request.OrderItemRequest;
import com.microtech.smartshop.dto.response.OrderItemResponse;
import com.microtech.smartshop.dto.response.OrderResponse;
import com.microtech.smartshop.entity.*;
import com.microtech.smartshop.enums.CustomerTier;
import com.microtech.smartshop.enums.OrderStatus;
import com.microtech.smartshop.exception.BusinessRuleException;
import com.microtech.smartshop.exception.ResourceNotFoundException;
import com.microtech.smartshop.repository.CustomerRepository;
import com.microtech.smartshop.repository.OrderRepository;
import com.microtech.smartshop.repository.ProductRepository;
import com.microtech.smartshop.repository.PromoCodeRepository;
import com.microtech.smartshop.service.LoyaltyService;
import com.microtech.smartshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final PromoCodeRepository promoCodeRepository;
    private final LoyaltyService loyaltyService;

    @Value("${app.tva.taux}")
    private BigDecimal tauxTVA;

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Client non trouvé avec l'ID : " + request.getCustomerId()));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BusinessRuleException("Une commande doit contenir au moins un article");
        }

        Order order = Order.builder()
                .customer(customer)
                .status(OrderStatus.PENDING)
                .build();
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal sousTotal = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Produit non trouvé avec l'ID : " + itemRequest.getProductId()));

            if (product.getStockDisponible() < itemRequest.getQuantite()) {
                throw new BusinessRuleException(
                        "Stock insuffisant pour le produit '" + product.getNom() + 
                        "'. Stock disponible : " + product.getStockDisponible() + 
                        ", Quantité demandée : " + itemRequest.getQuantite());
            }

            BigDecimal totalLigne = product.getPrixUnitaire()
                    .multiply(new BigDecimal(itemRequest.getQuantite()))
                    .setScale(2, RoundingMode.HALF_UP);
            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantite(itemRequest.getQuantite())
                    .prixUnitaire(product.getPrixUnitaire())
                    .totalLigne(totalLigne)
                    .order(order)
                    .build();

            orderItems.add(orderItem);
            sousTotal = sousTotal.add(totalLigne);
        }

        order.setItems(orderItems);
        order.setSousTotal(sousTotal.setScale(2, RoundingMode.HALF_UP));

        BigDecimal montantRemise = BigDecimal.ZERO;
        CustomerTier tier = customer.getLoyaltyTier();
        BigDecimal remiseFidelite = loyaltyService.calculateLoyaltyDiscount(tier, sousTotal);
        montantRemise = montantRemise.add(remiseFidelite);

        PromoCode promoCode = null;
        if (request.getCodePromo() != null && !request.getCodePromo().trim().isEmpty()) {
            promoCode = promoCodeRepository.findByCode(request.getCodePromo())
                    .orElseThrow(() -> new BusinessRuleException(
                            "Code promo invalide : " + request.getCodePromo()));

            if (Boolean.FALSE.equals(promoCode.getActive())) {
                throw new BusinessRuleException("Le code promo n'est plus actif");
            }

            if (Boolean.TRUE.equals(promoCode.getUsageUnique()) && Boolean.TRUE.equals(promoCode.getUsed())) {
                throw new BusinessRuleException(
                        "Le code promo '" + promoCode.getCode() + "' a déjà été utilisé et ne peut être utilisé qu'une seule fois");
            }

            BigDecimal remisePromo = sousTotal.multiply(promoCode.getPourcentageRemise())
                    .setScale(2, RoundingMode.HALF_UP);
            montantRemise = montantRemise.add(remisePromo);

            order.setPromoCode(promoCode);
            order.setCodePromo(promoCode.getCode());

            if (Boolean.TRUE.equals(promoCode.getUsageUnique())) {
                promoCode.setUsed(true);
                promoCodeRepository.save(promoCode);
            }
        }
        order.setMontantRemise(montantRemise);

        BigDecimal montantHT = sousTotal.subtract(montantRemise)
                .setScale(2, RoundingMode.HALF_UP);
        order.setMontantHT(montantHT);

        order.setTauxTVA(tauxTVA);
        BigDecimal montantTVA = montantHT.multiply(tauxTVA)
                .setScale(2, RoundingMode.HALF_UP);
        order.setMontantTVA(montantTVA);

        BigDecimal totalTTC = montantHT.add(montantTVA)
                .setScale(2, RoundingMode.HALF_UP);
        order.setTotalTTC(totalTTC);
        order.setMontantRestant(totalTTC);

        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : savedOrder.getItems()) {
            Product product = item.getProduct();
            product.setStockDisponible(product.getStockDisponible() - item.getQuantite());
            productRepository.save(product);
        }
        customer.setTotalOrders(customer.getTotalOrders() + 1);
        customer.setTotalSpent(customer.getTotalSpent().add(totalTTC));
        updateCustomerTier(customer);
        customerRepository.save(customer);
        return buildOrderResponse(savedOrder);
    }

    private void updateCustomerTier(Customer customer) {
        loyaltyService.updateCustomerTier(customer);
    }

    private OrderResponse buildOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = new ArrayList<>();

        for (OrderItem item : order.getItems()) {
            OrderItemResponse itemResponse = OrderItemResponse.builder()
                    .id(item.getId())
                    .productId(item.getProduct().getId())
                    .productNom(item.getProduct().getNom())
                    .quantite(item.getQuantite())
                    .prixUnitaire(item.getPrixUnitaire())
                    .totalLigne(item.getTotalLigne())
                    .build();
            itemResponses.add(itemResponse);
        }

        return OrderResponse.builder()
                .id(order.getId())
                .dateCommande(order.getDateCommande())
                .customerId(order.getCustomer().getId())
                .customerNom(order.getCustomer().getNom())
                .items(itemResponses)
                .sousTotal(order.getSousTotal())
                .montantRemise(order.getMontantRemise())
                .montantHT(order.getMontantHT())
                .montantTVA(order.getMontantTVA())
                .totalTTC(order.getTotalTTC())
                .status(order.getStatus())
                .codePromo(order.getCodePromo())
                .tauxTVA(order.getTauxTVA())
                .build();
    }

    @Override
    @Transactional
    public OrderResponse confirmOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Commande non trouvée avec l'ID : " + orderId));
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessRuleException(
                    "Impossible de confirmer la commande. Statut actuel : " + order.getStatus() +
                    ". Seules les commandes PENDING peuvent être confirmées.");
        }
        if (order.getMontantRestant().compareTo(BigDecimal.ZERO) > 0) {
            throw new BusinessRuleException(
                    "Impossible de confirmer la commande. Le paiement n'est pas complet. " +
                    "Montant restant à payer : " + order.getMontantRestant() + " DH");
        }
        order.setStatus(OrderStatus.CONFIRMED);
        Order savedOrder = orderRepository.save(order);
        return buildOrderResponse(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long orderId) {
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Commande non trouvée avec l'ID : " + orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessRuleException(
                    "Impossible d'annuler la commande. Statut actuel : " + order.getStatus() +
                    ". Seules les commandes PENDING peuvent être annulées.");
        }

        order.setStatus(OrderStatus.CANCELED);
        Order savedOrder = orderRepository.save(order);
        return buildOrderResponse(savedOrder);
    }
}
