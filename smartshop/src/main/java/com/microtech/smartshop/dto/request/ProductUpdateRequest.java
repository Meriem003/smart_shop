package com.microtech.smartshop.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateRequest {

    private String nom;

    @DecimalMin(value = "0.01")
    private BigDecimal prixUnitaire;

    @Min(value = 0)
    private Integer stockDisponible;
}