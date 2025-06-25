package com.example.aromadesk.cart.controller;

import com.example.aromadesk.cart.dto.CartAddRequest;
import com.example.aromadesk.cart.dto.CartResponseDTO;
import com.example.aromadesk.cart.dto.CartUpdateQuantityRequest;
import com.example.aromadesk.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 장바구니 관련 API 컨트롤러
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartService cartService;

    /**
     * 장바구니 전체 조회
     * GET /api/cart/{memberId}
     */
    @GetMapping("/cart/{memberId}")
    public ResponseEntity<List<CartResponseDTO>> getCartItems(@PathVariable Long memberId) {
        List<CartResponseDTO> cartItems = cartService.getCartItems(memberId);
        return ResponseEntity.ok(cartItems);
    }

    /**
     * 장바구니에 상품 추가
     * POST /api/members/{memberId}/cart
     * Body: { "productId": 5, "quantity": 2 }
     */
    @PostMapping("/members/{memberId}/cart")
    public ResponseEntity<CartResponseDTO> addToCart(
            @PathVariable Long memberId,
            @RequestBody CartAddRequest request
    ) {
        CartResponseDTO cart = cartService.addToCart(memberId, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cart);
    }

    /**
     * 장바구니 상품 수량 변경
     * PUT /api/members/{memberId}/cart/{productId}
     * Body: { "quantity": 7 }
     */
    @PutMapping("/members/{memberId}/cart/{productId}")
    public ResponseEntity<CartResponseDTO> updateQuantity(
            @PathVariable Long memberId,
            @PathVariable Long productId,
            @RequestBody CartUpdateQuantityRequest request
    ) {
        CartResponseDTO updated = cartService.updateQuantity(memberId, productId, request.getQuantity());
        return ResponseEntity.ok(updated);
    }

    /**
     * 장바구니 상품 삭제
     * DELETE /api/members/{memberId}/cart/{productId}
     */
    @DeleteMapping("/members/{memberId}/cart/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long memberId,
            @PathVariable Long productId
    ) {
        cartService.removeFromCart(memberId, productId);
        return ResponseEntity.noContent().build();
    }
}
