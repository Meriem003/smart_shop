package com.microtech.smartshop.service.impl;

import com.microtech.smartshop.dto.request.PromoCodeCreateRequest;
import com.microtech.smartshop.dto.response.PromoCodeResponse;
import com.microtech.smartshop.entity.PromoCode;
import com.microtech.smartshop.exception.BusinessRuleException;
import com.microtech.smartshop.exception.ResourceNotFoundException;
import com.microtech.smartshop.exception.ValidationException;
import com.microtech.smartshop.mapper.PromoCodeMapper;
import com.microtech.smartshop.repository.PromoCodeRepository;
import com.microtech.smartshop.service.PromoCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PromoCodeServiceImpl implements PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;
    private final PromoCodeMapper promoCodeMapper;

    @Override
    public PromoCodeResponse createPromoCode(PromoCodeCreateRequest request) {
        if (promoCodeRepository.existsByCode(request.getCode())) {
            throw new ValidationException("Un code promo avec ce code existe déjà: " + request.getCode());
        }

        if (!request.getCode().matches("PROMO-[A-Z0-9]{4}")) {
            throw new ValidationException("Format de code promo invalide. Format attendu: PROMO-XXXX");
        }
        BigDecimal pourcentageDecimal = request.getPourcentageRemise() != null
                ? request.getPourcentageRemise().divide(new BigDecimal("100"))
                : new BigDecimal("0.05");

        PromoCode promoCode = PromoCode.builder()
                .code(request.getCode())
                .pourcentageRemise(pourcentageDecimal)
                .usageUnique(request.getUsageUnique() != null && request.getUsageUnique())
                .used(false)
                .build();

        PromoCode saved = promoCodeRepository.save(promoCode);
        return promoCodeMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PromoCodeResponse> getAllPromoCodes() {
        return promoCodeRepository.findAll()
                .stream()
                .map(promoCodeMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PromoCodeResponse getPromoCodeById(Long id) {
        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PromoCode", "id", id));
        return promoCodeMapper.toResponse(promoCode);
    }

    @Override
    @Transactional(readOnly = true)
    public PromoCodeResponse getPromoCodeByCode(String code) {
        PromoCode promoCode = promoCodeRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Code promo non trouvé: " + code));
        return promoCodeMapper.toResponse(promoCode);
    }

    @Override
    public void deletePromoCode(Long id) {
        if (!promoCodeRepository.existsById(id)) {
            throw new ResourceNotFoundException("PromoCode", "id", id);
        }
        promoCodeRepository.deleteById(id);
    }

    @Override
    public PromoCodeResponse validateAndUsePromoCode(String code) {
        PromoCode promoCode = promoCodeRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Code promo invalide: " + code));

        if (promoCode.getUsageUnique() && promoCode.getUsed()) {
            throw new BusinessRuleException("Ce code promo a déjà été utilisé");
        }
        promoCode.setUsed(true);
        PromoCode updated = promoCodeRepository.save(promoCode);

        return promoCodeMapper.toResponse(updated);
    }
}