package com.microtech.smartshop.repository;

import com.microtech.smartshop.entity.Order;
import com.microtech.smartshop.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerIdOrderByDateCommandeDesc(Long customerId);
    List<Order> findByCustomerIdAndStatus(Long customerId, OrderStatus status);
    List<Order> findByStatus(OrderStatus status);
    @Query("SELECT COUNT(o) FROM Order o WHERE o.customer.id = :customerId AND o.status = 'CONFIRMED'")
    int countConfirmedOrdersByCustomerId(@Param("customerId") Long customerId);
    @Query("SELECT COALESCE(SUM(o.totalTTC), 0) FROM Order o WHERE o.customer.id = :customerId AND o.status = 'CONFIRMED'")
    BigDecimal sumTotalSpentByCustomerId(@Param("customerId") Long customerId);
    List<Order> findByDateCommandeBetween(LocalDateTime startDate, LocalDateTime endDate);
}