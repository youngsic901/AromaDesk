package com.example.aromadesk.auth.contorller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @GetMapping("/login")
    public ResponseEntity<?> login() {
        // 프론트엔드 SPA가 로그인 페이지 렌더링을 담당한다는 의미로
        return ResponseEntity.noContent().build();
    }
}
