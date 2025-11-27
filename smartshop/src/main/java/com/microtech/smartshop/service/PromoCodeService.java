package com.microtech.smartshop.service;

import com.microtech.smartshop.dto.request.PromoCodeCreateRequest;
import com.microtech.smartshop.dto.response.PromoCodeResponse;

import java.util.List;

public interface PromoCodeService {
    PromoCodeResponse createPromoCode(PromoCodeCreateRequest request);
    List<PromoCodeResponse> getAllPromoCodes();
    PromoCodeResponse getPromoCodeById(Long id);
    PromoCodeResponse getPromoCodeByCode(String code);
    void deletePromoCode(Long id);
    PromoCodeResponse validateAndUsePromoCode(String code);
}