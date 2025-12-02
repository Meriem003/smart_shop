package com.microtech.smartshop.exception;


//403
public class ForbiddenException extends RuntimeException {
    
    public ForbiddenException(String message) {
        super(message);
    }
    
    public ForbiddenException() {
        super("Accès refusé : permissions insuffisantes");
    }
}
