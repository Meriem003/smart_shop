package com.microtech.smartshop.controller;

import com.microtech.smartshop.dto.request.CustomerCreateRequest;
import com.microtech.smartshop.dto.request.CustomerUpdateRequest;
import com.microtech.smartshop.dto.response.CustomerResponse;
import com.microtech.smartshop.dto.response.CustomerStatsResponse;
import com.microtech.smartshop.dto.response.OrderResponse;
import com.microtech.smartshop.service.CustomerService;
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
import java.util.List;
import java.util.Map;

@Tag(name = "Clients", description = "Gestion des clients avec système de fidélité")
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @Operation(summary = "Créer un client", description = "Créer un nouveau client")
    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerCreateRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "Consulter un client", description = "Récupérer les informations d'un client par ID")
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Long id) {
        CustomerResponse response = customerService.getCustomerById(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Modifier un client", description = "Mettre à jour les informations d'un client")
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerUpdateRequest request) {
        CustomerResponse response = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Statistiques du client", description = "Récupérer les statistiques d'achat et de fidélité d'un client")
    @GetMapping("/{id}/stats")
    public ResponseEntity<CustomerStatsResponse> getCustomerStats(@PathVariable Long id) {
        CustomerStatsResponse response = customerService.getCustomerStats(id);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Historique des commandes", description = "Récupérer l'historique des commandes d'un client")
    @GetMapping("/{id}/orders")
    public ResponseEntity<List<OrderResponse>> getCustomerOrderHistory(@PathVariable Long id) {
        List<OrderResponse> orders = customerService.getCustomerOrderHistory(id);
        return ResponseEntity.ok(orders);
    }

    @Operation(summary = "Liste des clients", description = "Récupérer la liste paginée de tous les clients")
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCustomers(
            @RequestParam(required = false) String nom,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDirection) {
        
        if (size > 100) size = 100;
        if (size < 1) size = 10;
        
        Sort.Direction direction = sortDirection.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        
        Page<CustomerResponse> customers = customerService.getAllCustomers(nom, pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", customers.getContent());
        response.put("totalElements", customers.getTotalElements());
        response.put("totalPages", customers.getTotalPages());
        response.put("currentPage", customers.getNumber());
        response.put("pageSize", customers.getSize());
        response.put("hasNext", customers.hasNext());
        response.put("hasPrevious", customers.hasPrevious());
        
        return ResponseEntity.ok(response);
    }
}
