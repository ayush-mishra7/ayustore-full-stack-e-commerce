package com.ayustore.dto;

import com.ayustore.entity.Order;
import lombok.*;

import java.io.Serializable;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto implements Serializable {
    private String id;
    private String date;
    private Double total;
    private String status;
    private List<OrderItemDto> items;

    // Additional fields for admin view
    private String customerName;
    private String customerEmail;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static OrderDto fromEntity(Order order) {
        return OrderDto.builder()
                .id(order.getId().toString())
                .date(order.getCreatedAt().format(DATE_FORMATTER))
                .total(order.getTotal().doubleValue())
                .status(capitalizeFirst(order.getStatus().name()))
                .items(order.getItems().stream()
                        .map(OrderItemDto::fromEntity)
                        .collect(Collectors.toList()))
                .customerName(order.getUser().getName())
                .customerEmail(order.getUser().getEmail())
                .build();
    }

    private static String capitalizeFirst(String str) {
        if (str == null || str.isEmpty())
            return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
    }
}
