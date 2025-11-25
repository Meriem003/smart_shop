package com.microtech.smartshop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "payment_virement")
@DiscriminatorValue("VIREMENT")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PaymentVirement extends Payment {

    @NotBlank
    @Column(nullable = false)
    private String referenceVirement;

    @NotBlank
    @Column(nullable = false)
    private String banque;
}