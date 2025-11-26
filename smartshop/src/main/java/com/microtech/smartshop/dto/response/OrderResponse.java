package com.microtech.smartshop.dto.response;

import com.microtech.smartshop.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private LocalDateTime dateCommande;
    private BigDecimal sousTotal;
    private BigDecimal montantRemise;
    private BigDecimal totalTTC;
    private BigDecimal montantRestant;
    private OrderStatus status;
    private String codePromo;
    private Integer itemsCount;
}
