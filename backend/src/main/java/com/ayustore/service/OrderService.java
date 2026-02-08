package com.ayustore.service;

import com.ayustore.dto.CreateOrderRequest;
import com.ayustore.dto.OrderDto;
import com.ayustore.entity.*;
import com.ayustore.exception.BadRequestException;
import com.ayustore.exception.ResourceNotFoundException;
import com.ayustore.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserService userService;
    private final ProductService productService;

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request) {
        User currentUser = userService.getCurrentUser();
        log.info("Creating order for user: {}", currentUser.getEmail());

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one item");
        }

        Order order = Order.builder()
                .user(currentUser)
                .status(Order.OrderStatus.PENDING)
                .total(BigDecimal.valueOf(request.getTotal()))
                .shippingAddress(ShippingAddress.builder()
                        .firstName(request.getFirstName())
                        .lastName(request.getLastName())
                        .address(request.getAddress())
                        .city(request.getCity())
                        .zipCode(request.getZip())
                        .country("India") // Default for Razorpay
                        .build())
                .build();

        for (CreateOrderRequest.CartItemRequest item : request.getItems()) {
            Product product = productService.getProductEntity(item.getId());

            // Check stock
            if (product.getStock() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getName());
            }

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(item.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .productName(product.getName())
                    .productImage(product.getImage())
                    .build();

            order.addItem(orderItem);

            // Reduce stock
            product.setStock(product.getStock() - item.getQuantity());
        }

        order = orderRepository.save(order);
        log.info("Order created with ID: {}", order.getId());

        return OrderDto.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getCurrentUserOrders() {
        User currentUser = userService.getCurrentUser();
        log.info("Fetching orders for user: {}", currentUser.getEmail());
        return orderRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId()).stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(UUID orderId) {
        User currentUser = userService.getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        // Check ownership unless admin
        if (!order.getUser().getId().equals(currentUser.getId())
                && currentUser.getRole() != User.Role.ADMIN) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }

        return OrderDto.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public Order getOrderEntity(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
    }

    // Admin operations

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrders() {
        log.info("Admin fetching all orders");
        return orderRepository.findAllOrderByCreatedAtDesc().stream()
                .map(OrderDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateOrderStatus(UUID orderId, Order.OrderStatus newStatus) {
        log.info("Updating order {} status to {}", orderId, newStatus);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        order.setStatus(newStatus);
        order = orderRepository.save(order);
        return OrderDto.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public long countAllOrders() {
        return orderRepository.countAllOrders();
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalRevenue() {
        BigDecimal revenue = orderRepository.sumCompletedOrdersTotal();
        return revenue != null ? revenue : BigDecimal.ZERO;
    }
}
