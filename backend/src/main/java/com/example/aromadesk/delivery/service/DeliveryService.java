package com.example.aromadesk.delivery.service;

import com.example.aromadesk.delivery.entity.Delivery;
import com.example.aromadesk.delivery.entity.DeliveryStatus;
import com.example.aromadesk.delivery.repostiory.DeliveryRepository;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {
    private final OrderRepository orderRepository;
    private final DeliveryRepository deliveryRepository;

    /**
     *배송 상테 조회
     */
    @Transactional(readOnly = true)
    public DeliveryStatus getDeliveryStatus(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

        Delivery delivery = order.getDelivery();
        if(delivery == null){
            throw new IllegalArgumentException("배송 정보가 없습니다.");
        }

        return delivery.getStatus();
    }

    /**
     * 배송 상태 변경
     */
    @Transactional
    public void updateDeliveryStatus(Long deliveryId, DeliveryStatus newStatus) {
        Delivery delivery = deliveryRepository.findById(deliveryId).orElseThrow(() -> new IllegalArgumentException("배송 정보가 없습니다."));

        delivery.setStatus(newStatus);
    }

    /**
     * 전체 배송 조회
     */
    @Transactional(readOnly = true)
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }

    /**
     * 배송 정보 생성
     */
    @Transactional
    public Delivery createDelivery(Long orderId, String address, String trackingNumber) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

        Delivery delivery = new Delivery();
        delivery.setOrder(order);
        delivery.setAddress(address);
        delivery.setTrackingNumber(trackingNumber);
        delivery.setStatus(DeliveryStatus.PREPARING);  // 기본값 설정

        return deliveryRepository.save(delivery);
    }

    /**
     * 배송지 및 운송장 번호 수정
     */
    @Transactional
    public void updateDeliveryInfo(Long deliveryId, String newAddress, String newTrackingNumber) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("배송 정보가 없습니다."));
        delivery.setAddress(newAddress);
        delivery.setTrackingNumber(newTrackingNumber);
    }


}
