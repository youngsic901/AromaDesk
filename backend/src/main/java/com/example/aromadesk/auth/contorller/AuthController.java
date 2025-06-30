package com.example.aromadesk.auth.contorller;

import com.example.aromadesk.auth.service.MemberLoginService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final MemberLoginService memberLoginService;

    public AuthController(MemberLoginService memberLoginService) {
        this.memberLoginService = memberLoginService;
    }

    @GetMapping("/login")
    public ResponseEntity<?> login() {
        // 프론트엔드 SPA가 로그인 페이지 렌더링을 담당한다는 의미로
        return ResponseEntity.noContent().build();
    }
}
