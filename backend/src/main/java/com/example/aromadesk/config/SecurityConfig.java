package com.example.aromadesk.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	// AuthenticationManager 빈 등록
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConf) throws Exception {
		return authConf.getAuthenticationManager();
	}

	// Security 필터 체인 설정
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				// 1) 인증 없이 허용할 경로
				.csrf(csrf -> csrf.disable()) // ★ 추가!
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(
								"/",
								"/auth/login",
								"/auth/login-process",
								"/auth/logout",
								"/css/**", "/js/**", "/images/**",
								"/api/health", "/api/products/**",
								"/api/members", "/api/members/**"
						).permitAll()
						.anyRequest().authenticated()
				
				)
				// 3) 폼 로그인 커스터마이징
				.formLogin(form -> form
						.loginPage("/auth/login")             // GET 로그인 폼 보여줄 URL
						.loginProcessingUrl("/auth/login-process") // POST 인증 처리 URL
						.usernameParameter("memberId")        // 폼의 name 이름
						.passwordParameter("password")
						.defaultSuccessUrl("/", true)         // 로그인 성공 후 "홈(/)"으로
						.failureUrl("/auth/login?error")      // 인증 실패 시
						.permitAll()
				)
				// 4) 로그아웃 설정
				.logout(logout -> logout
						.logoutUrl("/auth/logout")
						.logoutSuccessUrl("/auth/login?logout")
						.invalidateHttpSession(true)
						.deleteCookies("JSESSIONID")
						.permitAll()
				);

		return http.build();
	}

	// 비밀번호 암호화 방식
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}