package com.microtech.smartshop.controller;

import com.microtech.smartshop.dto.request.PromoCodeCreateRequest;
import com.microtech.smartshop.dto.response.PromoCodeResponse;
import com.microtech.smartshop.service.PromoCodeService;
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

@Tag(name = "Codes Promo", description = "Gestion des codes promotionnels avec dates de validité")
@RestController
@RequestMapping("/api/promo-codes")
@RequiredArgsConstructor
public class PromoCodeController {

    private final PromoCodeService promoCodeService;

    @Operation(summary = "Créer un code promo", description = "Créer un nouveau code promotionnel avec pourcentage et dates")
    @PostMapping
    public ResponseEntity<PromoCodeResponse> createPromoCode(
            @Valid @RequestBody PromoCodeCreateRequest request) {
        PromoCodeResponse response = promoCodeService.createPromoCode(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Lister les codes promo", description = "Récupérer la liste paginée de tous les codes promotionnels")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPromoCodes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {
        
        if (size > 100) size = 100;
        if (size < 1) size = 10;
        
        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<PromoCodeResponse> promoCodes = promoCodeService.getAllPromoCodes(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", promoCodes.getContent());
        response.put("totalElements", promoCodes.getTotalElements());
        response.put("totalPages", promoCodes.getTotalPages());
        response.put("currentPage", promoCodes.getNumber());
        response.put("pageSize", promoCodes.getSize());
        response.put("hasNext", promoCodes.hasNext());
        response.put("hasPrevious", promoCodes.hasPrevious());
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Consulter un code promo", description = "Récupérer un code promo par ID")
    @GetMapping("/{id}")
    public ResponseEntity<PromoCodeResponse> getPromoCodeById(@PathVariable Long id) {
        PromoCodeResponse response = promoCodeService.getPromoCodeById(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Rechercher par code", description = "Récupérer un code promo par son code textuel")
    @GetMapping("/code/{code}")
    public ResponseEntity<PromoCodeResponse> getPromoCodeByCode(@PathVariable String code) {
        PromoCodeResponse response = promoCodeService.getPromoCodeByCode(code);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Supprimer un code promo", description = "Supprimer un code promotionnel")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromoCode(@PathVariable Long id) {
        promoCodeService.deletePromoCode(id);
        return ResponseEntity.noContent().build();
    }
}
