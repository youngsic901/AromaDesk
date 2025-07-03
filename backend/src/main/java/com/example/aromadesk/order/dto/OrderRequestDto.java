package com.example.aromadesk.order.dto;

import com.example.aromadesk.order.entity.PaymentMethod;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequestDto {
    private List<OrderItemDto> items;
    private Long deliveryId;
    private PaymentMethod paymentMethod;
    //추가 배송지
    private String address;
    //장바구니 주문 시 사용
    private List<Long> cartItemIds;
}
