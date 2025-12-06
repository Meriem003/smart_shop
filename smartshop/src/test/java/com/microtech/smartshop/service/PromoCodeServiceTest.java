package com.microtech.smartshop.service;

import com.microtech.smartshop.dto.request.PromoCodeCreateRequest;
import com.microtech.smartshop.dto.response.PromoCodeResponse;
import com.microtech.smartshop.entity.PromoCode;
import com.microtech.smartshop.exception.BusinessRuleException;
import com.microtech.smartshop.exception.ResourceNotFoundException;
import com.microtech.smartshop.exception.ValidationException;
import com.microtech.smartshop.mapper.PromoCodeMapper;
import com.microtech.smartshop.repository.PromoCodeRepository;
import com.microtech.smartshop.service.impl.PromoCodeServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PromoCodeServiceTest {

    @Mock
    private PromoCodeRepository promoCodeRepository;

    @Mock
    private PromoCodeMapper promoCodeMapper;

    @InjectMocks
    private PromoCodeServiceImpl promoCodeService;

    @Test
    void createPromoCode_shouldThrowException_whenCodeAlreadyExists() {
        PromoCodeCreateRequest request = new PromoCodeCreateRequest();
        request.setCode("PROMO-TEST");

        when(promoCodeRepository.existsByCode("PROMO-TEST")).thenReturn(true);

        assertThrows(ValidationException.class, () -> promoCodeService.createPromoCode(request));
    }

    @Test
    void createPromoCode_shouldThrowException_whenCodeFormatInvalid() {
        PromoCodeCreateRequest request = new PromoCodeCreateRequest();
        request.setCode("INVALID");

        when(promoCodeRepository.existsByCode("INVALID")).thenReturn(false);

        assertThrows(ValidationException.class, () -> promoCodeService.createPromoCode(request));
    }

    @Test
    void createPromoCode_shouldCreateSuccessfully_whenValid() {
        PromoCodeCreateRequest request = new PromoCodeCreateRequest();
        request.setCode("PROMO-ABC1");
        request.setPourcentageRemise(new BigDecimal("10"));
        request.setUsageUnique(true);

        PromoCode savedPromoCode = new PromoCode();
        savedPromoCode.setId(1L);
        savedPromoCode.setCode("PROMO-ABC1");

        PromoCodeResponse response = new PromoCodeResponse();
        response.setId(1L);
        response.setCode("PROMO-ABC1");

        when(promoCodeRepository.existsByCode("PROMO-ABC1")).thenReturn(false);
        when(promoCodeRepository.save(any(PromoCode.class))).thenReturn(savedPromoCode);
        when(promoCodeMapper.toResponse(savedPromoCode)).thenReturn(response);

        PromoCodeResponse result = promoCodeService.createPromoCode(request);

        assertNotNull(result);
        assertEquals("PROMO-ABC1", result.getCode());
        verify(promoCodeRepository).save(any(PromoCode.class));
    }

    @Test
    void validateAndUsePromoCode_shouldThrowException_whenCodeNotFound() {
        when(promoCodeRepository.findByCode("INVALID")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
            () -> promoCodeService.validateAndUsePromoCode("INVALID"));
    }

    @Test
    void validateAndUsePromoCode_shouldThrowException_whenAlreadyUsed() {
        PromoCode promoCode = new PromoCode();
        promoCode.setCode("PROMO-TEST");
        promoCode.setUsageUnique(true);
        promoCode.setUsed(true);

        when(promoCodeRepository.findByCode("PROMO-TEST")).thenReturn(Optional.of(promoCode));

        assertThrows(BusinessRuleException.class, 
            () -> promoCodeService.validateAndUsePromoCode("PROMO-TEST"));
    }

    @Test
    void validateAndUsePromoCode_shouldMarkAsUsed_whenValid() {
        PromoCode promoCode = new PromoCode();
        promoCode.setCode("PROMO-TEST");
        promoCode.setUsageUnique(true);
        promoCode.setUsed(false);

        PromoCodeResponse response = new PromoCodeResponse();
        response.setCode("PROMO-TEST");

        when(promoCodeRepository.findByCode("PROMO-TEST")).thenReturn(Optional.of(promoCode));
        when(promoCodeRepository.save(promoCode)).thenReturn(promoCode);
        when(promoCodeMapper.toResponse(promoCode)).thenReturn(response);

        PromoCodeResponse result = promoCodeService.validateAndUsePromoCode("PROMO-TEST");

        assertTrue(promoCode.getUsed());
        assertNotNull(result);
        verify(promoCodeRepository).save(promoCode);
    }

    @Test
    void deletePromoCode_shouldThrowException_whenNotFound() {
        when(promoCodeRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, 
            () -> promoCodeService.deletePromoCode(1L));
    }
}
