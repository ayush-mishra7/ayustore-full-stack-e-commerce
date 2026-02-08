package com.ayustore.controller;

import com.ayustore.dto.*;
import com.ayustore.entity.Order;
import com.ayustore.service.OrderService;
import com.ayustore.service.ProductService;
import com.ayustore.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Admin-only management endpoints")
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final UserService userService;

    // Dashboard

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        log.info("GET /api/admin/dashboard");
        DashboardStatsDto stats = DashboardStatsDto.builder()
                .totalRevenue(orderService.getTotalRevenue())
                .totalOrders(orderService.countAllOrders())
                .activeProducts(productService.countActiveProducts())
                .registeredUsers(userService.countUsers())
                .build();
        return ResponseEntity.ok(stats);
    }

    // Orders

    @GetMapping("/orders")
    @Operation(summary = "Get all orders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        log.info("GET /api/admin/orders");
        List<OrderDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Update order status")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @Parameter(description = "Order ID") @PathVariable UUID id,
            @Parameter(description = "New status") @RequestParam Order.OrderStatus status) {
        log.info("PUT /api/admin/orders/{}/status - new status: {}", id, status);
        OrderDto order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(order);
    }

    // Products

    @PostMapping("/products")
    @Operation(summary = "Create a new product")
    public ResponseEntity<ProductDto> createProduct(
            @Valid @RequestBody CreateProductRequest request) {
        log.info("POST /api/admin/products - creating: {}", request.getName());
        ProductDto product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping("/products/{id}")
    @Operation(summary = "Update a product")
    public ResponseEntity<ProductDto> updateProduct(
            @Parameter(description = "Product ID") @PathVariable Long id,
            @Valid @RequestBody CreateProductRequest request) {
        log.info("PUT /api/admin/products/{}", id);
        ProductDto product = productService.updateProduct(id, request);
        return ResponseEntity.ok(product);
    }

    @DeleteMapping("/products/{id}")
    @Operation(summary = "Delete a product (soft delete)")
    public ResponseEntity<ApiResponse<String>> deleteProduct(
            @Parameter(description = "Product ID") @PathVariable Long id) {
        log.info("DELETE /api/admin/products/{}", id);
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully"));
    }

    // Users

    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        log.info("GET /api/admin/users");
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
