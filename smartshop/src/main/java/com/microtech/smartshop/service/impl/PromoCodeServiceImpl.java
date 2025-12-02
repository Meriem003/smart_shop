package com.microtech.smartshop.service.impl;

import com.microtech.smartshop.dto.request.PromoCodeCreateRequest;
import com.microtech.smartshop.dto.response.PromoCodeResponse;
import com.microtech.smartshop.entity.PromoCode;
import com.microtech.smartshop.mapper.PromoCodeMapper;
import com.microtech.smartshop.repository.PromoCodeRepository;
import com.microtech.smartshop.service.PromoCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PromoCodeServiceImpl implements PromoCodeService {

    private final PromoCodeRepository promoCodeRepository;
    private final PromoCodeMapper promoCodeMapper;

    @Override
    public PromoCodeResponse createPromoCode(PromoCodeCreateRequest request) {
        // Vérifier si le code existe déjà
        if (promoCodeRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Un code promo avec ce code existe déjà: " + request.getCode());
        }

        // Valider le format du code (PROMO-XXXX)
        if (!request.getCode().matches("PROMO-[A-Z0-9]{4}")) {
            throw new RuntimeException("Format de code promo invalide. Format attendu: PROMO-XXXX");
        }

        // Convertir le pourcentage (1-100) en décimal (0.01-1.00)
        BigDecimal pourcentageDecimal = request.getPourcentageRemise() != null
                ? request.getPourcentageRemise().divide(new BigDecimal("100"))
                : new BigDecimal("0.05");

        PromoCode promoCode = PromoCode.builder()
                .code(request.getCode())
                .pourcentageRemise(pourcentageDecimal)
                .usageUnique(request.getUsageUnique() != null
                        ? request.getUsageUnique()
                        : true)
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
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PromoCodeResponse getPromoCodeById(Long id) {
        PromoCode promoCode = promoCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Code promo non trouvé avec l'ID: " + id));
        return promoCodeMapper.toResponse(promoCode);
    }

    @Override
    @Transactional(readOnly = true)
    public PromoCodeResponse getPromoCodeByCode(String code) {
        PromoCode promoCode = promoCodeRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Code promo non trouvé: " + code));
        return promoCodeMapper.toResponse(promoCode);
    }

    @Override
    public void deletePromoCode(Long id) {
        if (!promoCodeRepository.existsById(id)) {
            throw new RuntimeException("Code promo non trouvé avec l'ID: " + id);
        }
        promoCodeRepository.deleteById(id);
    }

    @Override
    public PromoCodeResponse validateAndUsePromoCode(String code) {
        PromoCode promoCode = promoCodeRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Code promo invalide: " + code));

        // Vérifier si le code a déjà été utilisé (si usage unique)
        if (promoCode.getUsageUnique() && promoCode.getUsed()) {
            throw new RuntimeException("Ce code promo a déjà été utilisé");
        }

        // Marquer comme utilisé
        promoCode.setUsed(true);
        PromoCode updated = promoCodeRepository.save(promoCode);

        return promoCodeMapper.toResponse(updated);
    }
}