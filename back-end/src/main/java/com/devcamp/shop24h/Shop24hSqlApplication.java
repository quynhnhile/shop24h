package com.devcamp.shop24h;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaAuditing
public class Shop24hSqlApplication {

	public static void main(String[] args) {
		SpringApplication.run(Shop24hSqlApplication.class, args);
	}

}
