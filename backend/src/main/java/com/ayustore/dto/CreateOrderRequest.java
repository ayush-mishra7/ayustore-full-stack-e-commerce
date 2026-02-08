package com.ayustore.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {

    @NotEmpty(message = "Items cannot be empty")
    @Valid
    private List<CartItemRequest> items;

    @NotNull(message = "Total is required")
    private Double total;

    // Shipping info
    private String firstName;
    private String lastName;
    private String address;
    private String city;
    private String zip;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemRequest {
        @NotNull(message = "Product ID is required")
        private Long id;

        @NotNull(message = "Quantity is required")
        private Integer quantity;

        private Double price;
    }
}
