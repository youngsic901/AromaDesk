package com.example.aromadesk.delivery.controller;

import com.example.aromadesk.delivery.dto.DeliveryStatusResponseDto;
import com.example.aromadesk.delivery.entity.Delivery;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class DeliveryQueryController {

    private final OrderRepository orderRepository;

    @GetMapping("/{orderId}/delivery")
    public ResponseEntity<DeliveryStatusResponseDto> getDeliveryStatus(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

        Delivery delivery = order.getDelivery();
        if(delivery == null){
            throw new IllegalArgumentException("배송 정보가 없습니다.");
        }

        return  ResponseEntity.ok(new DeliveryStatusResponseDto(delivery.getStatus()));
    }
}
