package com.example.aromadesk.order.service;

import com.example.aromadesk.cart.dto.CartRequestDto;
import com.example.aromadesk.cart.entity.Cart;
import com.example.aromadesk.cart.repository.CartRepository;
import com.example.aromadesk.delivery.entity.Delivery;
import com.example.aromadesk.delivery.repostiory.DeliveryRepository;
import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.member.repository.MemberRepository;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
     * 단일 상품 주문 처리 (상품 상세 페이지에서 바로 구매
     *
     */

    @Transactional
    public void createSingleOrder(OrderRequestDto dto, Member member) {

        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new IllegalArgumentException("주문 항목이 비어 있습니다.");
        }

        Delivery delivery = deliveryRepository.findById(dto.getDeliveryId())
                .orElseThrow(() -> new IllegalArgumentException(" 배송지가 없습니다. id" + dto.getDeliveryId()));

        List<OrderItem> orderItems = dto.getItems().stream().map(itemDto -> {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException(" 상품이 존재하지 않습니다. id.= " + itemDto.getProductId()));

            if (product.getStock() < itemDto.getQuantity()) {
                throw new IllegalArgumentException("재고가 부족합니다. " + product.getName());
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
                .delivery(delivery)
                .orderStatus(OrderStatus.ORDERED)
                .paymentMethod(dto.getPaymentMethod())
                .totalPrice(totalPrice)
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);

        if(dto.getPaymentMethod().name().equals("MOCK")) {
            order.setOrderStatus(OrderStatus.PAID);
        }

        orderRepository.save(order);
    }

    /**
     * 장바구니 기반 주문 처리(cartItemIds 사용)
     *
     */
    @Transactional
    public void createOrderFromCart(CartRequestDto dto,Member member) {

        Delivery delivery = deliveryRepository.findById(dto.getDeliveryId())
                .orElseThrow(() -> new IllegalArgumentException("배송지가 없습니다. id = " + dto.getDeliveryId()));

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
                .delivery(delivery)
                .orderStatus(OrderStatus.ORDERED)
                .paymentMethod(dto.getPaymentMethod())
                .totalPrice(totalPrice)
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);

        if(dto.getPaymentMethod().name().equals("MOCK")) {
            order.setOrderStatus(OrderStatus.PAID);
        }

        orderRepository.save(order);
        cartRepository.deleteAll(cartItems); // 장바구니 비우기
    }

    /**
     * 회원별 주문 목록 조회
     */
    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByMemberID(Member member) {
        List<Order> orders = orderRepository.findByMemberId(member.getId());
        return orders.stream()
                .map(OrderResponseDto::from)
                .collect(Collectors.toList());
    }
    /**
     *결제 완료 처리
     */
    @Transactional
    public void completePayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다," + orderId));
        if(order.getOrderStatus() != OrderStatus.ORDERED) {
            throw new IllegalArgumentException("이미 결제된 주문입니다.");
        }
        order.setOrderStatus(OrderStatus.PAID);

    }

    @Transactional(readOnly = true)
    public Long getTotalSalesBetween(LocalDateTime start, LocalDateTime end) {
        // null 반환 시 0L로 처리 (매출 없는 기간이면 0 반환)
        Long total = orderRepository.getTotalSalesBetween(start, end);
        return total != null ? total : 0L;
    }

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
}
