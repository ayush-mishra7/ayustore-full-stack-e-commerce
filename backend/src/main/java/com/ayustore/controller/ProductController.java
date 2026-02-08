package com.ayustore.controller;

import com.ayustore.dto.ProductDto;
import com.ayustore.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "Product catalog endpoints")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products", description = "Returns all active products (cached)")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        log.info("GET /api/products - fetching all products");
        List<ProductDto> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Returns a single product by ID (cached)")
    public ResponseEntity<ProductDto> getProductById(
            @Parameter(description = "Product ID") @PathVariable Long id) {
        log.info("GET /api/products/{} - fetching product", id);
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all categories", description = "Returns all unique product categories (cached)")
    public ResponseEntity<List<String>> getAllCategories() {
        log.info("GET /api/products/categories - fetching categories");
        List<String> categories = productService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get products by category", description = "Returns products filtered by category")
    public ResponseEntity<List<ProductDto>> getProductsByCategory(
            @Parameter(description = "Category name") @PathVariable String category) {
        log.info("GET /api/products/category/{} - fetching products", category);
        List<ProductDto> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    @Operation(summary = "Search products", description = "Search products by name")
    public ResponseEntity<List<ProductDto>> searchProducts(
            @Parameter(description = "Search query") @RequestParam String q) {
        log.info("GET /api/products/search?q={} - searching products", q);
        List<ProductDto> products = productService.searchProducts(q);
        return ResponseEntity.ok(products);
    }
}
