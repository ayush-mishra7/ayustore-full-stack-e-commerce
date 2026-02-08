package com.ayustore.repository;

import com.ayustore.entity.Order;
import com.ayustore.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    List<Order> findByUserOrderByCreatedAtDesc(User user);

    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findAllOrderByCreatedAtDesc();

    @Query("SELECT COUNT(o) FROM Order o")
    long countAllOrders();

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.status = 'DELIVERED'")
    java.math.BigDecimal sumCompletedOrdersTotal();
}
