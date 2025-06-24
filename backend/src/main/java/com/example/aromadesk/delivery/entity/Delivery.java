package com.example.aromadesk.delivery.entity;


import jakarta.persistence.*;

@Entity
@Table(name="delivery")
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
