package com.microtech.smartshop.controller;

import com.microtech.smartshop.dto.request.CustomerCreateRequest;
import com.microtech.smartshop.dto.request.CustomerUpdateRequest;
import com.microtech.smartshop.dto.response.CustomerResponse;
import com.microtech.smartshop.dto.response.CustomerStatsResponse;
import com.microtech.smartshop.dto.response.OrderResponse;
import com.microtech.smartshop.entity.User;
import com.microtech.smartshop.enums.UserRole;
import com.microtech.smartshop.exception.ForbiddenException;
import com.microtech.smartshop.service.AuthService;
import com.microtech.smartshop.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "Clients", description = "Gestion des clients avec système de fidélité")
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final AuthService authService;

    @Operation(summary = "Créer un client", description = "Créer un nouveau client (ADMIN uniquement)")
    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerCreateRequest request) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        
        CustomerResponse response = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Consulter un client", description = "Récupérer les informations d'un client par ID")
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        if (user.getRole() == UserRole.CLIENT && (user.getCustomer() == null || user.getCustomer().getId() != id)) {
            throw new ForbiddenException("Vous ne pouvez consulter que votre propre profil");
        }
        
        CustomerResponse response = customerService.getCustomerById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerUpdateRequest request) {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        
        CustomerResponse response = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}/stats")
    public ResponseEntity<CustomerStatsResponse> getCustomerStats(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        
        if (user.getRole() == UserRole.CLIENT && (user.getCustomer() == null || user.getCustomer().getId() != id)) {
            throw new ForbiddenException("Vous ne pouvez consulter que vos propres statistiques");
        }
        
        CustomerStatsResponse response = customerService.getCustomerStats(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/orders")
    public ResponseEntity<List<OrderResponse>> getCustomerOrderHistory(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        
        if (user.getRole() == UserRole.CLIENT && (user.getCustomer() == null || user.getCustomer().getId() != id)) {
            throw new ForbiddenException("Vous ne pouvez consulter que votre propre historique de commandes");
        }
        
        List<OrderResponse> orders = customerService.getCustomerOrderHistory(id);
        return ResponseEntity.ok(orders);
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        User user = authService.getCurrentUser();
        if (user.getRole() != UserRole.ADMIN) {
            throw new ForbiddenException("Accès réservé aux administrateurs");
        }
        
        List<CustomerResponse> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }
}