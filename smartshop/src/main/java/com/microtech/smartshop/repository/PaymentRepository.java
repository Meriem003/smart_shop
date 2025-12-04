package com.microtech.smartshop.repository;

import com.microtech.smartshop.entity.Payment;
import com.microtech.smartshop.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByOrderId(Long orderId);
    
    List<Payment> findByStatus(PaymentStatus status);
    
    List<Payment> findByOrderIdAndStatus(Long orderId, PaymentStatus status);
}
