package com.microtech.smartshop.service;

import com.microtech.smartshop.entity.User;

public interface AuthService {
    User login(String username, String password);
    User getCurrentUser();
    void logout();
}
