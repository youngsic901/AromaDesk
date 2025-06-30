package com.example.aromadesk.admin.controller;

import com.example.aromadesk.order.dto.OrderResponseDto;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getAllOrdersForAdmin() {
        List<Order> allOrders = orderRepository.findAll(); // 전체 주문 조회
        List<OrderResponseDto> result = allOrders.stream()
                .map(OrderResponseDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}
