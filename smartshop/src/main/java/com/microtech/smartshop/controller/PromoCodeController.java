package com.microtech.smartshop.controller;

import com.microtech.smartshop.dto.request.PromoCodeCreateRequest;
import com.microtech.smartshop.dto.response.PromoCodeResponse;
import com.microtech.smartshop.service.PromoCodeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promo-codes")
@RequiredArgsConstructor
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    @PostMapping
    public ResponseEntity<PromoCodeResponse> createPromoCode(
            @Valid @RequestBody PromoCodeCreateRequest request) {
        PromoCodeResponse response = promoCodeService.createPromoCode(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PromoCodeResponse>> getAllPromoCodes() {
        List<PromoCodeResponse> promoCodes = promoCodeService.getAllPromoCodes();
        return ResponseEntity.ok(promoCodes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromoCodeResponse> getPromoCodeById(@PathVariable Long id) {
        PromoCodeResponse response = promoCodeService.getPromoCodeById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<PromoCodeResponse> getPromoCodeByCode(@PathVariable String code) {
        PromoCodeResponse response = promoCodeService.getPromoCodeByCode(code);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromoCode(@PathVariable Long id) {
        promoCodeService.deletePromoCode(id);
        return ResponseEntity.noContent().build();
    }
}