package com.microtech.smartshop.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentChequeRequest {

    @NotNull
    private Long orderId;

    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal montant;

    @NotBlank
    private String numeroCheque;

    @NotBlank
    private String banque;

    @NotNull
    private LocalDate dateEcheance;
}
