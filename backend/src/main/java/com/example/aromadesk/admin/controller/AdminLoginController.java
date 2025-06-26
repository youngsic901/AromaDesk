package com.example.aromadesk.admin.controller;

import com.example.aromadesk.admin.dto.AdminDto;
import com.example.aromadesk.admin.entity.Admin;
import com.example.aromadesk.admin.repository.AdminRepository;
import com.example.aromadesk.member.dto.MemberDto;
import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.member.repository.MemberRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/admin")   // RESTful한 url 사용 권장
@RequiredArgsConstructor          // final 필드 생성자 자동 생성 (lombok)
public class AdminLoginController {
    @Autowired
    private final AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminDto dto, HttpSession session) {
        // 1. Id로 DB에서 찾기
        Optional<Admin> adminOpt = adminRepository.findByUsername(dto.getUsername());
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body("존재하지 않는 회원입니다.");
        }
        Admin admin = adminOpt.get();

        // 2. 비밀번호 일치하는지 확인(암호화 비교)
        if (!passwordEncoder.matches(dto.getPassword(), admin.getPassword())) {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }

        // 3. 로그인 성공 → 세션 처리
        session.setAttribute("Admin", AdminDto.fromEntity(admin));
        return ResponseEntity.ok(admin);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.removeAttribute("Admin");
        return ResponseEntity.ok("로그아웃되었습니다.");
    }
}
