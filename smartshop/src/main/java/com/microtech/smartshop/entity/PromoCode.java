package com.microtech.smartshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "promo_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PromoCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Pattern(regexp = "PROMO-[A-Z0-9]{4}")
    @Column(unique = true, nullable = false)
    private String code;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "1.0")
    @Column(nullable = false, precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal pourcentageRemise = new BigDecimal("0.05");

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean usageUnique = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean used = false;
}