package com.example.aromadesk.auth.service;

import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.member.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class MemberLoginService implements UserDetailsService{

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String memberId) throws UsernameNotFoundException {
        Member member = memberRepository
                .findByMemberId(memberId)
                .orElseThrow(() -> new UsernameNotFoundException("ID 오류:" + memberId));

        return User.builder()
                .username(member.getMemberId())
                .password(passwordEncoder.encode(member.getPassword()))
                .roles(member.getRole())
                .build();
    }
}