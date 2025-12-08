package com.microtech.smartshop.service;

import com.microtech.smartshop.dto.request.PaymentChequeRequest;
import com.microtech.smartshop.dto.request.PaymentEspecesRequest;
import com.microtech.smartshop.dto.request.PaymentVirementRequest;
import com.microtech.smartshop.dto.response.PaymentChequeResponse;
import com.microtech.smartshop.dto.response.PaymentEspecesResponse;
import com.microtech.smartshop.dto.response.PaymentVirementResponse;
import com.microtech.smartshop.dto.response.PaymentResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface PaymentService {

    PaymentEspecesResponse addPaymentEspeces(PaymentEspecesRequest request);
    PaymentChequeResponse addPaymentCheque(PaymentChequeRequest request);
    PaymentVirementResponse addPaymentVirement(PaymentVirementRequest request);
    Page<PaymentResponse> getAllPayments(Pageable pageable);
}
