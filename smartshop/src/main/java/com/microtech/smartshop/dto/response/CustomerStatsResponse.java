package com.microtech.smartshop.dto.response;

import com.microtech.smartshop.enums.CustomerTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStatsResponse {

    private Long customerId;
    private String nom;
    private String email;
    private CustomerTier loyaltyTier;
    private String loyaltyTierLabel;

    private Integer totalOrders;
    private BigDecimal totalSpent;

}