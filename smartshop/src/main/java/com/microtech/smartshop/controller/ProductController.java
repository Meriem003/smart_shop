package com.microtech.smartshop.controller;

import com.microtech.smartshop.dto.request.ProductCreateRequest;
import com.microtech.smartshop.dto.request.ProductUpdateRequest;
import com.microtech.smartshop.dto.response.ProductResponse;
import com.microtech.smartshop.entity.User;
import com.microtech.smartshop.enums.UserRole;
import com.microtech.smartshop.exception.ForbiddenException;
import com.microtech.smartshop.service.AuthService;
import com.microtech.smartshop.service.ProductService;
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
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Tag(name = "Produits", description = "Gestion du catalogue produits avec pagination")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final AuthService authService;

    @Operation(summary = "Créer un produit", description = "Ajouter un nouveau produit au catalogue (ADMIN uniquement)")
    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Consulter un produit", description = "Récupérer les détails d'un produit par ID")
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        
        productService.deleteProduct(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Produit supprimé avec succès");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "ASC") String sortDirection) {

        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(0, 10, Sort.by(direction, "id"));

        Page<ProductResponse> products = productService.getAllProducts(nom, minPrice, maxPrice, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", products.getContent());
        response.put("totalElements", products.getTotalElements());
        response.put("totalPages", products.getTotalPages());
        response.put("currentPage", products.getNumber());
        response.put("pageSize", products.getSize());
        
        return ResponseEntity.ok(response);
    }
}