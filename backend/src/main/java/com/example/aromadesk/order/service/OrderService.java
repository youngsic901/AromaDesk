package com.example.aromadesk.order.service;

import com.example.aromadesk.cart.dto.CartRequestDto;
import com.example.aromadesk.cart.entity.Cart;
import com.example.aromadesk.cart.repository.CartRepository;
import com.example.aromadesk.delivery.entity.Delivery;
import com.example.aromadesk.delivery.entity.DeliveryStatus;
import com.example.aromadesk.member.entity.Member;
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

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;

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

        Delivery delivery = Delivery.builder()
                .address(dto.getAddress())
                .status(DeliveryStatus.PREPARING)
                .order(order)
                .build();

        order.setDelivery(delivery);
        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);

        orderRepository.save(order);
        return OrderResponseDto.from(order);
    }

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
                .orderStatus(OrderStatus.ORDERED)
                .paymentMethod(dto.getPaymentMethod())
                .totalPrice(totalPrice)
                .build();

        Delivery delivery = Delivery.builder()
                .address(dto.getAddress())
                .status(DeliveryStatus.PREPARING)
                .order(order)
                .build();

        order.setDelivery(delivery);
        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);

        if (dto.getPaymentMethod().name().equals("MOCK")) {
            order.setOrderStatus(OrderStatus.PAID);
        }

        Order savedOrder = orderRepository.save(order);
        cartRepository.deleteAll(cartItems);

        return OrderResponseDto.from(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByMemberID(Member member) {
        return orderRepository.findByMemberId(member.getId()).stream()
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
        return Optional.ofNullable(orderRepository.getTotalSalesBetween(start, end)).orElse(0L);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> countOrdersByStatusBetween(LocalDateTime start, LocalDateTime end) {
        List<Object[]> result = orderRepository.countOrdersByStatusBetween(start, end);
        Map<String, Long> countMap = new HashMap<>();
        for (Object[] row : result) {
            countMap.put(row[0].toString(), (Long) row[1]);
        }
        return countMap;
    }
}
