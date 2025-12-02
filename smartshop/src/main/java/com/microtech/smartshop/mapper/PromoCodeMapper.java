package com.microtech.smartshop.mapper;

import com.microtech.smartshop.dto.response.PromoCodeResponse;
import com.microtech.smartshop.entity.PromoCode;
import org.mapstruct.Mapper;
import org.mapstruct.AfterMapping;
import org.mapstruct.MappingTarget;

import java.math.BigDecimal;

@Mapper(componentModel = "spring")
public interface PromoCodeMapper {

    PromoCodeResponse toResponse(PromoCode promoCode);
    @AfterMapping
    default void convertToPercentage(@MappingTarget PromoCodeResponse response) {
        if (response.getPourcentageRemise() != null) {
            response.setPourcentageRemise(response.getPourcentageRemise().multiply(new BigDecimal("100")));
        }
    }
}