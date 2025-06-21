package com.example.aromadesk.order.service;

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
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final MemberRepository memberRepository;
    private final DeliveryRepository deliveryRepository;

    @Transactional
    public void createOrder(OrderRequestDto dto, Long memberId) {
        //1. Member 조회(임시 memberId 기반, 추후 JWT로 대체)
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다. "));

        //2. Delivery 조회
        Delivery delivery = deliveryRepository.findById(dto.getDeliveryId())
                .orElseThrow(() -> new IllegalArgumentException(("배송지가 존재하지 않습니다. ")));

        //3. OrderItem 생성 리스트
        List<OrderItem> orderItems = dto.getItems().stream().map(itemDto -> {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다."));

            return OrderItem.builder()
                    .product(product)
                    .quantity(itemDto.getQuantity())
                    .price(product.getPrice())  //상품의 현재 가격 기준
                    .build();
        }).collect(Collectors.toList());

        // 총 주문 금액 계산
        int totalPrice = orderItems.stream()
                .mapToInt(item -> item.getPrice() * item.getQuantity())
                .sum();

        //4. order 생성
        Order order = Order.builder()
                .member(member)
                .delivery(delivery)
                .orderStatus(OrderStatus.ORDERED)
                .paymentMethod(dto.getPaymentMethod())
                .orderDate(LocalDateTime.now())
                .totalPrice(totalPrice)
                .build();

        //5. orderItem , order연관관계
        for(OrderItem item: orderItems) {
            item.setOrder(order);
        }
        order.setOrderItems(orderItems);

        //6. 저장
        orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByMemberId(Long memberId) {
        List<Order> orders = orderRepository.findByMemberId(memberId);
        return orders.stream()
                .map(OrderResponseDto::from)
                .collect(Collectors.toList());
    }

}
