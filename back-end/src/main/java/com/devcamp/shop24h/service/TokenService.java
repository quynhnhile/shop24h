package com.devcamp.shop24h.service;

import com.devcamp.shop24h.model.Token;

public interface TokenService {

    Token createToken(Token token);

    Token findByToken(String token);
}
