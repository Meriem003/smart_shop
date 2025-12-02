package com.microtech.smartshop.exception;

public class ValidationException extends RuntimeException {
    
    //400
    public ValidationException(String message) {
        super(message);
    }
}
