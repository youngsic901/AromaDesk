package com.example.aromadesk.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private final MemberLoginService memberLoginService;
	private final AdminLoginService adminLoginService;
  
  
	public SecurityConfig(MemberLoginService memberLoginService, AdminLoginService adminLoginService) {
		this.memberLoginService = memberLoginService;
		this.adminLoginService = adminLoginService;
	}
  // Security 필터 체인 설정
	@Bean
	@Order(2)
	public SecurityFilterChain userSecurityFilterChain(HttpSecurity http) throws Exception {
		http
				.userDetailsService(memberLoginService)
				.securityMatcher("/**")
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(
								"/", "/auth/login", "/auth/login-process", "/auth/logout",
								"/css/**", "/js/**", "/images/**",
								"/api/health", "/api/products/**", "/api/members/**", "/error"
						).permitAll()
						.anyRequest().authenticated()
				)
				.formLogin(form -> form
						.loginPage("/auth/login")
						.loginProcessingUrl("/auth/login-process")
						.usernameParameter("memberId")
						.passwordParameter("password")
						.defaultSuccessUrl("/", true)
						.failureUrl("/auth/login?error")
						.permitAll()
				)
				.logout(logout -> logout
						.logoutUrl("/auth/logout")
						.logoutSuccessUrl("/auth/login?logout")
						.invalidateHttpSession(true)
						.deleteCookies("JSESSIONID")
						.permitAll()
				);
		return http.build();
	}
  // Security 필터 체인 설정
	@Bean
	@Order(1)
	public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http) throws Exception {
		http
				.userDetailsService(adminLoginService)
				.securityMatcher("/admin/**")
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/admin/login", "/admin/login-process").permitAll()
						.anyRequest().hasRole("ADMIN")
				)
				.formLogin(form -> form
						.loginPage("/admin/login")
						.loginProcessingUrl("/admin/login-process")
						.usernameParameter("username")
						.passwordParameter("password")
						.defaultSuccessUrl("/admin/dashboard", true)
						.failureUrl("/admin/login?error")
						.permitAll()
				)
				.logout(logout -> logout
						.logoutUrl("/admin/logout")
						.logoutSuccessUrl("/admin/login?logout")
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
