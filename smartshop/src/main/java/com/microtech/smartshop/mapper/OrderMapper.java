package com.microtech.smartshop.mapper;

import com.microtech.smartshop.dto.response.OrderResponse;
import com.microtech.smartshop.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(target = "itemsCount", expression = "java(order.getItems() != null ? order.getItems().size() : 0)")
    OrderResponse toResponse(Order order);
    List<OrderResponse> toResponseList(List<Order> orders);
}