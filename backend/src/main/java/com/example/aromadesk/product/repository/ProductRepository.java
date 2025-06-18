package com.example.aromadesk.product.repository;

import com.example.aromadesk.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
