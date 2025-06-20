package com.example.aromadesk.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
// product 테이블 권한 설정 테스트용
// 기능 테스트 후 혹은 인가 기능 구현 후 삭제 필!!!!!!
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화 (API 호출 시 필수)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/products/**").permitAll() // 상품 API 모두 허용
                        .anyRequest().authenticated()
                );

        return http.build();
    }
}
