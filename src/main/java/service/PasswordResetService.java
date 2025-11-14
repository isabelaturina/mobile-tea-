package com.tea.tea.api.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.tea.tea.api.model.User;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class PasswordResetService {

    private static final String TOKEN_COLLECTION = "password_reset_tokens";
    private final EmailService emailService;
    private final UserService userService;

    public PasswordResetService(EmailService emailService, UserService userService) {
        this.emailService = emailService;
        this.userService = userService;
    }

    public boolean requestPasswordReset(String email) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        // Verifica se o usuário existe
        User user = userService.getUserByEmail(email);
        if (user == null) {
            System.out.println("❌ Usuário não encontrado: " + email);
            return false;
        }

        // Invalida tokens anteriores
        invalidatePreviousTokens(email);

        // Gera novo token
        String token = generateToken();
        Date expiresAt = new Date(System.currentTimeMillis() + 3600000); // 1 hora

        // Salva token no Firestore
        DocumentReference docRef = db.collection(TOKEN_COLLECTION).document();
        Map<String, Object> tokenData = new HashMap<>();
        tokenData.put("email", email);
        tokenData.put("token", token);
        tokenData.put("expiresAt", expiresAt);
        tokenData.put("used", false);
        tokenData.put("createdAt", FieldValue.serverTimestamp());

        ApiFuture<WriteResult> result = docRef.set(tokenData);
        result.get();

        System.out.println("🔐 Token de 4 dígitos gerado para: " + email);

        // Envia email (modo teste)
        try {
            emailService.sendPasswordResetEmail(email, user.getNome(), token);
            return true;
        } catch (Exception e) {
            System.err.println("❌ Erro ao enviar email: " + e.getMessage());
            return false;
        }
    }

    public boolean resetPassword(String token, String newPassword) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        // Busca token válido
        Query query = db.collection(TOKEN_COLLECTION)
                .whereEqualTo("token", token)
                .whereEqualTo("used", false);

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        if (documents.isEmpty()) {
            System.out.println("❌ Token não encontrado ou já usado: " + token);
            return false;
        }

        QueryDocumentSnapshot tokenDoc = documents.get(0);
        String email = tokenDoc.getString("email");
        Date expiresAt = tokenDoc.getDate("expiresAt");

        // Verifica expiração
        if (expiresAt.before(new Date())) {
            System.out.println("❌ Token expirado: " + token);
            return false;
        }

        // Atualiza senha do usuário usando o método updateUserPassword
        boolean success = userService.updateUserPassword(email, newPassword);

        if (!success) {
            System.out.println("❌ Erro ao atualizar senha para: " + email);
            return false;
        }

        // Marca token como usado
        Map<String, Object> updates = new HashMap<>();
        updates.put("used", true);
        db.collection(TOKEN_COLLECTION).document(tokenDoc.getId()).update(updates);

        System.out.println("✅ Senha redefinida para: " + email);
        return true;
    }

    public boolean validateToken(String token) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        Query query = db.collection(TOKEN_COLLECTION)
                .whereEqualTo("token", token)
                .whereEqualTo("used", false);

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        if (documents.isEmpty()) {
            return false;
        }

        Date expiresAt = documents.get(0).getDate("expiresAt");
        return !expiresAt.before(new Date());
    }

    private String generateToken() {
        // ✅ Gera token de 4 números (0000-9999)
        Random random = new Random();
        int tokenNumber = random.nextInt(10000); // Gera de 0 a 9999
        return String.format("%04d", tokenNumber); // Sempre 4 dígitos com zeros à esquerda
    }

    private void invalidatePreviousTokens(String email) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        Query query = db.collection(TOKEN_COLLECTION)
                .whereEqualTo("email", email)
                .whereEqualTo("used", false);

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        for (QueryDocumentSnapshot doc : documents) {
            Map<String, Object> updates = new HashMap<>();
            updates.put("used", true);
            db.collection(TOKEN_COLLECTION).document(doc.getId()).update(updates);
        }
    }

    // Limpa tokens expirados a cada hora
    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredTokens() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Date oneHourAgo = new Date(System.currentTimeMillis() - 3600000);

        Query query = db.collection(TOKEN_COLLECTION)
                .whereLessThan("expiresAt", oneHourAgo);

        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        for (QueryDocumentSnapshot doc : documents) {
            db.collection(TOKEN_COLLECTION).document(doc.getId()).delete();
            System.out.println("🧹 Token expirado removido: " + doc.getId());
        }
    }
}