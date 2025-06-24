package com.example.aromadesk.product.dto;

import com.example.aromadesk.product.entity.Product;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String brand;
    private String genderCategory;
    private String volumeCategory;
    private int price;
    private String imageUrl;

    public ProductResponseDTO(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.brand = product.getBrand();
        this.genderCategory = product.getGenderCategory();
        this.volumeCategory = product.getVolumeCategory();
        this.price = product.getPrice();
        this.imageUrl = product.getImageUrl();
    }
}
