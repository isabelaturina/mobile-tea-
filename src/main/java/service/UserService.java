package com.tea.tea.api.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.tea.tea.api.model.User;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class UserService {

    private static final String COLLECTION_NAME = "user";
    private static final String SEQUENCE_DOC = "user_sequence";

    // 🔢 Método para obter o próximo ID sequencial
    private Long getNextUserId() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference seqRef = db.collection("counters").document(SEQUENCE_DOC);

        // Usando transação para garantir atomicidade
        ApiFuture<Long> future = db.runTransaction(transaction -> {
            DocumentSnapshot snapshot = transaction.get(seqRef).get();
            Long currentId = 1L;

            if (snapshot.exists() && snapshot.contains("lastId")) {
                currentId = snapshot.getLong("lastId") + 1;
            }

            transaction.set(seqRef, Collections.singletonMap("lastId", currentId));
            return currentId;
        });

        return future.get();
    }

    public User saveUser(User user) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        // 🔢 Gera o próximo ID sequencial
        Long nextId = getNextUserId();
        user.setId(nextId);

        System.out.println("💾 Salvando usuário: " + user.getNome());
        System.out.println("🆔 ID: " + nextId);
        System.out.println("📧 Email: " + user.getEmail());
        System.out.println("🛡️ NivelSuporte: " + user.getNivelSuporte());

        // Salva com ID numérico como documento ID
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(String.valueOf(nextId));

        // Cria mapa de dados sem o campo ID interno para evitar duplicação
        Map<String, Object> userData = new HashMap<>();
        userData.put("nome", user.getNome());
        userData.put("email", user.getEmail());
        userData.put("senha", user.getSenha());
        userData.put("nivelSuporte", user.getNivelSuporte());

        ApiFuture<WriteResult> result = docRef.set(userData);
        result.get(); // Espera a operação completar

        return user;
    }

    public User getUserById(Long id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(String.valueOf(id));
        DocumentSnapshot snapshot = docRef.get().get();

        if (snapshot.exists()) {
            User user = new User();
            user.setId(id); // Usa o ID do documento
            user.setNome(snapshot.getString("nome"));
            user.setEmail(snapshot.getString("email"));
            user.setSenha(snapshot.getString("senha"));
            user.setNivelSuporte(snapshot.getString("nivelSuporte"));

            System.out.println("✅ Usuário recuperado: " + user.getNome() + " (ID: " + id + ")");
            return user;
        }
        System.out.println("❌ Usuário não encontrado com ID: " + id);
        return null;
    }

    public List<User> getAllUsers() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        List<User> users = new ArrayList<>();
        for (QueryDocumentSnapshot document : documents) {
            try {
                User user = new User();
                user.setId(document.getId()); // Usa o setter robusto
                user.setNome(document.getString("nome"));
                user.setEmail(document.getString("email"));
                user.setSenha(document.getString("senha"));
                user.setNivelSuporte(document.getString("nivelSuporte"));

                users.add(user);
                System.out.println("📋 Usuário listado: " + user.getNome() + " (ID: " + user.getId() + ")");

            } catch (Exception e) {
                System.err.println("❌ Erro ao processar documento " + document.getId() + ": " + e.getMessage());
            }
        }
        return users;
    }

    public User updateUser(User user) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        System.out.println("🔄 Atualizando usuário ID: " + user.getId());

        // Cria mapa de dados sem o campo ID interno
        Map<String, Object> userData = new HashMap<>();
        userData.put("nome", user.getNome());
        userData.put("email", user.getEmail());
        userData.put("senha", user.getSenha());
        userData.put("nivelSuporte", user.getNivelSuporte());

        ApiFuture<WriteResult> result = db.collection(COLLECTION_NAME)
                .document(String.valueOf(user.getId()))
                .set(userData);

        WriteResult writeResult = result.get();
        System.out.println("✅ Usuário atualizado em: " + writeResult.getUpdateTime().toDate());
        return user;
    }

    public String deleteUser(Long id) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        // Verifica se o usuário existe antes de deletar
        DocumentReference docRef = db.collection(COLLECTION_NAME).document(String.valueOf(id));
        DocumentSnapshot snapshot = docRef.get().get();

        if (!snapshot.exists()) {
            System.out.println("❌ Não foi possível deletar - usuário não encontrado ID: " + id);
            return "Usuário não encontrado com ID: " + id;
        }

        ApiFuture<WriteResult> result = docRef.delete();
        result.get();
        System.out.println("🗑️ Usuário deletado ID: " + id);
        return "Usuário deletado com ID: " + id;
    }

    // 🔍 Método adicional para buscar usuário por email
    public User getUserByEmail(String email) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        Query query = db.collection(COLLECTION_NAME).whereEqualTo("email", email);
        ApiFuture<QuerySnapshot> future = query.get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        if (!documents.isEmpty()) {
            QueryDocumentSnapshot document = documents.get(0);
            User user = new User();
            user.setId(document.getId());
            user.setNome(document.getString("nome"));
            user.setEmail(document.getString("email"));
            user.setSenha(document.getString("senha"));
            user.setNivelSuporte(document.getString("nivelSuporte"));

            System.out.println("✅ Usuário encontrado por email: " + user.getNome());
            return user;
        }
        System.out.println("❌ Usuário não encontrado com email: " + email);
        return null;
    }

    // 🔍 Método de diagnóstico
    public void diagnoseUsers() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        System.out.println("🔍 Diagnóstico dos documentos:");
        System.out.println("Total de documentos: " + documents.size());

        for (QueryDocumentSnapshot document : documents) {
            System.out.println("--- Documento ID: " + document.getId() + " ---");
            System.out.println("Tipo do ID: " + document.getId().getClass().getSimpleName());
            System.out.println("Dados: " + document.getData());

            // Verifica campo 'id' interno se existir
            if (document.contains("id")) {
                Object idField = document.get("id");
                System.out.println("Campo 'id' interno: " + idField + " (Tipo: " +
                        (idField != null ? idField.getClass().getSimpleName() : "null") + ")");
            }
            System.out.println();
        }
    }

    // 🔄 Método para migrar dados existentes
    public void migrateExistingUsers() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        int migrated = 0;
        for (QueryDocumentSnapshot document : documents) {
            Map<String, Object> data = document.getData();

            // Remove campo 'id' interno se existir (para evitar duplicação)
            if (data.containsKey("id")) {
                data.remove("id");
                db.collection(COLLECTION_NAME)
                        .document(document.getId())
                        .set(data)
                        .get();
                migrated++;
                System.out.println("🔄 Documento " + document.getId() + " migrado");
            }
        }
        System.out.println("✅ Migração completa: " + migrated + " documentos migrados");
    }

    // ✅ MÉTODO NOVO PARA ATUALIZAR APENAS A SENHA (ADICIONE ESTE!)
    public boolean updateUserPassword(String email, String newPassword) throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();

        // Busca usuário por email
        User user = getUserByEmail(email);
        if (user == null) {
            System.out.println("❌ Usuário não encontrado: " + email);
            return false;
        }

        // ✅ ATUALIZA APENAS A SENHA (não cria novo usuário)
        Map<String, Object> updates = new HashMap<>();
        updates.put("senha", newPassword);

        try {
            ApiFuture<WriteResult> result = db.collection(COLLECTION_NAME)
                    .document(String.valueOf(user.getId()))
                    .update(updates); // ✅ USA UPDATE (não SET)

            result.get(); // Espera a operação completar

            user.setSenha(newPassword);
            System.out.println("✅ Senha atualizada para usuário: " + email);
            return true;
        } catch (Exception e) {
            System.err.println("❌ Erro ao atualizar senha: " + e.getMessage());
            return false;
        }
    }
}