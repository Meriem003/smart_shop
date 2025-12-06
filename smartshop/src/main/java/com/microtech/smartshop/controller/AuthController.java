package com.microtech.smartshop.controller;

import com.microtech.smartshop.entity.User;
import com.microtech.smartshop.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        User user = authService.login(username, password);
        
        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "role", user.getRole().name()
        ));
    }
    
    @Operation(summary = "Utilisateur connecté", description = "Récupérer les informations de l'utilisateur connecté")
    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getCurrentUser() {
        User user = authService.getCurrentUser();
        
        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "role", user.getRole().name()
        ));
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
