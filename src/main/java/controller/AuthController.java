package com.tea.tea.api.controller;

import com.tea.tea.api.model.ForgotPasswordRequest;
import com.tea.tea.api.model.ResetPasswordRequest;
import com.tea.tea.api.service.PasswordResetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final PasswordResetService passwordResetService;

    public AuthController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request)
            throws ExecutionException, InterruptedException {

        System.out.println("🔐 Solicitação de redefinição para: " + request.getEmail());

        boolean success = passwordResetService.requestPasswordReset(request.getEmail());

        if (success) {
            return ResponseEntity.ok().body("{\"message\": \"Email de redefinição enviado com sucesso!\"}");
        } else {
            return ResponseEntity.badRequest().body("{\"error\": \"Email não encontrado ou erro ao enviar email.\"}");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request)
            throws ExecutionException, InterruptedException {

        System.out.println("🔄 Tentativa de redefinição com token: " + request.getToken());

        boolean success = passwordResetService.resetPassword(request.getToken(), request.getNewPassword());

        if (success) {
            return ResponseEntity.ok().body("{\"message\": \"Senha redefinida com sucesso!\"}");
        } else {
            return ResponseEntity.badRequest().body("{\"error\": \"Token inválido, expirado ou erro ao redefinir senha.\"}");
        }
    }

    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestParam String token)
            throws ExecutionException, InterruptedException {

        boolean isValid = passwordResetService.validateToken(token);

        if (isValid) {
            return ResponseEntity.ok().body("{\"valid\": true, \"message\": \"Token válido\"}");
        } else {
            return ResponseEntity.ok().body("{\"valid\": false, \"message\": \"Token inválido ou expirado\"}");
        }
    }

    @GetMapping("/test")
    public String test() {
        return "✅ Auth Controller funcionando!";
    }
}