package com.microtech.smartshop.repository;

import com.microtech.smartshop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    //TOUS les produits actifs 
    Page<Product> findByDeletedFalse(Pageable pageable);
    //Rechercher des produits par nom
    Page<Product> findByNomContainingIgnoreCaseAndDeletedFalse(String nom, Pageable pageable);
    //prix entre min et max
    Page<Product> findByPrixUnitaireBetweenAndDeletedFalse(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    //prix minimum
    Page<Product> findByPrixUnitaireGreaterThanEqualAndDeletedFalse(BigDecimal minPrice, Pageable pageable);
    //prix maximum
    Page<Product> findByPrixUnitaireLessThanEqualAndDeletedFalse(BigDecimal maxPrice, Pageable pageable);
    //par nom et prix entre min et max
    Page<Product> findByNomContainingIgnoreCaseAndPrixUnitaireBetweenAndDeletedFalse(
            String nom, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    //par nom et prix minimum
    Page<Product> findByNomContainingIgnoreCaseAndPrixUnitaireGreaterThanEqualAndDeletedFalse(
            String nom, BigDecimal minPrice, Pageable pageable);
    //par nom et prix maximum
    Page<Product> findByNomContainingIgnoreCaseAndPrixUnitaireLessThanEqualAndDeletedFalse(
            String nom, BigDecimal maxPrice, Pageable pageable);
}