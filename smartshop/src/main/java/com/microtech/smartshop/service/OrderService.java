package com.microtech.smartshop.service;

import com.microtech.smartshop.dto.request.CreateOrderRequest;
import com.microtech.smartshop.dto.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request);
    OrderResponse confirmOrder(Long orderId);
    OrderResponse cancelOrder(Long orderId);
    OrderResponse getOrderById(Long orderId);
    Page<OrderResponse> getAllOrders(Pageable pageable);
    List<OrderResponse> getCommandeNoPaiment();
}
