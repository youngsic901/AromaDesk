package com.example.aromadesk.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class SameSiteCookieFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        chain.doFilter(request, response);

        if (response instanceof HttpServletResponse res) {
            for (String header : res.getHeaders("Set-Cookie")) {
                if (header.startsWith("JSESSIONID")) {
                    res.setHeader("Set-Cookie", header + "; SameSite=Lax");
                    // 또는 "; SameSite=None; Secure" → 배포 환경에서는 이 방식 사용
                }
            }
        }
    }
}
