package com.ayustore.controller;

import com.ayustore.dto.CreateOrderRequest;
import com.ayustore.dto.OrderDto;
import com.ayustore.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Orders", description = "Order management endpoints")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Create a new order", description = "Creates an order from cart items")
    public ResponseEntity<OrderDto> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        log.info("POST /api/orders - creating new order");
        OrderDto order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    @Operation(summary = "Get my orders", description = "Returns all orders for the authenticated user")
    public ResponseEntity<List<OrderDto>> getMyOrders() {
        log.info("GET /api/orders - fetching user orders");
        List<OrderDto> orders = orderService.getCurrentUserOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", description = "Returns order details for the given ID")
    public ResponseEntity<OrderDto> getOrderById(
            @Parameter(description = "Order ID (UUID)") @PathVariable UUID id) {
        log.info("GET /api/orders/{} - fetching order", id);
        OrderDto order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }
}
