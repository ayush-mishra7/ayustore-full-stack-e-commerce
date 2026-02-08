package com.ayustore.dto;

import com.ayustore.entity.OrderItem;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto implements Serializable {
    private Long id;
    private String name;
    private Double price;
    private String description;
    private String category;
    private String image;
    private Double rating;
    private Integer reviews;
    private Integer stock;
    private Integer quantity;

    public static OrderItemDto fromEntity(OrderItem item) {
        return OrderItemDto.builder()
                .id(item.getProduct().getId())
                .name(item.getProductName())
                .price(item.getPriceAtPurchase().doubleValue())
                .description(item.getProduct().getDescription())
                .category(item.getProduct().getCategory())
                .image(item.getProductImage())
                .rating(item.getProduct().getRating())
                .reviews(item.getProduct().getReviews())
                .stock(item.getProduct().getStock())
                .quantity(item.getQuantity())
                .build();
    }
}
