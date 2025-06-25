package com.example.aromadesk.order.controller;

import com.example.aromadesk.order.dto.OrderRequestDto;
import com.example.aromadesk.order.dto.OrderResponseDto;
import com.example.aromadesk.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*************************************************************
 /* SYSTEM NAME      : Order
 /* PROGRAM NAME     : OrderController.class
 /* DESCRIPTION      : 주문 생성 및 조회 API 컨트롤러
 /* MODIFIVATION LOG :
 /* DATA         AUTHOR          DESC.
 /*--------     ---------    ----------------------
 /*2025.06.25   SUSU           INITIAL RELEASE
 /*************************************************************/

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * 단일 상품 주문 생성 (상품 상세 -> 바로 주문)
     */
    @PostMapping("/single")
    public ResponseEntity<String> createSingleOrder(@RequestBody OrderRequestDto dto) {
        Long memberId = 1L; //TODO: 세션 기반 로그인 정보로 대체
        orderService.createSingleOrder(dto, memberId);
        return ResponseEntity.ok("단일 상품 주문이 성공하였습니다. ");
    }

    /**
     * 장바구니 기반 주문 생성
     */
    @PostMapping("/from-cart")
    public ResponseEntity<String> createOrderFromCart(@RequestBody OrderRequestDto dto) {
        Long memberId = 1L; //TODO: 세션 기반 로그인 정보로 대체
        orderService.createSingleOrder(dto, memberId);
        return ResponseEntity.ok("장바구니 상품 주문이 완료되었습니다. ");
    }

    /**
     * 회원의 모든 주문 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getAllOrders() {
        Long memberId = 1L; //TODO: 세션 기반 로그인 정보로 대체
        List<OrderResponseDto> orders = orderService.getOrdersByMemberID(memberId);
        return ResponseEntity.ok(orders);
    }


}
