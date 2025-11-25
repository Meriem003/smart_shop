package com.microtech.smartshop.mapper;

import com.microtech.smartshop.dto.request.CustomerCreateRequest;
import com.microtech.smartshop.dto.request.CustomerUpdateRequest;
import com.microtech.smartshop.dto.response.CustomerResponse;
import com.microtech.smartshop.dto.response.CustomerStatsResponse;
import com.microtech.smartshop.entity.Customer;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "loyaltyTier", constant = "BASIC")
    @Mapping(target = "totalOrders", constant = "0")
    @Mapping(target = "totalSpent", expression = "java(java.math.BigDecimal.ZERO)")
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "orders", ignore = true)
    Customer toEntity(CustomerCreateRequest request);

    CustomerResponse toResponse(Customer customer);
    @Mapping(target = "customerId", source = "id")
    @Mapping(target = "loyaltyTierLabel", ignore = true)
    CustomerStatsResponse toStatsResponse(Customer customer);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "loyaltyTier", ignore = true)
    @Mapping(target = "totalOrders", ignore = true)
    @Mapping(target = "totalSpent", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "orders", ignore = true)
    void updateEntityFromRequest(CustomerUpdateRequest request, @MappingTarget Customer customer);
}