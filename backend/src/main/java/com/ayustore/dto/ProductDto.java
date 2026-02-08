package com.ayustore.dto;

import com.ayustore.entity.Product;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto implements Serializable {
    private Long id;
    private String name;
    private Double price;
    private String description;
    private String category;
    private String image;
    private Double rating;
    private Integer reviews;
    private Integer stock;

    public static ProductDto fromEntity(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice().doubleValue())
                .description(product.getDescription())
                .category(product.getCategory())
                .image(product.getImage())
                .rating(product.getRating())
                .reviews(product.getReviews())
                .stock(product.getStock())
                .build();
    }
}
