package com.microtech.smartshop.service;

import com.microtech.smartshop.entity.Customer;
import com.microtech.smartshop.enums.CustomerTier;
import java.math.BigDecimal;

/**
 * Service pour gérer le système de fidélité automatique
 */
public interface LoyaltyService {
    CustomerTier calculateTier(Integer totalOrders, BigDecimal totalSpent);
    BigDecimal calculateLoyaltyDiscount(CustomerTier customerTier, BigDecimal sousTotal);
    BigDecimal getDiscountRate(CustomerTier tier);
    BigDecimal getMinOrderAmount(CustomerTier tier);
    boolean isEligibleForDiscount(CustomerTier tier, BigDecimal sousTotal);
    void updateCustomerTier(Customer customer);
}