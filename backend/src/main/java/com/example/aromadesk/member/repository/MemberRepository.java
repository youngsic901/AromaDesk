package com.example.aromadesk.member.repository;

import com.example.aromadesk.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
//JWT 인증전 임의의 파일(order)관련
public interface MemberRepository extends JpaRepository<Member, Long> {
}
