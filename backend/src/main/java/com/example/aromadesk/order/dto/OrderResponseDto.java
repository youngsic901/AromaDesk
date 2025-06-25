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
    private List<String> productNames;

    public static OrderResponseDto from(Order order) {
        return OrderResponseDto.builder()
                .orderId(order.getId())
                .orderDate(order.getOrderDate())
                .status(order.getOrderStatus())
                .productNames(order.getOrderItems().stream()
                        .map(item -> item.getProduct().getName())
                        .collect(Collectors.toList()))
                .build();
    }

}
