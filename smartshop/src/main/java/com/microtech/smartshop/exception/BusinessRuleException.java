package com.microtech.smartshop.exception;

//422
public class BusinessRuleException extends RuntimeException {
    
    public BusinessRuleException(String message) {
        super(message);
    }
}
