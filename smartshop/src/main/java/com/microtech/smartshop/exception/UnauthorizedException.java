package com.microtech.smartshop.exception;

//401
public class UnauthorizedException extends RuntimeException {
    
    public UnauthorizedException(String message) {
        super(message);
    }
    public UnauthorizedException() {
        super("Authentification requise");
    }
}
