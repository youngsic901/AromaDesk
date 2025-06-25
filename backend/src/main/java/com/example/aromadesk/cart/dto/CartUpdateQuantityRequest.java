package com.example.aromadesk.cart.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * @author : youngsic
 * @packageName : com.example.aromadesk.cart.dto
 * @fileName : CartUpdateQuantityRequest
 * @date : 25. 6. 25.
 **/
@Getter
@NoArgsConstructor
public class CartUpdateQuantityRequest {
    private int quantity;
}
