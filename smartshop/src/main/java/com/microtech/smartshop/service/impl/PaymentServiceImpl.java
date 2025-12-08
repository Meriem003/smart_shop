package com.microtech.smartshop.service.impl;

import com.microtech.smartshop.dto.request.PaymentChequeRequest;
import com.microtech.smartshop.dto.request.PaymentEspecesRequest;
import com.microtech.smartshop.dto.request.PaymentVirementRequest;
import com.microtech.smartshop.dto.response.PaymentChequeResponse;
import com.microtech.smartshop.dto.response.PaymentEspecesResponse;
import com.microtech.smartshop.dto.response.PaymentResponse;
import com.microtech.smartshop.dto.response.PaymentVirementResponse;
import com.microtech.smartshop.entity.*;
import com.microtech.smartshop.enums.OrderStatus;
import com.microtech.smartshop.enums.PaymentStatus;
import com.microtech.smartshop.exception.BusinessRuleException;
import com.microtech.smartshop.exception.ResourceNotFoundException;
import com.microtech.smartshop.mapper.PaymentMapper;
import com.microtech.smartshop.repository.OrderRepository;
import com.microtech.smartshop.repository.PaymentRepository;
import com.microtech.smartshop.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final PaymentMapper paymentMapper;
    private static final BigDecimal LIMITE_ESPECES = new BigDecimal("20000");

    @Override
    @Transactional
    public PaymentEspecesResponse addPaymentEspeces(PaymentEspecesRequest request) {
        
        if (request.getMontant().compareTo(LIMITE_ESPECES) > 0) {
            throw new BusinessRuleException(
                    "Le montant en espèces ne peut pas dépasser 20 000 DH (limite légale Art. 193 CGI). " +
                    "Montant demandé : " + request.getMontant() + " DH");
        }

        Order order = getOrderAndValidate(request.getOrderId(), request.getMontant());

        int numeroPayment = order.getPayments().size() + 1;

        PaymentEspeces payment = PaymentEspeces.builder()
                .order(order)
                .numeroPayment(numeroPayment)
                .montant(request.getMontant().setScale(2, RoundingMode.HALF_UP))
                .numeroRecu(request.getNumeroRecu())
                .datePayment(LocalDateTime.now())
                .dateEncaissement(LocalDateTime.now())
                .status(PaymentStatus.ENCAISSE)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        updateOrderMontantRestant(order, request.getMontant());

        return paymentMapper.toEspecesResponse((PaymentEspeces) savedPayment, order.getMontantRestant());
    }

    @Override
    @Transactional
    public PaymentChequeResponse addPaymentCheque(PaymentChequeRequest request) {
        
        Order order = getOrderAndValidate(request.getOrderId(), request.getMontant());

        int numeroPayment = order.getPayments().size() + 1;

        PaymentCheque payment = PaymentCheque.builder()
                .order(order)
                .numeroPayment(numeroPayment)
                .montant(request.getMontant().setScale(2, RoundingMode.HALF_UP))
                .numeroCheque(request.getNumeroCheque())
                .banque(request.getBanque())
                .dateEcheance(request.getDateEcheance())
                .datePayment(LocalDateTime.now())
                .status(PaymentStatus.EN_ATTENTE)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        updateOrderMontantRestant(order, request.getMontant());

        return paymentMapper.toChequeResponse((PaymentCheque) savedPayment, order.getMontantRestant());
    }

    @Override
    @Transactional
    public PaymentVirementResponse addPaymentVirement(PaymentVirementRequest request) {
        
        Order order = getOrderAndValidate(request.getOrderId(), request.getMontant());

        int numeroPayment = order.getPayments().size() + 1;

        PaymentVirement payment = PaymentVirement.builder()
                .order(order)
                .numeroPayment(numeroPayment)
                .montant(request.getMontant().setScale(2, RoundingMode.HALF_UP))
                .referenceVirement(request.getReferenceVirement())
                .banque(request.getBanque())
                .datePayment(LocalDateTime.now())
                .dateEncaissement(LocalDateTime.now())
                .status(PaymentStatus.ENCAISSE)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        updateOrderMontantRestant(order, request.getMontant());

        return paymentMapper.toVirementResponse((PaymentVirement) savedPayment, order.getMontantRestant());
    }


    private Order getOrderAndValidate(Long orderId, BigDecimal montantPayment) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Commande non trouvée avec l'ID : " + orderId));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessRuleException(
                    "Impossible d'ajouter un paiement. La commande est en statut : " + order.getStatus() +
                    ". Seules les commandes PENDING peuvent recevoir des paiements.");
        }

        if (montantPayment.compareTo(order.getMontantRestant()) > 0) {
            throw new BusinessRuleException(
                    "Le montant du paiement (" + montantPayment + " DH) dépasse le montant restant (" +
                    order.getMontantRestant() + " DH)");
        }

        return order;
    }

    private void updateOrderMontantRestant(Order order, BigDecimal montantPayment) {
        BigDecimal nouveauMontantRestant = order.getMontantRestant()
                .subtract(montantPayment)
                .setScale(2, RoundingMode.HALF_UP);

        order.setMontantRestant(nouveauMontantRestant);
        orderRepository.save(order);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable)
                .map(payment -> {
                    PaymentResponse response = new PaymentResponse();
                    response.setId(payment.getId());
                    response.setNumeroPayment(payment.getNumeroPayment());
                    response.setMontant(payment.getMontant());
                    response.setDatePayment(payment.getDatePayment());
                    response.setDateEncaissement(payment.getDateEncaissement());
                    response.setStatus(payment.getStatus());
                    response.setOrderId(payment.getOrder().getId());
                    response.setMontantRestant(payment.getOrder().getMontantRestant());
                    
                    if (payment instanceof PaymentEspeces) {
                        response.setTypePaiement("ESPECES");
                    } else if (payment instanceof PaymentCheque) {
                        response.setTypePaiement("CHEQUE");
                    } else if (payment instanceof PaymentVirement) {
                        response.setTypePaiement("VIREMENT");
                    }
                    
                    return response;
                });
    }
}
