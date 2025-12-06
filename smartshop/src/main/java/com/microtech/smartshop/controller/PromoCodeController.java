package com.microtech.smartshop.controller;

import com.microtech.smartshop.dto.request.PromoCodeCreateRequest;
import com.microtech.smartshop.dto.response.PromoCodeResponse;
import com.microtech.smartshop.entity.User;
import com.microtech.smartshop.enums.UserRole;
import com.microtech.smartshop.exception.ForbiddenException;
import com.microtech.smartshop.service.AuthService;
import com.microtech.smartshop.service.PromoCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Codes Promo", description = "Gestion des codes promotionnels avec dates de validité")
@RestController
@RequestMapping("/api/promo-codes")
@RequiredArgsConstructor
public class PromoCodeController {

    private final PromoCodeService promoCodeService;
    private final AuthService authService;

    @Operation(summary = "Créer un code promo", description = "Créer un nouveau code promotionnel avec pourcentage et dates")
    @PostMapping
    public ResponseEntity<PromoCodeResponse> createPromoCode(
            @Valid @RequestBody PromoCodeCreateRequest request) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        
        PromoCodeResponse response = promoCodeService.createPromoCode(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Lister les codes promo", description = "Récupérer tous les codes promotionnels")
    @GetMapping
    public ResponseEntity<List<PromoCodeResponse>> getAllPromoCodes() {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        List<PromoCodeResponse> promoCodes = promoCodeService.getAllPromoCodes();
        return ResponseEntity.ok(promoCodes);
    }

    @Operation(summary = "Consulter un code promo", description = "Récupérer un code promo par ID")
    @GetMapping("/{id}")
    public ResponseEntity<PromoCodeResponse> getPromoCodeById(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        PromoCodeResponse response = promoCodeService.getPromoCodeById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<PromoCodeResponse> getPromoCodeByCode(@PathVariable String code) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        PromoCodeResponse response = promoCodeService.getPromoCodeByCode(code);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromoCode(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        
        promoCodeService.deletePromoCode(id);
        return ResponseEntity.noContent().build();
    }
}