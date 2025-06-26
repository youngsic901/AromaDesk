package com.example.aromadesk.config;

import com.example.aromadesk.auth.service.AdminLoginService;
import com.example.aromadesk.auth.service.CustomOAuth2UserService;
import com.example.aromadesk.auth.service.MemberLoginService;
import com.example.aromadesk.member.repository.MemberRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
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

	@Bean
	@Order(2)
	public SecurityFilterChain userSecurityFilterChain(HttpSecurity http, MemberRepository memberRepository) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				.userDetailsService(memberLoginService)
				.securityMatcher("/**")
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(
								"/api/members/login", "/api/members/logout",
								"/api/members",
								"/css/**", "/js/**", "/images/**",
								"/api/health", "/api/products/**", "/api/members/**", "/error",
								"/api/cart/**","/members/**","/api/orders/**",
								"/oauth2/**", "/login/oauth2/**", "/oauth2/authorization/**"
						).permitAll()
						.anyRequest().authenticated()
				)
				.oauth2Login(oauth2 -> oauth2
						.loginPage("/auth/login")
						.defaultSuccessUrl("/", true)
						.userInfoEndpoint(userInfo -> userInfo
								.userService(customOAuth2UserService(memberRepository))
						)
				);
		return http.build();
	}

	@Bean
	@Order(1)
	public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http) throws Exception {
		http
				.csrf(csrf -> csrf.disable())
				.userDetailsService(adminLoginService)
				.securityMatcher("/admin/**")
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/admin/login", "/admin/login-process").permitAll()
						.anyRequest().hasRole("ADMIN")
				);
		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public CustomOAuth2UserService customOAuth2UserService(MemberRepository memberRepository) {
		return new CustomOAuth2UserService(memberRepository);
	}

	// 선택: 만약 authenticationManager 필요하면 아래 포함
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConf) throws Exception {
		return authConf.getAuthenticationManager();
	}
}
