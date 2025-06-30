package com.example.aromadesk.product.controller;

import com.example.aromadesk.product.dto.ProductRequestDTO;
import com.example.aromadesk.product.dto.ProductResponseDTO;
import com.example.aromadesk.product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author : acorn
 * @packageName : com.example.aromadesk.product.controller
 * @fileName : AdminProductController
 * @date : 25. 6. 30.
 **/
@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminProductController {
    private final ProductService productService;

    public AdminProductController(ProductService productService) { this.productService = productService; }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@RequestBody ProductRequestDTO productRequestDTO) {
        System.out.println("createProduct");
        return ResponseEntity.ok(productService.createProduct(productRequestDTO));
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

    @GetMapping
    public ResponseEntity<?> getFilteredPagedProducts(
            @RequestParam(name = "brand", required = false) String brand,
            @RequestParam(name = "gender", required = false) String gender,
            @RequestParam(name = "volume", required = false) String volume,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "20") int size
    ) {
        if (brand != null && brand.isEmpty()) brand = null;
        if (gender != null && gender.isEmpty()) gender = null;
        if (volume != null && volume.isEmpty()) volume = null;
        if (keyword != null && keyword.isEmpty()) keyword = null;
        return ResponseEntity.ok(
                productService.getFilteredSearchedPagedProducts(brand, gender, volume, keyword, page, size)
        );
    }

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        return ResponseEntity.ok(productService.getAllBrands());
    }

}
