package com.microtech.smartshop.mapper;

import com.microtech.smartshop.dto.response.OrderItemResponse;
import com.microtech.smartshop.dto.response.OrderResponse;
import com.microtech.smartshop.entity.Order;
import com.microtech.smartshop.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "customerId", source = "customer.id")
    @Mapping(target = "customerNom", source = "customer.nom")
    @Mapping(target = "items", source = "items")
    OrderResponse toResponse(Order order);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productNom", source = "product.nom")
    OrderItemResponse toItemResponse(OrderItem orderItem);

    List<OrderResponse> toResponseList(List<Order> orders);
}