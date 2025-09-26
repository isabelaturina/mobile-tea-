package com.grupo.chat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChatApplication {

	private static final Logger logger = LoggerFactory.getLogger(ChatApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(ChatApplication.class, args);
		logger.info("✅ APLICAÇÃO INICIADA COM SUCESSO!");
		logger.info("✅ Servidor rodando na porta 8080");
		logger.info("✅ Endpoint REST: http://localhost:8080/chat");
		logger.info("✅ WebSocket: ws://localhost:8080/ws");
		logger.info("✅ Health Check: http://localhost:8080/chat/health");
	}
}