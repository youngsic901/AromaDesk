package com.example.aromadesk.order.dto;

import com.example.aromadesk.order.entity.Order;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
public class OrderResponseDto {
    private Long orderId;
    private LocalDateTime orderDate;
    private String status;
    private String paymentMethod;
    private int totalPrice;
    private Long deliveryId;
    private String deliveryStatus;
    private List<String> productNames;
    private String memberName;

    public static OrderResponseDto from(Order order) {
        return OrderResponseDto.builder()
                .orderId(order.getId())
                .orderDate(order.getCreatedAt())
                .status(order.getOrderStatus().name())
                .paymentMethod(order.getPaymentMethod().name())
                .totalPrice(order.getTotalPrice())
                .deliveryId(order.getDelivery() != null ? order.getDelivery().getId() : null)
                .deliveryStatus(order.getDelivery() != null ? order.getDelivery().getStatus().name() : null)
                .productNames(order.getOrderItems().stream()
                        .map(item -> item.getProduct().getName())
                        .collect(Collectors.toList()))
                .memberName(order.getMember().getName())
                .build();
    }

}
