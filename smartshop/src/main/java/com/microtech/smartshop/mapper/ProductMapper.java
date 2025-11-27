package com.microtech.smartshop.mapper;

import com.microtech.smartshop.dto.response.ProductResponse;
import com.microtech.smartshop.entity.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {
    ProductResponse toResponse(Product product);
}