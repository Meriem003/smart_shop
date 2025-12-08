package com.microtech.smartshop.service;

import com.microtech.smartshop.dto.request.CustomerCreateRequest;
import com.microtech.smartshop.dto.request.CustomerUpdateRequest;
import com.microtech.smartshop.dto.response.CustomerResponse;
import com.microtech.smartshop.dto.response.CustomerStatsResponse;
import com.microtech.smartshop.dto.response.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
public interface CustomerService {
    CustomerResponse createCustomer(CustomerCreateRequest request);
    CustomerResponse getCustomerById(Long customerId);
    CustomerResponse updateCustomer(Long customerId, CustomerUpdateRequest request);
    CustomerStatsResponse getCustomerStats(Long customerId);
    List<OrderResponse> getCustomerOrderHistory(Long customerId);
    Page<CustomerResponse> getAllCustomers(Pageable pageable);
}