package com.example.aromadesk.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
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


}
