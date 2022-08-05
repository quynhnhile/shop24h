package com.devcamp.shop24h.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.devcamp.shop24h.model.Token;

public interface TokenRepository extends JpaRepository<Token, Long> {

    Token findByToken(String token);
}
