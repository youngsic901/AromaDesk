package com.example.aromadesk.cart.dto;

import com.example.aromadesk.cart.entity.Cart;
import com.example.aromadesk.product.entity.Product;
import lombok.Getter;

/**
 * @author : young
 * @packageName : com.example.aromadesk.cart.dto
 * @fileName : CartResponseDTO
 * @date : 25. 6. 21.
 * @see
 **/

@Getter
public class CartResponseDTO {
    private Long productId;
    private String name;
    private String imageUrl;
    private int price;
    private int quantity;

    public CartResponseDTO(Cart cart) {
        Product product = cart.getProduct();
        this.productId = product.getId();
        this.name = product.getName();
        this.imageUrl = product.getImageUrl();
        this.price = product.getPrice();
        this.quantity = cart.getQuantity();
    }
}
