package com.ayustore.controller;

import com.ayustore.dto.ApiResponse;
import com.ayustore.dto.RazorpayOrderResponse;
import com.ayustore.dto.VerifyPaymentRequest;
import com.ayustore.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Payments", description = "Payment processing endpoints")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/razorpay/create")
    @Operation(summary = "Create Razorpay order", description = "Creates a Razorpay order for the given order ID")
    public ResponseEntity<RazorpayOrderResponse> createRazorpayOrder(
            @Parameter(description = "Order ID (UUID)") @RequestParam UUID orderId) {
        log.info("POST /api/payments/razorpay/create - creating payment for order: {}", orderId);
        RazorpayOrderResponse response = paymentService.createRazorpayOrder(orderId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/razorpay/verify")
    @Operation(summary = "Verify Razorpay payment", description = "Verifies payment signature and updates order status")
    public ResponseEntity<ApiResponse<String>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request) {
        log.info("POST /api/payments/razorpay/verify - verifying payment");
        boolean verified = paymentService.verifyPayment(request);
        if (verified) {
            return ResponseEntity.ok(ApiResponse.success("Payment verified successfully"));
        } else {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Payment verification failed"));
        }
    }
}
