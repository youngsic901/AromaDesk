package com.example.aromadesk.product.service;

import com.example.aromadesk.product.dto.ProductResponseDTO;
import com.example.aromadesk.product.entity.Product;
import com.example.aromadesk.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
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

    public Map<String, Object> getFilteredPagedProducts(String brand, String gender, String volume, int page, int size) {
        List<Product> all = productRepository.findFilteredList(brand, gender, volume);

        int fromIndex = Math.max((page - 1) * size, 0);
        int toIndex = Math.min(fromIndex + size, all.size());
        List<Product> paged = all.subList(fromIndex, toIndex);

        List<ProductResponseDTO> content = paged.stream().map(ProductResponseDTO::new).toList();

        return Map.of(
                "content" , content,
                "totalElements", all.size(),
                "page", page,
                "size", size,
                "totalPages", (int)Math.ceil((double) all.size()/size)
        );
    }
}
