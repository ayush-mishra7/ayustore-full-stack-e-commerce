package com.ayustore.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long activeProducts;
    private Long registeredUsers;
}
