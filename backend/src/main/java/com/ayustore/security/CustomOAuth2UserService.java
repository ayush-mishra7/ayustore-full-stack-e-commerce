package com.ayustore.security;

import com.ayustore.entity.User;
import com.ayustore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        Map<String, Object> attributes = oAuth2User.getAttributes();
        String googleId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String avatar = (String) attributes.get("picture");

        log.info("OAuth2 login for email: {}", email);

        // Find existing user or create new one
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update profile info
            user.setName(name);
            user.setAvatar(avatar);
            user = userRepository.save(user);
            log.info("Updated existing user: {}", user.getEmail());
        } else {
            // Check if email already exists (first time Google login for existing email)
            Optional<User> userByEmail = userRepository.findByEmail(email);
            if (userByEmail.isPresent()) {
                user = userByEmail.get();
                user.setGoogleId(googleId);
                user.setAvatar(avatar);
                user = userRepository.save(user);
                log.info("Linked Google account to existing user: {}", user.getEmail());
            } else {
                // Create new user
                user = User.builder()
                        .email(email)
                        .name(name)
                        .avatar(avatar)
                        .googleId(googleId)
                        .role(User.Role.USER)
                        .build();
                user = userRepository.save(user);
                log.info("Created new user: {}", user.getEmail());
            }
        }

        return UserPrincipal.create(user, attributes);
    }
}
