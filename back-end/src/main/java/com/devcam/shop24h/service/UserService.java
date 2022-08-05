package com.devcam.shop24h.service;

import com.devcamp.shop24h.model.User;
import com.devcamp.shop24h.security.UserPrincipal;

public interface UserService {
    User createUser(User user);

    UserPrincipal findByUsername(String username);
}
