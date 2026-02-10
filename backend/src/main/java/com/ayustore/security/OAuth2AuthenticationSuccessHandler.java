package com.ayustore.security;

import com.ayustore.entity.User;
import com.ayustore.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

        private final JwtTokenProvider tokenProvider;
        private final UserRepository userRepository;

        @Value("${app.cors.allowed-origins}")
        private String frontendUrl;

        @Override
        @Transactional
        public void onAuthenticationSuccess(HttpServletRequest request,
                        HttpServletResponse response,
                        Authentication authentication) throws IOException {

                Object principal = authentication.getPrincipal();

                String email;
                String name;
                String avatar;
                String googleId;

                // Handle both OIDC and OAuth2 users
                if (principal instanceof OidcUser) {
                        OidcUser oidcUser = (OidcUser) principal;
                        email = oidcUser.getEmail();
                        name = oidcUser.getFullName();
                        avatar = oidcUser.getPicture();
                        googleId = oidcUser.getSubject();
                        log.info("OIDC user authentication: {}", email);
                } else if (principal instanceof OAuth2User) {
                        OAuth2User oAuth2User = (OAuth2User) principal;
                        Map<String, Object> attributes = oAuth2User.getAttributes();
                        email = (String) attributes.get("email");
                        name = (String) attributes.get("name");
                        avatar = (String) attributes.get("picture");
                        googleId = (String) attributes.get("sub");
                        log.info("OAuth2 user authentication: {}", email);
                } else if (principal instanceof UserPrincipal) {
                        UserPrincipal userPrincipal = (UserPrincipal) principal;
                        String token = tokenProvider.generateToken(
                                        userPrincipal.getId(),
                                        userPrincipal.getEmail(),
                                        userPrincipal.getRole());
                        redirectWithToken(request, response, token);
                        return;
                } else {
                        log.error("Unknown principal type: {}", principal.getClass().getName());
                        response.sendRedirect(frontendUrl + "/#/login?error=auth_failed");
                        return;
                }

                // Find or create user
                User user = findOrCreateUser(email, name, avatar, googleId);

                // Generate JWT token
                String token = tokenProvider.generateToken(
                                user.getId(),
                                user.getEmail(),
                                user.getRole().name());

                log.info("OAuth2 authentication success for user: {}", email);
                redirectWithToken(request, response, token);
        }

        private User findOrCreateUser(String email, String name, String avatar, String googleId) {
                // Find existing user by Google ID
                Optional<User> existingUser = userRepository.findByGoogleId(googleId);

                if (existingUser.isPresent()) {
                        User user = existingUser.get();
                        // Update profile info
                        user.setName(name);
                        user.setAvatar(avatar);
                        user = userRepository.save(user);
                        log.info("Updated existing user: {}", user.getEmail());
                        return user;
                }

                // Check if email already exists (first time Google login for existing email)
                Optional<User> userByEmail = userRepository.findByEmail(email);
                if (userByEmail.isPresent()) {
                        User user = userByEmail.get();
                        user.setGoogleId(googleId);
                        user.setAvatar(avatar);
                        user = userRepository.save(user);
                        log.info("Linked Google account to existing user: {}", user.getEmail());
                        return user;
                }

                // Create new user
                User user = User.builder()
                                .email(email)
                                .name(name)
                                .avatar(avatar)
                                .googleId(googleId)
                                .role(User.Role.USER)
                                .build();
                user = userRepository.save(user);
                log.info("Created new user: {}", user.getEmail());
                return user;
        }

        private void redirectWithToken(HttpServletRequest request, HttpServletResponse response, String token)
                        throws IOException {
                // FIXED: Use HashRouter compatible format: /#/callback?token=xxx
                // This works with React HashRouter which expects routes after #/
                String targetUrl = frontendUrl + "/#/callback?token=" + token;
                log.info("Redirecting to: {}", targetUrl);
                getRedirectStrategy().sendRedirect(request, response, targetUrl);
        }
}
