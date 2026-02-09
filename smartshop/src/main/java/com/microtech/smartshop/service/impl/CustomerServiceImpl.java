package com.microtech.smartshop.service.impl;

import com.microtech.smartshop.dto.request.CustomerCreateRequest;
import com.microtech.smartshop.dto.request.CustomerUpdateRequest;
import com.microtech.smartshop.dto.response.CustomerResponse;
import com.microtech.smartshop.dto.response.CustomerStatsResponse;
import com.microtech.smartshop.dto.response.OrderResponse;
import com.microtech.smartshop.entity.Customer;
import com.microtech.smartshop.entity.Order;
import com.microtech.smartshop.enums.CustomerTier;
import com.microtech.smartshop.exception.ResourceNotFoundException;
import com.microtech.smartshop.exception.ValidationException;
import com.microtech.smartshop.mapper.CustomerMapper;
import com.microtech.smartshop.mapper.OrderMapper;
import com.microtech.smartshop.repository.CustomerRepository;
import com.microtech.smartshop.repository.OrderRepository;
import com.microtech.smartshop.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final CustomerMapper customerMapper;
    private final OrderMapper orderMapper;

    @Override
    public CustomerResponse createCustomer(CustomerCreateRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Un client avec cet email existe déjà");
        }
        
        Customer customer = Customer.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .loyaltyTier(CustomerTier.BASIC)
                .totalOrders(0)
                .totalSpent(BigDecimal.ZERO)
                .build();

        Customer saved = customerRepository.save(customer);
        return customerMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomerById(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customerId));

        return customerMapper.toResponse(customer);
    }

    @Override
    public CustomerResponse updateCustomer(Long customerId, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customerId));
        if (request.getNom() != null && !request.getNom().isBlank()) {
            customer.setNom(request.getNom());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!customer.getEmail().equals(request.getEmail()) &&
                    customerRepository.existsByEmail(request.getEmail())) {
                throw new ValidationException("Un autre client utilise déjà cet email");
            }
            customer.setEmail(request.getEmail());
        }

        Customer updated = customerRepository.save(customer);

        return customerMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerStatsResponse getCustomerStats(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customerId));
        return customerMapper.toStatsResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getCustomerOrderHistory(Long customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer", "id", customerId);
        }
        List<Order> orders = orderRepository.findByCustomerIdOrderByDateCommandeDesc(customerId);
        return orderMapper.toResponseList(orders);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponse> getAllCustomers(String nom, Pageable pageable) {
        Page<Customer> customers;
        if (nom != null && !nom.isBlank()) {
            customers = customerRepository.findByNomContainingIgnoreCase(nom, pageable);
        } else {
            customers = customerRepository.findAll(pageable);
        }
        return customers.map(customerMapper::toResponse);
    }
    
}