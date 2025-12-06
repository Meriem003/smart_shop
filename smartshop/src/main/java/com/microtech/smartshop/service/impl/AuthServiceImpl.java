package com.microtech.smartshop.service.impl;

import com.microtech.smartshop.entity.User;
import com.microtech.smartshop.exception.UnauthorizedException;
import com.microtech.smartshop.repository.UserRepository;
import com.microtech.smartshop.service.AuthService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final HttpSession httpSession;
    
    private static final String USER_ID_SESSION_KEY = "userId";

    @Override
    public User login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Nom d'utilisateur ou mot de passe incorrect"));        
        if (!user.getPassword().equals(password)) {
            throw new UnauthorizedException("Nom d'utilisateur ou mot de passe incorrect");
        }
        httpSession.setAttribute(USER_ID_SESSION_KEY, user.getId());
        return user;
    }

    @Override
    public User getCurrentUser() {
        Long userId = (Long) httpSession.getAttribute(USER_ID_SESSION_KEY);
        if (userId == null) {
            throw new UnauthorizedException("Aucun utilisateur connecté");
        }        
        return userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("Session invalide"));
    }

    @Override
    public void logout() {
        httpSession.invalidate();
    }
}
