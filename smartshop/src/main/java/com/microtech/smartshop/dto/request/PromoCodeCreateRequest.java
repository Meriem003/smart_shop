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

    @NotBlank
    @Pattern(regexp = "PROMO-[A-Z0-9]{4}")
    private String code;

    @DecimalMin(value = "1")
    @DecimalMax(value = "100")
    private BigDecimal pourcentageRemise;

    private Boolean usageUnique;
}