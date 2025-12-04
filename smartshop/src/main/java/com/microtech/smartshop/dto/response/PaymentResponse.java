package com.microtech.smartshop.dto.response;

import com.microtech.smartshop.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PaymentResponse {

    private Long id;
    private Integer numeroPayment;
    private BigDecimal montant;
    private LocalDateTime datePayment;
    private LocalDateTime dateEncaissement;
    private PaymentStatus status;
    private Long orderId;
    private BigDecimal montantRestant;
    private String typePaiement;
}
