package com.microtech.smartshop.service.impl;

import com.microtech.smartshop.entity.Customer;
import com.microtech.smartshop.enums.CustomerTier;
import com.microtech.smartshop.service.LoyaltyService;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class LoyaltyServiceImpl implements LoyaltyService {

    private static final int SILVER_MIN_ORDERS = 3;
    private static final int GOLD_MIN_ORDERS = 10;
    private static final int PLATINUM_MIN_ORDERS = 20;

    private static final BigDecimal SILVER_MIN_SPENT = new BigDecimal("1000");
    private static final BigDecimal GOLD_MIN_SPENT = new BigDecimal("5000");
    private static final BigDecimal PLATINUM_MIN_SPENT = new BigDecimal("15000");

    private static final BigDecimal SILVER_MIN_ORDER = new BigDecimal("500");
    private static final BigDecimal GOLD_MIN_ORDER = new BigDecimal("800");
    private static final BigDecimal PLATINUM_MIN_ORDER = new BigDecimal("1200");

    private static final BigDecimal SILVER_DISCOUNT = new BigDecimal("0.05"); 
    private static final BigDecimal GOLD_DISCOUNT = new BigDecimal("0.10");    
    private static final BigDecimal PLATINUM_DISCOUNT = new BigDecimal("0.15"); 

    @Override
    public CustomerTier calculateTier(Integer totalOrders, BigDecimal totalSpent) {
        if (totalOrders >= PLATINUM_MIN_ORDERS || totalSpent.compareTo(PLATINUM_MIN_SPENT) >= 0) {
            return CustomerTier.PLATINUM;
        }
        if (totalOrders >= GOLD_MIN_ORDERS || totalSpent.compareTo(GOLD_MIN_SPENT) >= 0) {
            return CustomerTier.GOLD;
        }
        if (totalOrders >= SILVER_MIN_ORDERS || totalSpent.compareTo(SILVER_MIN_SPENT) >= 0) {
            return CustomerTier.SILVER;
        }
        return CustomerTier.BASIC;
    }

    @Override
    public BigDecimal calculateLoyaltyDiscount(CustomerTier customerTier, BigDecimal sousTotal) {
        if (!isEligibleForDiscount(customerTier, sousTotal)) {
            return BigDecimal.ZERO;
        }
        BigDecimal discountRate = getDiscountRate(customerTier);
        BigDecimal discount = sousTotal.multiply(discountRate);
        return discount.setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public BigDecimal getDiscountRate(CustomerTier tier) {
        return switch (tier) {
            case SILVER -> SILVER_DISCOUNT;
            case GOLD -> GOLD_DISCOUNT;
            case PLATINUM -> PLATINUM_DISCOUNT;
            default -> BigDecimal.ZERO;
        };
    }

    @Override
    public BigDecimal getMinOrderAmount(CustomerTier tier) {
        return switch (tier) {
            case SILVER -> SILVER_MIN_ORDER;
            case GOLD -> GOLD_MIN_ORDER;
            case PLATINUM -> PLATINUM_MIN_ORDER;
            default -> BigDecimal.ZERO;
        };
    }

    @Override
    public boolean isEligibleForDiscount(CustomerTier tier, BigDecimal sousTotal) {
        if (tier == CustomerTier.BASIC) {
            return false;
        }
        BigDecimal minAmount = getMinOrderAmount(tier);
        return sousTotal.compareTo(minAmount) >= 0;
    }

    @Override
    public void updateCustomerTier(Customer customer) {
        CustomerTier newTier = calculateTier(customer.getTotalOrders(), customer.getTotalSpent());
        if (customer.getLoyaltyTier() != newTier) {
            customer.setLoyaltyTier(newTier);
        }
    }
}