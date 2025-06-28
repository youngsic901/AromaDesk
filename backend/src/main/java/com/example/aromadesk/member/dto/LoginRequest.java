package com.example.aromadesk.member.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = "아이디는 필수입니다")
    private String memberId;

    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;
}
