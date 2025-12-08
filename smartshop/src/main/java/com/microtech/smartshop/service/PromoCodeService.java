package com.microtech.smartshop.service;

import com.microtech.smartshop.dto.request.PromoCodeCreateRequest;
import com.microtech.smartshop.dto.response.PromoCodeResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PromoCodeService {
    PromoCodeResponse createPromoCode(PromoCodeCreateRequest request);
    Page<PromoCodeResponse> getAllPromoCodes(Pageable pageable);
    PromoCodeResponse getPromoCodeById(Long id);
    PromoCodeResponse getPromoCodeByCode(String code);
    void deletePromoCode(Long id);
}