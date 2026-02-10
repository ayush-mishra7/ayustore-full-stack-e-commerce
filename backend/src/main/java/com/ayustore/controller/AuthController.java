package com.ayustore.controller;

import com.ayustore.dto.AuthResponse;
import com.ayustore.dto.LoginRequest;
import com.ayustore.dto.RegisterRequest;
import com.ayustore.dto.UserDto;
import com.ayustore.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and user profile endpoints")
public class AuthController {

    private final UserService userService;

    @Value("${app.cors.allowed-origins}")
    private String frontendUrl;

    @PostMapping("/login")
    @Operation(summary = "Login with email and password", description = "Authenticate user with email/password and return JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        AuthResponse response = userService.authenticateUser(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account with email/password")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());
        AuthResponse response = userService.registerUser(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/google")
    @Operation(summary = "Initiate Google OAuth login", description = "Redirects to Google OAuth consent screen. After successful auth, redirects back with JWT token.")
    public ResponseEntity<AuthResponse> googleLogin() {
        // This endpoint redirects to OAuth2 login automatically via Spring Security
        // The actual redirect is handled by SecurityConfig oauth2Login configuration
        log.info("Google login initiated - redirecting to OAuth2 authorization");
        return ResponseEntity.status(302)
                .header("Location", "/oauth2/authorize/google")
                .build();
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Returns the authenticated user's profile information")
    public ResponseEntity<UserDto> getCurrentUser() {
        log.info("Fetching current user profile");
        UserDto user = userService.getCurrentUserDto();
        return ResponseEntity.ok(user);
    }
}
