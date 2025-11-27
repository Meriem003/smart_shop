package com.microtech.smartshop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromoCodeResponse {

    private Long id;
    private String code;
    private BigDecimal pourcentageRemise;
    private Boolean usageUnique;
    private Boolean used;
}