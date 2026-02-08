package com.ayustore.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderResponse {
    private String razorpayOrderId;
    private Double amount;
    private String currency;
    private String keyId;
    private String orderId; // Our internal order ID
}
