package com.grupo.chat.service;

import com.grupo.chat.model.ChatMessage;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private static final String COLLECTION_NAME = "chat-mensagens";

    public String salvarMensagem(ChatMessage mensagem) throws ExecutionException, InterruptedException {
        try {
            Firestore db = FirestoreClient.getFirestore();
            mensagem.setTimestamp(System.currentTimeMillis());

            logger.info("Salvando mensagem: {}", mensagem);

            ApiFuture<DocumentReference> result = db.collection(COLLECTION_NAME).add(mensagem);
            String documentId = result.get().getId();

            logger.info("Mensagem salva com ID: {}", documentId);
            return "Mensagem salva com ID: " + documentId;

        } catch (Exception e) {
            logger.error("Erro ao salvar mensagem: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao salvar mensagem no Firebase: " + e.getMessage(), e);
        }
    }

    public List<ChatMessage> listarMensagens() throws ExecutionException, InterruptedException {
        try {
            Firestore db = FirestoreClient.getFirestore();
            ApiFuture<QuerySnapshot> query = db.collection(COLLECTION_NAME)
                    .orderBy("timestamp", Query.Direction.ASCENDING)
                    .get();

            List<ChatMessage> mensagens = query.get().getDocuments().stream()
                    .map(doc -> {
                        ChatMessage msg = doc.toObject(ChatMessage.class);
                        logger.debug("Mensagem recuperada: {}", msg);
                        return msg;
                    })
                    .collect(Collectors.toList());

            logger.info("Total de mensagens recuperadas: {}", mensagens.size());
            return mensagens;

        } catch (Exception e) {
            logger.error("Erro ao listar mensagens: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao recuperar mensagens do Firebase: " + e.getMessage(), e);
        }
    }
}
