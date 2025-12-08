package com.microtech.smartshop.service.impl;

import com.microtech.smartshop.dto.request.ProductCreateRequest;
import com.microtech.smartshop.dto.request.ProductUpdateRequest;
import com.microtech.smartshop.dto.response.ProductResponse;
import com.microtech.smartshop.entity.Product;
import com.microtech.smartshop.exception.BusinessRuleException;
import com.microtech.smartshop.exception.ResourceNotFoundException;
import com.microtech.smartshop.exception.ValidationException;
import com.microtech.smartshop.mapper.ProductMapper;
import com.microtech.smartshop.repository.OrderItemRepository;
import com.microtech.smartshop.repository.ProductRepository;
import com.microtech.smartshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResponse createProduct(ProductCreateRequest request) {
        Product product = Product.builder()
                .nom(request.getNom())
                .prixUnitaire(request.getPrixUnitaire())
                .stockDisponible(request.getStockDisponible())
                .deleted(false)
                .build();

        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        return productMapper.toResponse(product);
    }

    @Override
    public ProductResponse updateProduct(Long productId, ProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (product.getDeleted()) {
            throw new BusinessRuleException("Impossible de modifier un produit supprimé");
        }
        if (request.getNom() != null && !request.getNom().isBlank()) {
            product.setNom(request.getNom());
        }
        if (request.getPrixUnitaire() != null) {
            if (request.getPrixUnitaire().compareTo(BigDecimal.ZERO) <= 0) {
                throw new ValidationException("Le prix unitaire doit être supérieur à 0");
            }
            product.setPrixUnitaire(request.getPrixUnitaire());
        }
        if (request.getStockDisponible() != null) {
            if (request.getStockDisponible() < 0) {
                throw new ValidationException("Le stock ne peut pas être négatif");
            }
            product.setStockDisponible(request.getStockDisponible());
        }
        Product updated = productRepository.save(product);
        return productMapper.toResponse(updated);
    }

    @Override
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));        
        boolean hasOrders = orderItemRepository.existsByProductId(productId);

        if (hasOrders) {
            product.setDeleted(true);
            productRepository.save(product);
        } else {
            productRepository.delete(product);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(String nom, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Page<Product> products;
        boolean hasNom = nom != null && !nom.isBlank();
        boolean hasMinPrice = minPrice != null;
        boolean hasMaxPrice = maxPrice != null;

        if (hasNom && hasMinPrice && hasMaxPrice) {
            products = productRepository.findByNomContainingIgnoreCaseAndPrixUnitaireBetweenAndDeletedFalse(
                    nom, minPrice, maxPrice, pageable);
        } else if (hasNom && hasMinPrice) {
            products = productRepository.findByNomContainingIgnoreCaseAndPrixUnitaireGreaterThanEqualAndDeletedFalse(
                    nom, minPrice, pageable);
        } else if (hasNom && hasMaxPrice) {
            products = productRepository.findByNomContainingIgnoreCaseAndPrixUnitaireLessThanEqualAndDeletedFalse(
                    nom, maxPrice, pageable);
        } else if (hasNom) {
            products = productRepository.findByNomContainingIgnoreCaseAndDeletedFalse(nom, pageable);
        } else if (hasMinPrice && hasMaxPrice) {
            products = productRepository.findByPrixUnitaireBetweenAndDeletedFalse(minPrice, maxPrice, pageable);
        } else if (hasMinPrice) {
            products = productRepository.findByPrixUnitaireGreaterThanEqualAndDeletedFalse(minPrice, pageable);
        } else if (hasMaxPrice) {
            products = productRepository.findByPrixUnitaireLessThanEqualAndDeletedFalse(maxPrice, pageable);
        } else {
            products = productRepository.findByDeletedFalse(pageable);
        }
        return products.map(productMapper::toResponse);
    }
}
