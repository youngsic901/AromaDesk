package com.example.aromadesk.member.controller;

import com.example.aromadesk.auth.service.MemberLoginService;
import com.example.aromadesk.member.dto.LoginRequest;
import com.example.aromadesk.member.dto.MemberDto;
import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.member.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/members")   // RESTful한 url 사용 권장
@RequiredArgsConstructor          // final 필드 생성자 자동 생성 (lombok)
public class MemberController {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final MemberLoginService memberLoginService;

    // 회원 전체 목록 조회 (GET /api/members)
    @GetMapping
    public ResponseEntity<?> getAllMembers() {
        List<MemberDto> dtos = memberRepository.findAll()
                .stream()
                .map(MemberDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 회원 단일 조회 (GET /api/members/{id})
    @GetMapping("/{id}")
    public ResponseEntity<MemberDto> getMember(@PathVariable Long id) {
        Optional<Member> member = memberRepository.findById(id);
        return member.map(m -> ResponseEntity.ok(MemberDto.fromEntity(m)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody MemberDto dto) {
        // memberId 중복 확인
        if (memberRepository.findByMemberId(dto.getMemberId()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 존재하는 회원ID입니다.");
        }

        // 이메일 중복 확인
        if (memberRepository.findByEmail(dto.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("이미 존재하는 이메일입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        // Member 엔티티 생성
        Member member = Member.builder()
                .memberId(dto.getMemberId())
                .password(encodedPassword)
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .role("USER")
                .build();

        // DB에 저장
        memberRepository.save(member);

        return ResponseEntity.ok("회원가입이 완료되었습니다.");
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberDto dto, HttpSession session) {
        // memberId로 DB에서 회원 찾기
        Optional<Member> memberOpt = memberRepository.findByMemberId(dto.getMemberId());
        if (memberOpt.isEmpty()) {
            return ResponseEntity.status(401).body("존재하지 않는 회원입니다.");
        }
        Member member = memberOpt.get();

        // 비밀번호 일치하는지 확인(암호화 비교)
        if (!passwordEncoder.matches(dto.getPassword(), member.getPassword())) {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }

        // 로그인 성공 → 세션 처리
        MemberDto loginUserDto = MemberDto.fromEntity(member);
        session.setAttribute("CusUser", loginUserDto);
        return ResponseEntity.ok(loginUserDto);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("로그아웃되었습니다.");
    }

    // 현재 로그인한 사용자 정보 조회
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        MemberDto user = (MemberDto) session.getAttribute("CusUser");
        if (user == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        return ResponseEntity.ok(user);
    }

    // 회원 정보 수정
    @PutMapping("/update")
    public ResponseEntity<?> updateMember(@RequestBody MemberDto dto, HttpSession session) {
        MemberDto currentUser = (MemberDto) session.getAttribute("CusUser");
        if (currentUser == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        // DB에서 회원 정보 조회
        Optional<Member> memberOpt = memberRepository.findByMemberId(currentUser.getMemberId());
        if (memberOpt.isEmpty()) {
            return ResponseEntity.status(404).body("회원을 찾을 수 없습니다.");
        }
        Member member = memberOpt.get();

        // 정보 업데이트
        member.setName(dto.getName());
        member.setEmail(dto.getEmail());
        member.setPhone(dto.getPhone());
        member.setAddress(dto.getAddress());

        // 비밀번호가 제공된 경우에만 업데이트
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            member.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        memberRepository.save(member);

        // 세션 정보 업데이트
        MemberDto updatedUserDto = MemberDto.fromEntity(member);
        session.setAttribute("CusUser", updatedUserDto);

        return ResponseEntity.ok(updatedUserDto);
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
}
