package com.microtech.smartshop.mapper;

import com.microtech.smartshop.dto.response.PromoCodeResponse;
import com.microtech.smartshop.entity.PromoCode;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PromoCodeMapper {

    PromoCodeResponse toResponse(PromoCode promoCode);
}