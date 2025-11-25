package com.microtech.smartshop.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;

@Entity
@Table(name = "payment_cheque")
@DiscriminatorValue("CHEQUE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PaymentCheque extends Payment {

    @NotBlank
    @Column(nullable = false)
    private String numeroCheque;

    @NotBlank
    @Column(nullable = false)
    private String banque;

    @NotNull
    @Column(nullable = false)
    private LocalDate dateEcheance;
}