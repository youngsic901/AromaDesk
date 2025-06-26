package com.example.aromadesk.order.controller;

import com.example.aromadesk.auth.service.CustomOAuth2User;
import com.example.aromadesk.cart.dto.CartRequestDto;
import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.order.dto.OrderRequestDto;
import com.example.aromadesk.order.dto.OrderResponseDto;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.repository.OrderRepository;
import com.example.aromadesk.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*************************************************************
 /* SYSTEM NAME      : Order
 /* PROGRAM NAME     : OrderController.class
 /* DESCRIPTION      : 주문 생성 및 조회 API 컨트롤러
 /* MODIFIVATION LOG :
 /* DATA         AUTHOR          DESC.
 /*--------     ---------    ----------------------
 /*2025.06.25   SUSU        상품 상세보기 및 장바구니 주문 처리
 /*2025.06.26   SUSU        결제 완료 처리 
 /*************************************************************/

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    /**
     * 단일 상품 주문 생성 (상품 상세 -> 바로 주문)
     */
    @PostMapping("/single")
    public ResponseEntity<String> createSingleOrder(@RequestBody OrderRequestDto dto) {
        CustomOAuth2User user = (CustomOAuth2User) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        Member loginMember = user.getMember();
        orderService.createSingleOrder(dto, loginMember);
        return ResponseEntity.ok("단일 상품 주문이 성공하였습니다. ");
    }

    /**
     * 장바구니 기반 주문 생성
     */
    @PostMapping("/from-cart")
    public ResponseEntity<String> createOrderFromCart(@RequestBody CartRequestDto dto) {
        CustomOAuth2User user = (CustomOAuth2User) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        Member loginMember = user.getMember();
        orderService.createOrderFromCart(dto, loginMember);
        return ResponseEntity.ok("장바구니 상품 주문이 완료되었습니다.");
    }

    /**
     * 회원의 모든 주문 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getAllOrders() {
        CustomOAuth2User user = (CustomOAuth2User) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        Member loginMember = user.getMember();
        List<OrderResponseDto> orders = orderService.getOrdersByMemberID(loginMember);
        return ResponseEntity.ok(orders);
    }
    
    /**
     * 결제 완료 처리
     */
    @PostMapping("/{orderId}/pay")
    public ResponseEntity<String> completePayment(@PathVariable("orderId") Long orderId) {
        orderService.completePayment(orderId);
        return ResponseEntity.ok("결제가 완료되었습니다.");
    }

    /**
     *주문 상태 확인용
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponseDto> getOrder(@PathVariable("orderId") Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다."));
        return ResponseEntity.ok(OrderResponseDto.from(order));
    }


}
