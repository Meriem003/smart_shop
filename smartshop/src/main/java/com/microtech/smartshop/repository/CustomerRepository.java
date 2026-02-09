package com.microtech.smartshop.repository;

import com.microtech.smartshop.entity.Customer;
import com.microtech.smartshop.enums.CustomerTier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Customer> findByLoyaltyTier(CustomerTier tier);
    List<Customer> findByNomContainingIgnoreCase(String nom);
    Page<Customer> findByNomContainingIgnoreCase(String nom, Pageable pageable);
    @Query("SELECT COUNT(c) FROM Customer c WHERE c.loyaltyTier = :tier")
    long countByLoyaltyTier(@Param("tier") CustomerTier tier);
}