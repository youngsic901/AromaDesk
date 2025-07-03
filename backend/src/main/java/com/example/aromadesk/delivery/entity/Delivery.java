package com.example.aromadesk.delivery.entity;

import com.example.aromadesk.order.entity.Order;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Entity
@Setter
@AllArgsConstructor
@Table(name="delivery")
@Builder
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false, length = 255)
    private String address;

    @Column(name = "status", length = 20)
    @Enumerated(EnumType.STRING)
    private DeliveryStatus status = DeliveryStatus.PREPARING;


    @Column(length =100)
    private String trackingNumber;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
