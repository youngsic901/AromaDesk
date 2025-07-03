package com.example.aromadesk.delivery.controller;

import com.example.aromadesk.delivery.dto.DeliveryStatusResponseDto;
import com.example.aromadesk.delivery.entity.Delivery;
import com.example.aromadesk.delivery.entity.DeliveryStatus;
import com.example.aromadesk.delivery.service.DeliveryService;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*************************************************************
 /* SYSTEM NAME      : Delivery
 /* PROGRAM NAME     : DeliveryController.class
 /* DESCRIPTION      : 주문 생성 및 조회 API 컨트롤러
 /* MODIFIVATION LOG :
 /* DATA         AUTHOR          DESC.
 /*--------     ---------    ----------------------
 /*2025.07.03   SUSU        배송 상테 추가
 /*************************************************************/

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final OrderRepository orderRepository;
    private final DeliveryService deliveryService;

    /**
     * 특정 주문의 배송 상태 조회
     */
    @GetMapping("/orders/{orderId}/status")
    public ResponseEntity<DeliveryStatusResponseDto> getDeliveryStatus(@PathVariable Long orderId) {
        DeliveryStatus status = deliveryService.getDeliveryStatus(orderId);
        return ResponseEntity.ok(new DeliveryStatusResponseDto(status.name()));
    }

    /**
     * 배송 상태 변경
     */
    @PutMapping("/{deliveryId}/status/{newStatus}")
    public ResponseEntity<String> updateDeliveryStatus(@PathVariable Long deliveryId, @PathVariable String newStatus) {
        deliveryService.updateDeliveryStatus(deliveryId, DeliveryStatus.valueOf(newStatus));
        return ResponseEntity.ok("배송 상태가 변경되었습니다.");
    }

    /**
     * 전체 배송 조회
     */
    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    /**
     * 배송 정보 생성
     */
    @PostMapping("/create/{orderId}")
    public ResponseEntity<String> createDelivery(
            @PathVariable Long orderId,
            @RequestParam String address,
            @RequestParam(required = false) String trackingNumber
    ) {
        deliveryService.createDelivery(orderId, address, trackingNumber);
        return ResponseEntity.ok("배송 정보가 생성되었습니다.");
    }

    /**
     * 배송 정보 수정 (주소 + 운송장 번호)
     */
    @PutMapping("/{deliveryId}")
    public ResponseEntity<String> updateDeliveryInfo(
            @PathVariable Long deliveryId,
            @RequestParam String newAddress,
            @RequestParam(required = false) String newTrackingNumber
    ) {
        deliveryService.updateDeliveryInfo(deliveryId, newAddress, newTrackingNumber);
        return ResponseEntity.ok("배송 정보가 수정되었습니다.");
    }


}
