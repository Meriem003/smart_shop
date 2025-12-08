package com.microtech.smartshop.mapper;

import com.microtech.smartshop.dto.response.PaymentChequeResponse;
import com.microtech.smartshop.dto.response.PaymentEspecesResponse;
import com.microtech.smartshop.dto.response.PaymentVirementResponse;
import com.microtech.smartshop.entity.PaymentCheque;
import com.microtech.smartshop.entity.PaymentEspeces;
import com.microtech.smartshop.entity.PaymentVirement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "orderId", source = "payment.order.id")
    @Mapping(target = "montantRestant", source = "montantRestant")
    @Mapping(target = "typePaiement", constant = "ESPECES")
    PaymentEspecesResponse toEspecesResponse(PaymentEspeces payment, BigDecimal montantRestant);

    @Mapping(target = "orderId", source = "payment.order.id")
    @Mapping(target = "montantRestant", source = "montantRestant")
    @Mapping(target = "typePaiement", constant = "CHEQUE")
    PaymentChequeResponse toChequeResponse(PaymentCheque payment, BigDecimal montantRestant);

    @Mapping(target = "orderId", source = "payment.order.id")
    @Mapping(target = "montantRestant", source = "montantRestant")
    @Mapping(target = "typePaiement", constant = "VIREMENT")
    PaymentVirementResponse toVirementResponse(PaymentVirement payment, BigDecimal montantRestant);
}
