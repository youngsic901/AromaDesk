package com.example.aromadesk.auth.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class AuthController {

    // GET 로그인 폼
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // POST 처리와 로그아웃은 스프링 시큐리티가 자동으로 처리하므로,
    // 이 컨트롤러에는 login-process나 logout 메서드가 없어야 합니다.
}
