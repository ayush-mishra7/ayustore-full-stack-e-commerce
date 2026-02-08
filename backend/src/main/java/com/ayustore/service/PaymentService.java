package com.ayustore.service;

import com.ayustore.config.RazorpayConfig;
import com.ayustore.dto.RazorpayOrderResponse;
import com.ayustore.dto.VerifyPaymentRequest;
import com.ayustore.entity.Order;
import com.ayustore.entity.Payment;
import com.ayustore.exception.PaymentException;
import com.ayustore.exception.ResourceNotFoundException;
import com.ayustore.repository.OrderRepository;
import com.ayustore.repository.PaymentRepository;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final RazorpayClient razorpayClient;
    private final RazorpayConfig razorpayConfig;

    @Value("${app.razorpay.key-secret}")
    private String razorpayKeySecret;

    @Transactional
    public RazorpayOrderResponse createRazorpayOrder(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        log.info("Creating Razorpay order for order: {}", orderId);

        try {
            // Amount in paise (smallest currency unit)
            long amountInPaise = order.getTotal().multiply(BigDecimal.valueOf(100)).longValue();

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", order.getId().toString());

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            log.info("Razorpay order created: {}", razorpayOrderId);

            // Create payment record
            Payment payment = Payment.builder()
                    .order(order)
                    .razorpayOrderId(razorpayOrderId)
                    .amount(order.getTotal())
                    .status(Payment.PaymentStatus.PENDING)
                    .build();
            paymentRepository.save(payment);

            return RazorpayOrderResponse.builder()
                    .razorpayOrderId(razorpayOrderId)
                    .amount(order.getTotal().doubleValue())
                    .currency("INR")
                    .keyId(razorpayConfig.getKeyId())
                    .orderId(orderId.toString())
                    .build();

        } catch (RazorpayException e) {
            log.error("Error creating Razorpay order", e);
            throw new PaymentException("Failed to create payment order: " + e.getMessage(), e);
        }
    }

    @Transactional
    public boolean verifyPayment(VerifyPaymentRequest request) {
        log.info("Verifying payment for Razorpay order: {}", request.getRazorpayOrderId());

        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "razorpayOrderId",
                        request.getRazorpayOrderId()));

        // Verify signature
        String data = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
        boolean isValid = verifySignature(data, request.getRazorpaySignature());

        if (isValid) {
            log.info("Payment verified successfully");
            payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
            payment.setRazorpaySignature(request.getRazorpaySignature());
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setCompletedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            // Update order status
            Order order = payment.getOrder();
            order.setStatus(Order.OrderStatus.PROCESSING);
            orderRepository.save(order);

            return true;
        } else {
            log.error("Payment signature verification failed");
            payment.setStatus(Payment.PaymentStatus.FAILED);
            paymentRepository.save(payment);
            throw new PaymentException("Payment verification failed");
        }
    }

    private boolean verifySignature(String data, String signature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(
                    razorpayKeySecret.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            String generatedSignature = HexFormat.of().formatHex(hash);
            return generatedSignature.equals(signature);
        } catch (Exception e) {
            log.error("Error verifying signature", e);
            return false;
        }
    }
}
