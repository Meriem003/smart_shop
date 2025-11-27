package com.microtech.smartshop.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromoCodeCreateRequest {

    @NotBlank(message = "Le code promo est obligatoire")
    @Pattern(regexp = "PROMO-[A-Z0-9]{4}",
            message = "Le code promo doit suivre le format PROMO-XXXX (ex: PROMO-A123)")
    private String code;

    @DecimalMin(value = "0.01", message = "Le pourcentage de remise doit être au moins 0.01 (1%)")
    @DecimalMax(value = "1.00", message = "Le pourcentage de remise ne peut pas dépasser 1.00 (100%)")
    private BigDecimal pourcentageRemise;

    private Boolean usageUnique;
}