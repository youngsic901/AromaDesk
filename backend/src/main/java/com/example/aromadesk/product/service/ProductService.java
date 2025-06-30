package com.example.aromadesk.product.service;

import com.example.aromadesk.product.dto.ProductRequestDTO;
import com.example.aromadesk.product.dto.ProductResponseDTO;
import com.example.aromadesk.product.entity.Product;
import com.example.aromadesk.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    public ProductResponseDTO createProduct(ProductRequestDTO dto) {
        Product product = new Product();

        product.setName(dto.getName());
        product.setBrand(dto.getBrand());
        product.setGenderCategory(dto.getGenderCategory());
        product.setVolumeCategory(dto.getVolumeCategory());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());
        product.setDescription(dto.getDescription());
        product.setCreatedAt(LocalDateTime.now());

        return new ProductResponseDTO(productRepository.save(product));
    }

    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
        return new ProductResponseDTO(product);
    }

    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

        product.setName(dto.getName());
        product.setBrand(dto.getBrand());
        product.setGenderCategory(dto.getGenderCategory());
        product.setVolumeCategory(dto.getVolumeCategory());
        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setImageUrl(dto.getImageUrl());
        product.setDescription(dto.getDescription());

        return new ProductResponseDTO(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        if(!productRepository.existsById(id)) {
            throw new RuntimeException("상품이 존재하지 않습니다.");
        }
        productRepository.deleteById(id);
    }
}
