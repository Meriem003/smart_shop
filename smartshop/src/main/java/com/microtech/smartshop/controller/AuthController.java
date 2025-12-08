package com.microtech.smartshop.controller;

import com.microtech.smartshop.dto.request.LoginRequest;
import com.microtech.smartshop.dto.response.LoginResponse;
import com.microtech.smartshop.dto.response.UserResponse;
import com.microtech.smartshop.entity.User;
import com.microtech.smartshop.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Authentification", description = "Gestion de l'authentification et des sessions")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    
    @Operation(summary = "Connexion", description = "Authentification d'un utilisateur ADMIN ou CLIENT")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.login(request.getUsername(), request.getPassword());
        
        LoginResponse response = new LoginResponse(
                user.getUsername(),
                user.getRole().name()
        );
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Utilisateur connecté", description = "Récupérer les informations de l'utilisateur connecté")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        User user = authService.getCurrentUser();
        
        UserResponse response = new UserResponse(
                user.getUsername(),
                user.getRole().name()
        );
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Déconnexion", description = "Déconnexion de l'utilisateur et fermeture de la session")
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        authService.logout();
        
        return ResponseEntity.ok(Map.of(
                "message", "Déconnexion réussie"
        ));
    }
}