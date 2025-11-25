package com.microtech.smartshop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;

@Entity
@Table(name = "payment_especes")
@DiscriminatorValue("ESPECES")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PaymentEspeces extends Payment {

    @NotBlank
    @Column(nullable = false)
    private String numeroRecu;

    public static final BigDecimal LIMITE_LEGALE = new BigDecimal("20000");
}