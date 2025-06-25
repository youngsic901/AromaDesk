package com.example.aromadesk.member.controller;

import com.example.aromadesk.member.repository.MemberRepository;
import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.member.dto.MemberDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // 회원 전체 목록 조회 (GET /api/members)
    @GetMapping
    public ResponseEntity<List<MemberDto>> getAllMembers() {
        List<MemberDto> members = memberRepository.findAll()
                .stream()
                .map(MemberDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(members);
    }

    // 회원 단일 조회 (GET /api/members/{id})
    @GetMapping("/{id}")
    public ResponseEntity<MemberDto> getMember(@PathVariable Long id) {
        Optional<Member> member = memberRepository.findById(id);
        return member
                .map(m -> ResponseEntity.ok(MemberDto.fromEntity(m)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 회원가입 (POST /api/members)
    @PostMapping
    public ResponseEntity<MemberDto> createMember(@RequestBody MemberDto dto) {
        // 1. 비밀번호 암호화
        String encodedPw = passwordEncoder.encode(dto.getPassword());
        dto.setPassword(encodedPw);

        // 2. 저장
        Member saved = memberRepository.save(dto.toEntity());

        // 3. 응답 시 비밀번호는 포함 X
        return ResponseEntity.ok(MemberDto.fromEntity(saved));
    }


    // 회원 정보 수정 (PUT /api/members/{id})
    @PutMapping("/{id}")
    public ResponseEntity<MemberDto> updateMember(@PathVariable Long id, @RequestBody MemberDto dto) {
        return memberRepository.findById(id)
                .map(member -> {
                    member.setEmail(dto.getEmail());
                    member.setPassword(passwordEncoder.encode(dto.getPassword())); // 암호화 필요!
                    member.setName(dto.getName());
                    member.setPhone(dto.getPhone());
                    // member.setAddress(dto.getAddress()); // MemberDto에 address 필드가 있으면 추가
                    member.setRole(dto.getRole());         // MemberDto에 role 필드가 있으면 추가
                    Member updated = memberRepository.save(member);
                    return ResponseEntity.ok(MemberDto.fromEntity(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 회원 삭제 (DELETE /api/members/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        if (memberRepository.existsById(id)) {
            memberRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}