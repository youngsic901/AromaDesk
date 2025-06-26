package com.example.aromadesk.member.controller;

import com.example.aromadesk.member.dto.MemberDto;
import com.example.aromadesk.member.repository.MemberRepository;
import com.example.aromadesk.member.entity.Member;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/members")   // RESTful한 url 사용 권장
@RequiredArgsConstructor          // final 필드 생성자 자동 생성 (lombok)
public class MemberController {

    @Autowired
    private final MemberRepository memberRepository;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    // 회원 전체 목록 조회 (GET /api/members)
    @GetMapping
    public ResponseEntity<?> getAllMembers() {
        return ResponseEntity.ok(memberRepository.findAll());
    }

    // 회원 단일 조회 (GET /api/members/{id})
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMember(@PathVariable Long id) {
        Optional<Member> member = memberRepository.findById(id);
        return member.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 회원가입 (POST /api/members)
    @PostMapping
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        Member newMember = memberRepository.save(member);
        return ResponseEntity.ok(newMember);
    }

    // 회원 정보 수정 (PUT /api/members/{id})
    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member updateRequest) {
        return memberRepository.findById(id)
                .map(member -> {
                    member.setEmail(updateRequest.getEmail());
                    member.setPassword(updateRequest.getPassword());
                    member.setName(updateRequest.getName());
                    member.setPhone(updateRequest.getPhone());
                    member.setAddress(updateRequest.getAddress());
                    member.setRole(updateRequest.getRole());
                    // createdAt은 보통 변경하지 않음
                    Member updated = memberRepository.save(member);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 회원 삭제 (DELETE /api/members/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        if (memberRepository.existsById(id)) {
            memberRepository.deleteById(id);
            return ResponseEntity.ok().build(); // 200 OK
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberDto dto, HttpSession session) {
        // 1. memberId로 DB에서 회원 찾기
        Optional<Member> memberOpt = memberRepository.findByMemberId(dto.getMemberId());
        if (memberOpt.isEmpty()) {
            return ResponseEntity.status(401).body("존재하지 않는 회원입니다.");
        }
        Member member = memberOpt.get();

        // 2. 비밀번호 일치하는지 확인(암호화 비교)
        if (!passwordEncoder.matches(dto.getPassword(), member.getPassword())) {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }

        // 3. 로그인 성공 → JWT 토큰 발급 or 세션 처리
        session.setAttribute("CusUser", MemberDto.fromEntity(member));
        return ResponseEntity.ok(member);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.removeAttribute("CusUser");
        return ResponseEntity.ok("로그아웃되었습니다.");
    }
}