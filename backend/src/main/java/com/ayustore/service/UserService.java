package com.ayustore.service;

import com.ayustore.dto.UserDto;
import com.ayustore.entity.User;
import com.ayustore.exception.ResourceNotFoundException;
import com.ayustore.repository.UserRepository;
import com.ayustore.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserPrincipal getCurrentUserPrincipal() {
        return (UserPrincipal) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        UserPrincipal principal = getCurrentUserPrincipal();
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", principal.getId()));
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUserDto() {
        return UserDto.fromEntity(getCurrentUser());
    }

    @Transactional(readOnly = true)
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long countUsers() {
        return userRepository.count();
    }

    @Transactional
    public UserDto updateUserRole(UUID userId, User.Role newRole) {
        log.info("Updating role for user {} to {}", userId, newRole);
        User user = getUserById(userId);
        user.setRole(newRole);
        user = userRepository.save(user);
        return UserDto.fromEntity(user);
    }
}
