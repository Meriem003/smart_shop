package com.microtech.smartshop.service;

import com.microtech.smartshop.entity.Customer;
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
    void calculateTier_shouldReturnBasic_whenLowOrdersAndSpent() {
        CustomerTier tier = loyaltyService.calculateTier(2, new BigDecimal("500"));
        assertEquals(CustomerTier.BASIC, tier);
    }

    @Test
    void calculateTier_shouldReturnSilver_whenEnoughOrders() {
        CustomerTier tier = loyaltyService.calculateTier(3, new BigDecimal("500"));
        assertEquals(CustomerTier.SILVER, tier);
    }

    @Test
    void calculateTier_shouldReturnGold_whenEnoughSpent() {
        CustomerTier tier = loyaltyService.calculateTier(5, new BigDecimal("5000"));
        assertEquals(CustomerTier.GOLD, tier);
    }

    @Test
    void calculateTier_shouldReturnPlatinum_whenHighOrders() {
        CustomerTier tier = loyaltyService.calculateTier(20, new BigDecimal("3000"));
        assertEquals(CustomerTier.PLATINUM, tier);
    }

    @Test
    void calculateLoyaltyDiscount_shouldReturnZero_whenBasicTier() {
        BigDecimal discount = loyaltyService.calculateLoyaltyDiscount(
            CustomerTier.BASIC, new BigDecimal("1000"));
        assertEquals(BigDecimal.ZERO, discount);
    }

    @Test
    void calculateLoyaltyDiscount_shouldReturn5Percent_whenSilverAndEligible() {
        BigDecimal discount = loyaltyService.calculateLoyaltyDiscount(
            CustomerTier.SILVER, new BigDecimal("1000"));
        assertEquals(new BigDecimal("50.00"), discount);
    }

    @Test
    void calculateLoyaltyDiscount_shouldReturn10Percent_whenGoldAndEligible() {
        BigDecimal discount = loyaltyService.calculateLoyaltyDiscount(
            CustomerTier.GOLD, new BigDecimal("1000"));
        assertEquals(new BigDecimal("100.00"), discount);
    }

    @Test
    void calculateLoyaltyDiscount_shouldReturnZero_whenBelowMinimum() {
        BigDecimal discount = loyaltyService.calculateLoyaltyDiscount(
            CustomerTier.SILVER, new BigDecimal("400"));
        assertEquals(BigDecimal.ZERO, discount);
    }

    @Test
    void isEligibleForDiscount_shouldReturnFalse_whenBasicTier() {
        boolean eligible = loyaltyService.isEligibleForDiscount(
            CustomerTier.BASIC, new BigDecimal("1000"));
        assertFalse(eligible);
    }

    @Test
    void isEligibleForDiscount_shouldReturnTrue_whenAboveMinimum() {
        boolean eligible = loyaltyService.isEligibleForDiscount(
            CustomerTier.SILVER, new BigDecimal("600"));
        assertTrue(eligible);
    }

    @Test
    void updateCustomerTier_shouldUpgradeTier_whenQualified() {
        Customer customer = new Customer();
        customer.setLoyaltyTier(CustomerTier.BASIC);
        customer.setTotalOrders(5);
        customer.setTotalSpent(new BigDecimal("2000"));

        loyaltyService.updateCustomerTier(customer);

        assertEquals(CustomerTier.SILVER, customer.getLoyaltyTier());
    }

    @Test
    void getDiscountRate_shouldReturnCorrectRate_forEachTier() {
        assertEquals(BigDecimal.ZERO, loyaltyService.getDiscountRate(CustomerTier.BASIC));
        assertEquals(new BigDecimal("0.05"), loyaltyService.getDiscountRate(CustomerTier.SILVER));
        assertEquals(new BigDecimal("0.10"), loyaltyService.getDiscountRate(CustomerTier.GOLD));
        assertEquals(new BigDecimal("0.15"), loyaltyService.getDiscountRate(CustomerTier.PLATINUM));
    }
}
