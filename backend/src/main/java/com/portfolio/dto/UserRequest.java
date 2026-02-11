package com.portfolio.dto;

import com.portfolio.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    @NotBlank(message = "El email es requerido")
    @Email(message = "Email inválido")
    private String email;

    private String name;  // Removed @NotBlank to make it optional
    private String phone;
    private String bio;
    private String avatarUrl;
    private Role role;
}
