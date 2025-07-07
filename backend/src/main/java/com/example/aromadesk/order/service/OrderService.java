package com.example.aromadesk.order.service;

import com.example.aromadesk.cart.dto.CartRequestDto;
import com.example.aromadesk.cart.entity.Cart;
import com.example.aromadesk.cart.repository.CartRepository;
import com.example.aromadesk.delivery.entity.Delivery;
import com.example.aromadesk.delivery.repostiory.DeliveryRepository;
import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.member.repository.MemberRepository;
import com.example.aromadesk.order.dto.OrderDetailResponseDto;
import com.example.aromadesk.order.dto.OrderRequestDto;
import com.example.aromadesk.order.dto.OrderResponseDto;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.entity.OrderItem;
import com.example.aromadesk.order.entity.OrderStatus;
import com.example.aromadesk.order.repository.OrderRepository;
import com.example.aromadesk.product.entity.Product;
import com.example.aromadesk.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/*************************************************************
 /* SYSTEM NAME      : Order
 /* PROGRAM NAME     : OrderService.class
 /* DESCRIPTION      : 주문 관련 비즈니스 로직 처리
 /* MODIFIVATION LOG :
 /* DATA         AUTHOR          DESC.
 /*--------     ---------    ----------------------
 /*2025.06.24   SUSU        INITIAL RELEASE
 /*2025.06.25   SUSU        단일/장바구니 주문 로직 분리 및 추가 구현
 /*2025.06.26   susu        member 객체로 변경
 /*2025.06.26   KANG        기간별 총메출 메소드 추가
 /*2025.06.30   SUSU        장바구니 주문시 OrderResponseDto 반환 추가
 /*2025.07.03   SUSU        배송지 직접 입력 방식으로 수정 (Delivery 생성)
 /*2025.07.05   SUSU        주문 상세 조히 추가
 /*************************************************************/

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final MemberRepository memberRepository;
    private final DeliveryRepository deliveryRepository;
    private final CartRepository cartRepository;

    /**
     * 단일 상품 주문 처리
     */
    @Transactional
    public OrderResponseDto createSingleOrder(OrderRequestDto dto, Member member) {
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new IllegalArgumentException("주문 항목이 비어 있습니다.");
        }

        List<OrderItem> orderItems = dto.getItems().stream().map(itemDto -> {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다. id=" + itemDto.getProductId()));

            if (product.getStock() < itemDto.getQuantity()) {
                throw new IllegalArgumentException("재고가 부족합니다: " + product.getName());
            }

            product.setStock(product.getStock() - itemDto.getQuantity());

            return OrderItem.builder()
                    .product(product)
                    .quantity(itemDto.getQuantity())
                    .price(product.getPrice())
                    .build();
        }).collect(Collectors.toList());

        int totalPrice = orderItems.stream()
                .mapToInt(item -> item.getPrice() * item.getQuantity())
                .sum();

        Order order = Order.builder()
                .member(member)
                .orderStatus(dto.getPaymentMethod().name().equals("MOCK") ? OrderStatus.PAID : OrderStatus.ORDERED)
                .paymentMethod(dto.getPaymentMethod())
                .totalPrice(totalPrice)
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // 배송 정보 생성 후 저장
        Delivery delivery = Delivery.builder()
                .address(dto.getAddress())
                .status(com.example.aromadesk.delivery.entity.DeliveryStatus.PREPARING)
                .order(savedOrder)
                .build();

        deliveryRepository.save(delivery);

        // 배송 정보 연결 후 주문 업데이트
        savedOrder.setDelivery(delivery);

        return OrderResponseDto.from(savedOrder);
    }

    /**
     * 장바구니 기반 주문 처리
     */
    @Transactional
    public OrderResponseDto createOrderFromCart(OrderRequestDto dto, Member member) {
        List<Cart> cartItems = cartRepository.findAllByIdInAndMemberId(dto.getCartItemIds(), member.getId());

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("선택된 장바구니 항목이 없습니다. id = " + dto.getCartItemIds());
        }

        List<OrderItem> orderItems = new ArrayList<>();
        int totalPrice = 0;

        for (Cart cart : cartItems) {
            Product product = cart.getProduct();
            int quantity = cart.getQuantity();

            if (product.getStock() < quantity) {
                throw new IllegalArgumentException("재고 부족: " + product.getName());
            }

            product.setStock(product.getStock() - quantity);

            OrderItem item = OrderItem.builder()
                    .product(product)
                    .quantity(quantity)
                    .price(product.getPrice())
                    .build();

            orderItems.add(item);
            totalPrice += product.getPrice() * quantity;
        }

        Order order = Order.builder()
                .member(member)
                .orderStatus(dto.getPaymentMethod().name().equals("MOCK") ? OrderStatus.PAID : OrderStatus.ORDERED)
                .paymentMethod(dto.getPaymentMethod())
                .totalPrice(totalPrice)
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // 배송 정보 생성 후 저장
        Delivery delivery = Delivery.builder()
                .address(dto.getAddress())
                .status(com.example.aromadesk.delivery.entity.DeliveryStatus.PREPARING)
                .order(savedOrder)
                .build();

        deliveryRepository.save(delivery);

        // 배송 정보 연결 후 주문 업데이트
        savedOrder.setDelivery(delivery);
        cartRepository.deleteAll(cartItems);

        return OrderResponseDto.from(savedOrder);
    }


    /**
     * 회원의 전체 주문 목록 조회
     * 
     * @param  member 조회할 회원
     * @return 회원의 주문 목록 DTO 리스트
     */
    
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByMemberID(Member member) {
        List<Order> orders = orderRepository.findByMemberId(member.getId());
        return orders.stream()
                .map(OrderResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * 주문 결제 완료 처리 
     * @param orderId 결제할 주문 ID
     * @throws IllegalArgumentException 주문이 존재하지 않거나 이미 결제된 경우 예외 발생
     */
    
    @Transactional
    public void completePayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다. orderId=" + orderId));

        if (order.getOrderStatus() != OrderStatus.ORDERED) {
            throw new IllegalArgumentException("이미 결제된 주문입니다.");
        }

        order.setOrderStatus(OrderStatus.PAID);
    }

    /**
     * 특정 기간 동안의 총 매출 조회
     *
     * @param start 시작일
     * @param end 종료일
     * @return 기간 내 총 매출액
     */

    @Transactional(readOnly = true)
    public Long getTotalSalesBetween(LocalDateTime start, LocalDateTime end) {
        Long total = orderRepository.getTotalSalesBetween(start, end);
        return total != null ? total : 0L;
    }

    /**
     * 특정 기간 동안의 주문 상태별 건수 조회
     *
     * @param start 시작일
     * @param end 종료일
     * @return 상태별 주문 건수 맵
     */

    @Transactional(readOnly = true)
    public Map<String, Long> countOrdersByStatusBetween(LocalDateTime start, LocalDateTime end) {
        List<Object[]> result = orderRepository.countOrdersByStatusBetween(start, end);
        Map<String, Long> countMap = new HashMap<>();
        for (Object[] row : result) {
            String status = row[0].toString();
            Long count = (Long) row[1];
            countMap.put(status, count);
        }
        return countMap;
    }

    /**
     * 주문 ID로 배송 정보 조회
     *
     * @param orderId 주문 ID
     * @return 배송 정보 엔티티
     * @throws IllegalArgumentException 주문이 존재하지 않는 경우 예외 발생
     * @throws IllegalStateException 배송 정보가 없는 경우 예외 발생
     */
    @Transactional(readOnly = true)
    public Delivery getDeliveryByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다. orderId=" + orderId));

        Delivery delivery = order.getDelivery();
        if (delivery == null) {
            throw new IllegalStateException("배송 정보가 없습니다. orderId=" + orderId);
        }

        return delivery;
    }

    /**
     * 주문 ID로 배송 상태만 조회
     *
     * @param orderId 주문 ID
     * @return 배송 상태 문자열 (배송 정보 없음 시 "배송 정보 없음")
     * @throws IllegalArgumentException 주문이 존재하지 않는 경우 예외 발생
     */
    @Transactional(readOnly = true)
    public String getDeliveryStatus(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다. orderId=" + orderId));

        Delivery delivery = order.getDelivery();
        if (delivery == null) {
            return "배송 정보 없음";
        }

        return delivery.getStatus().name();  // DeliveryStatus Enum 값을 문자열로 반환
    }

    /**
     * 주문 상세 조회(배송 정보 포함)
     * @param orderId 주문 ID
     * @return 주문 상세 정보 DTO
     */

    @Transactional(readOnly = true)
    public OrderDetailResponseDto getOrderDetail(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다." + orderId));
        return OrderDetailResponseDto.from(order);
    }

    /**
     * 관리자용 전체 주문 목록 조회
     * - 모든 주문 상태 및 배송 상태 포함
     */
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getAllOrdersForAdmin() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(OrderResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String orderStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다. orderId=" + orderId));

        order.setOrderStatus(OrderStatus.valueOf(orderStatus));
    }



}
