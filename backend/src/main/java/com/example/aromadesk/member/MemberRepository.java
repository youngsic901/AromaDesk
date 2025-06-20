package com.example.aromadesk.member;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByMemberIdAndPassword(String memberId, String password);

    Optional<Member> findByMemberId(String memberId);
}
