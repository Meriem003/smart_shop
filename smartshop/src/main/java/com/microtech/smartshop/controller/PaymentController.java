package com.microtech.smartshop.controller;

import com.microtech.smartshop.dto.request.PaymentChequeRequest;
import com.microtech.smartshop.dto.request.PaymentEspecesRequest;
import com.microtech.smartshop.dto.request.PaymentVirementRequest;
import com.microtech.smartshop.dto.response.PaymentChequeResponse;
import com.microtech.smartshop.dto.response.PaymentEspecesResponse;
import com.microtech.smartshop.dto.response.PaymentVirementResponse;
import com.microtech.smartshop.entity.User;
import com.microtech.smartshop.enums.UserRole;
import com.microtech.smartshop.exception.ForbiddenException;
import com.microtech.smartshop.service.AuthService;
import com.microtech.smartshop.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final AuthService authService;


    @PostMapping("/especes")
    public ResponseEntity<PaymentEspecesResponse> addPaymentEspeces(@Valid @RequestBody PaymentEspecesRequest request) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        
        PaymentEspecesResponse response = paymentService.addPaymentEspeces(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/cheque")
    public ResponseEntity<PaymentChequeResponse> addPaymentCheque(@Valid @RequestBody PaymentChequeRequest request) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        
        PaymentChequeResponse response = paymentService.addPaymentCheque(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    

    @PostMapping("/virement")
    public ResponseEntity<PaymentVirementResponse> addPaymentVirement(@Valid @RequestBody PaymentVirementRequest request) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        
        PaymentVirementResponse response = paymentService.addPaymentVirement(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
