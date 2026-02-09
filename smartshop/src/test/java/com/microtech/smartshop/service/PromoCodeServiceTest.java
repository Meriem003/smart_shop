package com.microtech.smartshop.service;

import com.microtech.smartshop.dto.request.PromoCodeCreateRequest;
import com.microtech.smartshop.dto.response.PromoCodeResponse;
import com.microtech.smartshop.entity.PromoCode;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
//integration Mockito m3a JUnit 5
class PromoCodeServiceTest {

    @Mock
    private PromoCodeRepository promoCodeRepository;

    @Mock
    private PromoCodeMapper promoCodeMapper;

    @InjectMocks
    private PromoCodeServiceImpl promoCodeService;


    @Test
    void test1_creerCodePromo_erreur_si_code_existe_deja() {
        PromoCodeCreateRequest request = new PromoCodeCreateRequest();
        request.setCode("PROMO-TEST");
        when(promoCodeRepository.existsByCode("PROMO-TEST")).thenReturn(true);
        assertThrows(ValidationException.class, () -> promoCodeService.createPromoCode(request));
    }

    @Test
    void test2_creerCodePromo_erreur_si_format_invalide() {
        PromoCodeCreateRequest request = new PromoCodeCreateRequest();
        request.setCode("INVALID");

        assertThrows(ValidationException.class, () -> promoCodeService.createPromoCode(request));
    }

    @Test
    void test3_creerCodePromo_succes_avec_donnees_valides() {
        PromoCodeCreateRequest request = new PromoCodeCreateRequest();
        request.setCode("PROMO-ABC1");
        
        PromoCode savedPromoCode = new PromoCode();
        savedPromoCode.setCode("PROMO-ABC1");
        
        PromoCodeResponse response = new PromoCodeResponse();
        response.setCode("PROMO-ABC1");

        when(promoCodeRepository.existsByCode("PROMO-ABC1")).thenReturn(false);
        when(promoCodeRepository.save(any(PromoCode.class))).thenReturn(savedPromoCode);
        when(promoCodeMapper.toResponse(savedPromoCode)).thenReturn(response);

        PromoCodeResponse result = promoCodeService.createPromoCode(request);

        assertNotNull(result);
        assertEquals("PROMO-ABC1", result.getCode());
    }
    @Test
    void test4_recupererCodePromo_erreur_si_non_trouve() {
        when(promoCodeRepository.findByCode("INVALID")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
                () -> promoCodeService.getPromoCodeByCode("INVALID"));
    }

    @Test
    void test5_recupererCodePromo_succes_si_existe() {
        PromoCode promoCode = new PromoCode();
        promoCode.setCode("PROMO-TEST");
        
        PromoCodeResponse response = new PromoCodeResponse();
        response.setCode("PROMO-TEST");

        when(promoCodeRepository.findByCode("PROMO-TEST")).thenReturn(Optional.of(promoCode));
        when(promoCodeMapper.toResponse(promoCode)).thenReturn(response);

        PromoCodeResponse result = promoCodeService.getPromoCodeByCode("PROMO-TEST");

        assertNotNull(result);
        assertEquals("PROMO-TEST", result.getCode());
    }

}
