package com.microtech.smartshop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class PaymentChequeResponse extends PaymentResponse {

    private String numeroCheque;
    private String banque;
    private LocalDate dateEcheance;
}
