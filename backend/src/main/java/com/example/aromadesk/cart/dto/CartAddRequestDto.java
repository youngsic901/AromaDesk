package com.example.aromadesk.cart.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * @author : youngsic
 * @packageName : com.example.aromadesk.cart.dto
 * @fileName : CartAddRequestDto
 * @date : 25. 6. 25.
 **/
@Getter
@NoArgsConstructor
public class CartAddRequestDto {
    private Long productId;
    private int quantity;
}
