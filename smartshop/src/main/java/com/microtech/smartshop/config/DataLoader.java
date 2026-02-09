package com.microtech.smartshop.config;

import com.microtech.smartshop.entity.*;
import com.microtech.smartshop.enums.*;
import com.microtech.smartshop.repository.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataLoader {

    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final PromoCodeRepository promoCodeRepository;

    @PostConstruct
    public void loadData() {
        if (customerRepository.count() == 0) {
            loadCustomers();
        }
        if (productRepository.count() == 0) {
            loadProducts();
        }
        if (promoCodeRepository.count() == 0) {
            loadPromoCodes();
        }
    }

    private void loadCustomers() {
        Customer customer1 = Customer.builder()
                .nom("Ahmed Berrada")
                .email("ahmed.berrada@gmail.com")
                .loyaltyTier(CustomerTier.GOLD)
                .totalOrders(15)
                .totalSpent(new BigDecimal("2500.00"))
                .build();

        Customer customer2 = Customer.builder()
                .nom("Fatima Alaoui")
                .email("fatima.alaoui@gmail.com")
                .loyaltyTier(CustomerTier.SILVER)
                .totalOrders(8)
                .totalSpent(new BigDecimal("1200.00"))
                .build();

        Customer customer3 = Customer.builder()
                .nom("Mohamed Bennani")
                .email("mohamed.bennani@gmail.com")
                .loyaltyTier(CustomerTier.BASIC)
                .totalOrders(3)
                .totalSpent(new BigDecimal("450.00"))
                .build();

        Customer customer4 = Customer.builder()
                .nom("Aicha Mansouri")
                .email("aicha.mansouri@gmail.com")
                .loyaltyTier(CustomerTier.PLATINUM)
                .totalOrders(25)
                .totalSpent(new BigDecimal("5800.00"))
                .build();

        Customer customer5 = Customer.builder()
                .nom("Youssef Tazi")
                .email("youssef.tazi@gmail.com")
                .loyaltyTier(CustomerTier.BASIC)
                .totalOrders(1)
                .totalSpent(new BigDecimal("150.00"))
                .build();

        customerRepository.save(customer1);
        customerRepository.save(customer2);
        customerRepository.save(customer3);
        customerRepository.save(customer4);
        customerRepository.save(customer5);
    }

    private void loadProducts() {
        Product product1 = Product.builder()
                .nom("Laptop HP ProBook 450")
                .prixUnitaire(new BigDecimal("8500.00"))
                .stockDisponible(15)
                .deleted(false)
                .build();

        Product product2 = Product.builder()
                .nom("Souris sans fil Logitech")
                .prixUnitaire(new BigDecimal("250.00"))
                .stockDisponible(50)
                .deleted(false)
                .build();

        Product product3 = Product.builder()
                .nom("Clavier mécanique")
                .prixUnitaire(new BigDecimal("680.00"))
                .stockDisponible(25)
                .deleted(false)
                .build();

        Product product4 = Product.builder()
                .nom("Écran Dell 24 pouces")
                .prixUnitaire(new BigDecimal("1200.00"))
                .stockDisponible(12)
                .deleted(false)
                .build();

        Product product5 = Product.builder()
                .nom("Câble USB-C")
                .prixUnitaire(new BigDecimal("120.00"))
                .stockDisponible(100)
                .deleted(false)
                .build();

        Product product6 = Product.builder()
                .nom("SSD Samsung 512GB")
                .prixUnitaire(new BigDecimal("450.00"))
                .stockDisponible(30)
                .deleted(false)
                .build();

        Product product7 = Product.builder()
                .nom("Webcam HD")
                .prixUnitaire(new BigDecimal("380.00"))
                .stockDisponible(20)
                .deleted(false)
                .build();

        Product product8 = Product.builder()
                .nom("Casque Bluetooth")
                .prixUnitaire(new BigDecimal("750.00"))
                .stockDisponible(18)
                .deleted(false)
                .build();

        productRepository.save(product1);
        productRepository.save(product2);
        productRepository.save(product3);
        productRepository.save(product4);
        productRepository.save(product5);
        productRepository.save(product6);
        productRepository.save(product7);
        productRepository.save(product8);
    }

    private void loadPromoCodes() {
        PromoCode promo1 = PromoCode.builder()
                .code("PROMO-WE10")
                .pourcentageRemise(new BigDecimal("0.10"))
                .active(true)
                .usageUnique(false)
                .used(false)
                .build();

        PromoCode promo2 = PromoCode.builder()
                .code("PROMO-SU20")
                .pourcentageRemise(new BigDecimal("0.20"))
                .active(true)
                .usageUnique(true)
                .used(false)
                .build();

        PromoCode promo3 = PromoCode.builder()
                .code("PROMO-FI05")
                .pourcentageRemise(new BigDecimal("0.05"))
                .active(true)
                .usageUnique(true)
                .used(true)
                .build();

        PromoCode promo4 = PromoCode.builder()
                .code("PROMO-BU15")
                .pourcentageRemise(new BigDecimal("0.15"))
                .active(true)
                .usageUnique(false)
                .used(false)
                .build();

        promoCodeRepository.save(promo1);
        promoCodeRepository.save(promo2);
        promoCodeRepository.save(promo3);
        promoCodeRepository.save(promo4);
    }
}