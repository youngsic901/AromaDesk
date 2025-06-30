package com.example.aromadesk.auth.service;

import com.example.aromadesk.member.repository.MemberRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final MemberRepository memberRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getEmail();

        boolean exists  = memberRepository.findByEmail(email).isPresent();

        if (exists) {
            response.sendRedirect("http://localhost:3000");
        } else {
            request.getSession().setAttribute("email", email);
            request.getSession().setAttribute("name", oAuth2User.getName());
            response.sendRedirect("http://localhost:3000/signup");
        }
    }
}
