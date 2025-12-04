package com.microtech.smartshop.dto.response;

import com.microtech.smartshop.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private LocalDateTime dateCommande;
    private Long customerId;
    private String customerNom;
    private List<OrderItemResponse> items;
    private BigDecimal sousTotal;
    private BigDecimal montantRemise;
    private BigDecimal montantHT;
    private BigDecimal montantTVA;
    private BigDecimal totalTTC;
    private OrderStatus status;
    private String codePromo;
    private BigDecimal tauxTVA;
}
