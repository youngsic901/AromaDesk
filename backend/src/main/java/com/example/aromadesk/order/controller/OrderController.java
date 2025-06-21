package com.example.aromadesk.order.controller;

import com.example.aromadesk.order.dto.OrderRequestDto;
import com.example.aromadesk.order.dto.OrderResponseDto;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping    //등록 어차피 토큰으로 개인별 등록 할거기때무에 {memberid} 안써도 됨
    public ResponseEntity<String> createOrder(@RequestBody OrderRequestDto order) {
        Long memberId = 1L; //임시 회원id (나중에 jwt로 대체)

        orderService.createOrder(order, memberId);
        return ResponseEntity.ok("주문이 성공하였습니다.");

    }

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getAllOrders() {
        Long memberId = 1L;
        List<OrderResponseDto> orders = orderService.getOrdersByMemberId(memberId);
        return ResponseEntity.ok(orders);
    }



}
