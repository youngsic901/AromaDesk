package com.example.aromadesk.product.controller;

import com.example.aromadesk.product.dto.ProductRequestDTO;
import com.example.aromadesk.product.dto.ProductResponseDTO;
import com.example.aromadesk.product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 필터링된 상품 목록 출력
    @GetMapping
    public ResponseEntity<?> getFilteredPagedProducts(
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "gender", required = false) String gender,
            @RequestParam(name = "volume", required = false) String volume,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
                productService.getFilteredPagedProducts(brand, gender, volume, page, size)
        );
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@RequestBody ProductRequestDTO productRequestDTO) {
        System.out.println("createProduct");
        return ResponseEntity.ok(productService.createProduct(productRequestDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProduct(@PathVariable("id") Long id) {
        ProductResponseDTO dto = productService.getProductById(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable("id") Long id, @RequestBody ProductRequestDTO productRequestDTO) {
        return ResponseEntity.ok(productService.updateProduct(id, productRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> deleteProduct(@PathVariable("id") Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
