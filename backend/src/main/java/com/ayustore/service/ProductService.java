package com.ayustore.service;

import com.ayustore.dto.CreateProductRequest;
import com.ayustore.dto.ProductDto;
import com.ayustore.entity.Product;
import com.ayustore.exception.ResourceNotFoundException;
import com.ayustore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Cacheable(value = "products", unless = "#result.isEmpty()")
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        log.info("Fetching all active products from database");
        return productRepository.findByIsActiveTrue().stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "product", key = "#id")
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        log.info("Fetching product by id: {}", id);
        Product product = productRepository.findById(id)
                .filter(Product::getIsActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return ProductDto.fromEntity(product);
    }

    @Cacheable(value = "categories")
    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        log.info("Fetching all categories");
        return productRepository.findAllCategories();
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getProductsByCategory(String category) {
        log.info("Fetching products by category: {}", category);
        return productRepository.findByCategoryAndIsActiveTrue(category).stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> searchProducts(String query) {
        log.info("Searching products with query: {}", query);
        return productRepository.findByNameContainingIgnoreCaseAndIsActiveTrue(query).stream()
                .map(ProductDto::fromEntity)
                .collect(Collectors.toList());
    }

    // Admin operations

    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "categories", allEntries = true)
    })
    @Transactional
    public ProductDto createProduct(CreateProductRequest request) {
        log.info("Creating new product: {}", request.getName());
        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .description(request.getDescription())
                .category(request.getCategory())
                .image(request.getImage())
                .stock(request.getStock() != null ? request.getStock() : 0)
                .rating(0.0)
                .reviews(0)
                .isActive(true)
                .build();
        product = productRepository.save(product);
        return ProductDto.fromEntity(product);
    }

    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "product", key = "#id"),
            @CacheEvict(value = "categories", allEntries = true)
    })
    @Transactional
    public ProductDto updateProduct(Long id, CreateProductRequest request) {
        log.info("Updating product: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (request.getName() != null)
            product.setName(request.getName());
        if (request.getPrice() != null)
            product.setPrice(request.getPrice());
        if (request.getDescription() != null)
            product.setDescription(request.getDescription());
        if (request.getCategory() != null)
            product.setCategory(request.getCategory());
        if (request.getImage() != null)
            product.setImage(request.getImage());
        if (request.getStock() != null)
            product.setStock(request.getStock());

        product = productRepository.save(product);
        return ProductDto.fromEntity(product);
    }

    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "product", key = "#id"),
            @CacheEvict(value = "categories", allEntries = true)
    })
    @Transactional
    public void deleteProduct(Long id) {
        log.info("Soft deleting product: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setIsActive(false);
        productRepository.save(product);
    }

    // Internal use - get entity for order processing
    @Transactional(readOnly = true)
    public Product getProductEntity(Long id) {
        return productRepository.findById(id)
                .filter(Product::getIsActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    @Transactional(readOnly = true)
    public long countActiveProducts() {
        return productRepository.findByIsActiveTrue().size();
    }
}
