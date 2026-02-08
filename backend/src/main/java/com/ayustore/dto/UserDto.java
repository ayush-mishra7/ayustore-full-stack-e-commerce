package com.ayustore.dto;

import com.ayustore.entity.User;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto implements Serializable {
    private String id;
    private String name;
    private String email;
    private String role;
    private String avatar;

    public static UserDto fromEntity(User user) {
        return UserDto.builder()
                .id(user.getId().toString())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name().toLowerCase())
                .avatar(user.getAvatar())
                .build();
    }
}
