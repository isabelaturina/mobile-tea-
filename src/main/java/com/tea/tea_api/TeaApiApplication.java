package com.tea.tea.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TeaApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeaApiApplication.class, args);
        System.out.println("✅ TEA API iniciada com sucesso!");
        System.out.println("🌐 URL: http://localhost:8080");
        System.out.println("📋 Endpoints:");
        System.out.println("   GET  http://localhost:8080/api/user");
        System.out.println("   POST http://localhost:8080/api/user");
        System.out.println("   GET  http://localhost:8080/api/user/teste");
        System.out.println("   GET  http://localhost:8080/api/user/diagnose");
        System.out.println("   🔐 ENDPOINTS DE REDEFINIÇÃO:");
        System.out.println("   POST http://localhost:8080/api/auth/forgot-password");
        System.out.println("   POST http://localhost:8080/api/auth/reset-password");
        System.out.println("   GET  http://localhost:8080/api/auth/validate-token");
    }
}