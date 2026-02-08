package com.ayustore.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse implements Serializable {
    private String token;
    private UserDto user;
}
