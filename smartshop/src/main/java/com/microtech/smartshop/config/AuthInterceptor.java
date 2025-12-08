package com.microtech.smartshop.config;

import com.microtech.smartshop.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    
    private static final String USER_ID_SESSION_KEY = "userId";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        HttpSession session = request.getSession(false);        
        if (session == null || session.getAttribute(USER_ID_SESSION_KEY) == null) {
            throw new UnauthorizedException("Authentification requise");
        }
        return true;
    }
}