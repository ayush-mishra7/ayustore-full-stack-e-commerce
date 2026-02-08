package com.ayustore.config;

import com.ayustore.entity.Product;
import com.ayustore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

        private final ProductRepository productRepository;

        @Bean
        @Profile("!test")
        public CommandLineRunner seedData() {
                return args -> {
                        if (productRepository.count() == 0) {
                                log.info("Seeding initial product data...");
                                seedProducts();
                        }
                };
        }

        private void seedProducts() {
                List<Product> products = List.of(
                                Product.builder()
                                                .name("Premium Wireless Headphones")
                                                .price(new BigDecimal("129.99"))
                                                .description(
                                                                "Experience high-fidelity audio with our premium noise-cancelling headphones. Designed for comfort and longevity with 30-hour battery life.")
                                                .category("Electronics")
                                                .image("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400")
                                                .rating(4.5)
                                                .reviews(128)
                                                .stock(50)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Ergonomic Office Chair")
                                                .price(new BigDecimal("299.99"))
                                                .description(
                                                                "Premium ergonomic chair with lumbar support, adjustable armrests, and breathable mesh back. Perfect for long work sessions.")
                                                .category("Furniture")
                                                .image("https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400")
                                                .rating(4.7)
                                                .reviews(89)
                                                .stock(25)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Smart Watch Pro")
                                                .price(new BigDecimal("249.99"))
                                                .description(
                                                                "Advanced smartwatch with health monitoring, GPS, and 7-day battery life. Water resistant up to 50m.")
                                                .category("Electronics")
                                                .image("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400")
                                                .rating(4.6)
                                                .reviews(256)
                                                .stock(100)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Minimalist Desk Lamp")
                                                .price(new BigDecimal("49.99"))
                                                .description(
                                                                "Modern LED desk lamp with adjustable brightness and color temperature. USB charging port included.")
                                                .category("Accessories")
                                                .image("https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400")
                                                .rating(4.3)
                                                .reviews(67)
                                                .stock(75)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Leather Laptop Bag")
                                                .price(new BigDecimal("89.99"))
                                                .description(
                                                                "Handcrafted genuine leather laptop bag with padded compartment for laptops up to 15 inches. Multiple pockets for organization.")
                                                .category("Accessories")
                                                .image("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400")
                                                .rating(4.4)
                                                .reviews(112)
                                                .stock(40)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Mechanical Keyboard")
                                                .price(new BigDecimal("159.99"))
                                                .description(
                                                                "Premium mechanical keyboard with Cherry MX switches, RGB backlighting, and aircraft-grade aluminum frame.")
                                                .category("Electronics")
                                                .image("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400")
                                                .rating(4.8)
                                                .reviews(203)
                                                .stock(60)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Standing Desk Converter")
                                                .price(new BigDecimal("199.99"))
                                                .description(
                                                                "Transform any desk into a standing desk. Smooth height adjustment with gas spring mechanism. Supports up to 35 lbs.")
                                                .category("Furniture")
                                                .image("https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400")
                                                .rating(4.2)
                                                .reviews(45)
                                                .stock(30)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Wireless Mouse")
                                                .price(new BigDecimal("39.99"))
                                                .description(
                                                                "Precision wireless mouse with ergonomic design and silent clicks. 6-month battery life with single AA battery.")
                                                .category("Electronics")
                                                .image("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400")
                                                .rating(4.1)
                                                .reviews(178)
                                                .stock(150)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("USB-C Hub")
                                                .price(new BigDecimal("59.99"))
                                                .description(
                                                                "7-in-1 USB-C hub with HDMI 4K, USB 3.0 ports, SD card reader, and 100W power delivery pass-through.")
                                                .category("Electronics")
                                                .image("https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400")
                                                .rating(4.5)
                                                .reviews(92)
                                                .stock(80)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Noise Cancelling Earbuds")
                                                .price(new BigDecimal("179.99"))
                                                .description(
                                                                "True wireless earbuds with active noise cancellation, transparency mode, and 24-hour total battery life with case.")
                                                .category("Electronics")
                                                .image("https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400")
                                                .rating(4.6)
                                                .reviews(315)
                                                .stock(120)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Monitor Stand")
                                                .price(new BigDecimal("44.99"))
                                                .description(
                                                                "Bamboo monitor stand with storage drawer. Elevates screen to eye level for better posture.")
                                                .category("Accessories")
                                                .image("https://images.unsplash.com/photo-1527443060795-0402a18106c2?w=400")
                                                .rating(4.0)
                                                .reviews(56)
                                                .stock(45)
                                                .isActive(true)
                                                .build(),
                                Product.builder()
                                                .name("Webcam HD")
                                                .price(new BigDecimal("79.99"))
                                                .description(
                                                                "1080p HD webcam with auto-focus, dual noise-cancelling microphones, and privacy cover. Perfect for video calls.")
                                                .category("Electronics")
                                                .image("https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400")
                                                .rating(4.4)
                                                .reviews(134)
                                                .stock(55)
                                                .isActive(true)
                                                .build());

                productRepository.saveAll(products);
                log.info("Seeded {} products", products.size());
        }
}
