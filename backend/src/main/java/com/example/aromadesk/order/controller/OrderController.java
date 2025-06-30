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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

    @GetMapping("/total-revenue")
    public ResponseEntity<Long> getTotalSales(
            @RequestParam String start,
            @RequestParam String end) {

        // 1. 문자열을 LocalDate로 변환 (ex. "2023-01-01")
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);

        // 2. LocalDate를 LocalDateTime(자정)으로 변환
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay(); // 다음날 00:00:00까지

        // 3. 서비스 호출
        Long total = orderService.getTotalSalesBetween(startDateTime, endDateTime);

        // 4. 결과 반환
        return ResponseEntity.ok(total);
    }

    // 상태별 주문 개수 조회 (기간 선택)
    @GetMapping("/count-by-status")
    public ResponseEntity<Map<String, Long>> getOrderCountByStatus(@RequestParam String start,@RequestParam String end) {

        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay(); // 다음날 자정

        Map<String, Long> result = orderService.countOrdersByStatusBetween(startDateTime, endDateTime);

        return ResponseEntity.ok(result);
    }
}
