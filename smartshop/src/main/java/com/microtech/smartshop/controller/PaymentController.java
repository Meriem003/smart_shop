package com.microtech.smartshop.controller;

import com.microtech.smartshop.dto.request.PaymentChequeRequest;
import com.microtech.smartshop.dto.request.PaymentEspecesRequest;
import com.microtech.smartshop.dto.request.PaymentVirementRequest;
import com.microtech.smartshop.dto.response.PaymentChequeResponse;
import com.microtech.smartshop.dto.response.PaymentEspecesResponse;
import com.microtech.smartshop.dto.response.PaymentResponse;
import com.microtech.smartshop.dto.response.PaymentVirementResponse;
import com.microtech.smartshop.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "Paiements", description = "Gestion des paiements multi-méthodes (Espèces, Chèque, Virement)")
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "Paiement en espèces", description = "Enregistrer un paiement en espèces pour une commande")
    @PostMapping("/especes")
    public ResponseEntity<PaymentEspecesResponse> addPaymentEspeces(@Valid @RequestBody PaymentEspecesRequest request) {
        PaymentEspecesResponse response = paymentService.addPaymentEspeces(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Paiement par chèque", description = "Enregistrer un paiement par chèque avec numéro et banque")
    @PostMapping("/cheque")
    public ResponseEntity<PaymentChequeResponse> addPaymentCheque(@Valid @RequestBody PaymentChequeRequest request) {
        PaymentChequeResponse response = paymentService.addPaymentCheque(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Paiement par virement", description = "Enregistrer un paiement par virement bancaire")
    @PostMapping("/virement")
    public ResponseEntity<PaymentVirementResponse> addPaymentVirement(@Valid @RequestBody PaymentVirementRequest request) {
        PaymentVirementResponse response = paymentService.addPaymentVirement(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Liste des paiements", description = "Récupérer la liste paginée de tous les paiements")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPayments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "datePayment") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {
        
        if (size > 100) size = 100;
        if (size < 1) size = 10;
        
        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<PaymentResponse> payments = paymentService.getAllPayments(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", payments.getContent());
        response.put("totalElements", payments.getTotalElements());
        response.put("totalPages", payments.getTotalPages());
        response.put("currentPage", payments.getNumber());
        response.put("pageSize", payments.getSize());
        response.put("hasNext", payments.hasNext());
        response.put("hasPrevious", payments.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
}
