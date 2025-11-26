package com.microtech.smartshop.repository;

import com.microtech.smartshop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByDeletedFalse(Pageable pageable);
    Page<Product> findByNomContainingIgnoreCaseAndDeletedFalse(String nom, Pageable pageable);
    Page<Product> findByPrixUnitaireBetweenAndDeletedFalse(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    Page<Product> findByNomContainingIgnoreCaseAndPrixUnitaireBetweenAndDeletedFalse(
            String nom, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
}