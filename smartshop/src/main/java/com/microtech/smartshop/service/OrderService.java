package com.microtech.smartshop.service;

import com.microtech.smartshop.dto.request.CreateOrderRequest;
import com.microtech.smartshop.dto.response.OrderResponse;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request);
    OrderResponse confirmOrder(Long orderId);
    OrderResponse cancelOrder(Long orderId);
}
