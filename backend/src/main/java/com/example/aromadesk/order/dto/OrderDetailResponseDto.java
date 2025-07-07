package com.example.aromadesk.order.dto;

import com.example.aromadesk.order.entity.Order;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/*************************************************************
 /* SYSTEM NAME      : Order
 /* PROGRAM NAME     : OrderDetailResponseDto.java
 /* DESCRIPTION      : 주문 상세 조회 응답 DTO
 /* MODIFICATION LOG :
 /* DATE         AUTHOR          DESC.
 /*--------     ---------    ----------------------
 /*2025.07.05   SUSU           주문 상세 조회 응답 생성
 /*************************************************************/

@Getter
@Setter
@Builder
public class OrderDetailResponseDto {
    private Long orderId;
    private String memberId;
    private LocalDateTime orderDate;
    private String orderStatus;
    private String deliveryStatus;    // 배송 상태
    private int totalPrice;
    private String address;
    private Long deliveryId;

    public static OrderDetailResponseDto from(Order order) {
        return OrderDetailResponseDto.builder()
                .orderId(order.getId())
                .memberId(order.getMember().getMemberId())
                .orderDate(order.getCreatedAt())
                .orderStatus(order.getOrderStatus().name())
                .deliveryStatus(order.getDelivery() != null ? order.getDelivery().getStatus().name() : null)
                .totalPrice(order.getTotalPrice())
                .address(order.getDelivery() != null ? order.getDelivery().getAddress() : null)
                .deliveryId(order.getDelivery() != null ? order.getDelivery().getId() : null)
                .build();
    }
}
