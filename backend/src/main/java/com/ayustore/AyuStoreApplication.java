package com.ayustore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class AyuStoreApplication {

    @org.springframework.context.annotation.Bean
    public org.springframework.boot.CommandLineRunner debugRunner(
            @org.springframework.beans.factory.annotation.Value("${spring.security.oauth2.client.registration.google.client-id}") String clientId) {
        return args -> {
            System.out.println("DEBUG: Google Client ID is: " + clientId);
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(AyuStoreApplication.class, args);
    }
}
