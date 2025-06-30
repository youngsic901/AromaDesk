package com.example.aromadesk.order.repository;

import com.example.aromadesk.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByMemberId(Long memberId);

    @Query("SELECT SUM(oi.price * oi.quantity) FROM Order o JOIN o.orderItems oi " +
            "WHERE o.createdAt >= :start AND o.createdAt < :end AND o.orderStatus = 'PAID'")
    Long getTotalSalesBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("SELECT o.orderStatus, COUNT(o) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end GROUP BY o.orderStatus")
    List<Object[]> countOrdersByStatusBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}
