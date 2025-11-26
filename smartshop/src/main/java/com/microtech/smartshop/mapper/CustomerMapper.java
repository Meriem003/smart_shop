package com.microtech.smartshop.mapper;

import com.microtech.smartshop.dto.response.CustomerResponse;
import com.microtech.smartshop.dto.response.CustomerStatsResponse;
import com.microtech.smartshop.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    @Mapping(target = "username", source = "user.username")
    CustomerResponse toResponse(Customer customer);
    @Mapping(target = "customerId", source = "id")
    @Mapping(target = "username", source = "user.username")
    CustomerStatsResponse toStatsResponse(Customer customer);
}