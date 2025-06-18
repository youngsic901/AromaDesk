package com.example.aromadesk.product.service;

import com.example.aromadesk.product.dto.ProductResponseDTO;
import com.example.aromadesk.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductResponseDTO::new)
                .collect(Collectors.toList());
    }
}
