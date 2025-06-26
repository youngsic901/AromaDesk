package com.example.aromadesk.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;
    private String genderCategory;
    private String volumeCategory;

    private int price;
    private int stock;

    private String imageUrl;
    private String description;

    private LocalDateTime createdAt;

    public void decreaseStock(int quantity) {
        if(this.stock <quantity) {
            throw new IllegalArgumentException("재고가 부족합니다 현재 재고 " + this.stock );
        }
        this.stock -= quantity;
    }

}
