package com.tea.tea.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class EmailService {

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    public void sendPasswordResetEmail(String toEmail, String toName, String token) {
        String resetLink = baseUrl + "/api/auth/reset-password?token=" + token;

        // MODO TESTE - só mostra no console
        System.out.println("=".repeat(70));
        System.out.println("🎯 EMAIL DE REDEFINIÇÃO - MODO TESTE 🎯");
        System.out.println("=".repeat(70));
        System.out.println("📧 Para: " + toEmail);
        System.out.println("👤 Nome: " + toName);
        System.out.println("🔐 TOKEN DE 4 DÍGITOS: " + token);
        System.out.println("🌐 Link direto: " + resetLink);
        System.out.println("⏰ Expira em: 1 hora");
        System.out.println("=".repeat(70));
        System.out.println("💡 COPIAR PARA TESTE NO FRONTEND:");
        System.out.println("Token: " + token);
        System.out.println("=".repeat(70));
    }
}