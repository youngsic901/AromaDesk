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
     * 단일 상품 주문 처리 (상품 상세 페이지에서 바로 구매)
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

        Delivery delivery = Delivery.builder()
                .address(dto.getAddress())
                .status(com.example.aromadesk.delivery.entity.DeliveryStatus.PREPARING)
                .order(order)
                .build();

        order.setDelivery(delivery);

        orderRepository.save(order);

        return OrderResponseDto.from(order);
    }

    /**
     * 장바구니 기반 주문 처리(cartItemIds 사용) + OrderResponseDto 반환
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

        Delivery delivery = Delivery.builder()
                .address(dto.getAddress())
                .status(com.example.aromadesk.delivery.entity.DeliveryStatus.PREPARING)
                .order(order)
                .build();

        order.setDelivery(delivery);

        Order savedOrder = orderRepository.save(order);
        cartRepository.deleteAll(cartItems);

        return OrderResponseDto.from(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByMemberID(Member member) {
        List<Order> orders = orderRepository.findByMemberId(member.getId());
        return orders.stream()
                .map(OrderResponseDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void completePayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다. orderId=" + orderId));

        if (order.getOrderStatus() != OrderStatus.ORDERED) {
            throw new IllegalArgumentException("이미 결제된 주문입니다.");
        }

        order.setOrderStatus(OrderStatus.PAID);
    }

    @Transactional(readOnly = true)
    public Long getTotalSalesBetween(LocalDateTime start, LocalDateTime end) {
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


}
