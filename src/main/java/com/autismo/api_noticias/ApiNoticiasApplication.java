package com.autismo.api_noticias;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ApiNoticiasApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiNoticiasApplication.class, args);
	}
}
