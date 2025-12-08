package com.microtech.smartshop.service;

import com.microtech.smartshop.enums.CustomerTier;
import com.microtech.smartshop.service.impl.LoyaltyServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;


class LoyaltyServiceTest {

    private LoyaltyService loyaltyService;

    @BeforeEach
    void setUp() {
        loyaltyService = new LoyaltyServiceImpl();
    }

    @Test
    void test1_calculTier_retourne_BASIC_pour_nouveaux_clients() {
        CustomerTier tier = loyaltyService.calculateTier(2, new BigDecimal("500"));
        assertEquals(CustomerTier.BASIC, tier);
    }

    @Test
    void test2_calculTier_retourne_SILVER_pour_3_commandes() {
        CustomerTier tier = loyaltyService.calculateTier(3, new BigDecimal("500"));
        assertEquals(CustomerTier.SILVER, tier);
    }

    @Test
    void test3_calculTier_retourne_GOLD_pour_depense_elevee() {
        CustomerTier tier = loyaltyService.calculateTier(5, new BigDecimal("5000"));
        assertEquals(CustomerTier.GOLD, tier);
    }

    @Test
    void test4_remise_est_zero_pour_tier_BASIC() {
        BigDecimal discount = loyaltyService.calculateLoyaltyDiscount(
            CustomerTier.BASIC, new BigDecimal("1000"));
        assertEquals(BigDecimal.ZERO, discount);
    }

    @Test
    void test5_remise_est_5pourcent_pour_SILVER() {
        BigDecimal discount = loyaltyService.calculateLoyaltyDiscount(
            CustomerTier.SILVER, new BigDecimal("1000"));
        assertEquals(new BigDecimal("50.00"), discount);
    }

    @Test
    void test6_remise_est_zero_si_montant_trop_petit() {
        BigDecimal discount = loyaltyService.calculateLoyaltyDiscount(
            CustomerTier.SILVER, new BigDecimal("400"));
        assertEquals(BigDecimal.ZERO, discount);
    }
}
