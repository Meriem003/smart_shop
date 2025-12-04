package com.microtech.smartshop.service;

import com.microtech.smartshop.dto.request.PaymentChequeRequest;
import com.microtech.smartshop.dto.request.PaymentEspecesRequest;
import com.microtech.smartshop.dto.request.PaymentVirementRequest;
import com.microtech.smartshop.dto.response.PaymentChequeResponse;
import com.microtech.smartshop.dto.response.PaymentEspecesResponse;
import com.microtech.smartshop.dto.response.PaymentVirementResponse;


public interface PaymentService {

    PaymentEspecesResponse addPaymentEspeces(PaymentEspecesRequest request);
    PaymentChequeResponse addPaymentCheque(PaymentChequeRequest request);
    PaymentVirementResponse addPaymentVirement(PaymentVirementRequest request);
}
