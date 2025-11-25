package com.microtech.smartshop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank
    @Column(nullable = false)
    private String nom;

    @NotNull
    @DecimalMin(value = "0.01")
    @Column(nullable = false, scale = 2)
    private BigDecimal prixUnitaire;

    @NotNull
    @Min(value = 0)
    @Column(nullable = false)
    private Integer stockDisponible;

    @Column(nullable = false)
    @Builder.Default
    private Boolean deleted = false;
}