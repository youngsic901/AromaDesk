package com.example.aromadesk.product.repository;

import com.example.aromadesk.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("""
        select p from Product p
        where (:brand IS NULL or p.brand = :brand)
        and (:gender IS NULL or p.genderCategory = :gender)
        and (:volume IS NULL or p.volumeCategory = :volume)
    """)
    List<Product> findFilteredList(@Param("brand")String brand, @Param("gender")String gender, @Param("volume")String volume);
}
