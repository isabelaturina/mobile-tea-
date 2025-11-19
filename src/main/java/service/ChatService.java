package com.grupo.chat.service;

import com.grupo.chat.model.ChatMessage;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
    private static final String COLLECTION_NAME = "chat-mensagens";

    private final ModerationService moderationService;

    public ChatService(ModerationService moderationService) {
        this.moderationService = moderationService;
    }

    public String salvarMensagem(ChatMessage mensagem) throws ExecutionException, InterruptedException {
        // Verificar moderação ANTES de salvar (redundância para segurança)
        ModerationService.ModerationResult resultado = moderationService.verificarMensagem(mensagem.getTexto());

        if (!resultado.isAprovada()) {
            logger.error("🚫 TENTATIVA DE SALVAR MENSAGEM BLOQUEADA: {}", mensagem.getTexto());
            throw new SecurityException(resultado.getMensagemErro());
        }

        Firestore db = FirestoreClient.getFirestore();
        mensagem.setTimestamp(System.currentTimeMillis());

        logger.info("💾 Salvando mensagem no Firebase: {}", mensagem.getTexto());

        ApiFuture<DocumentReference> result = db.collection(COLLECTION_NAME).add(mensagem);
        String documentId = result.get().getId();

        logger.info("✅ Mensagem salva com ID: {}", documentId);
        return "Mensagem salva com ID: " + documentId;
    }

    public List<ChatMessage> listarMensagens() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> query = db.collection(COLLECTION_NAME)
                .orderBy("timestamp", Query.Direction.ASCENDING)
                .get();

        List<ChatMessage> mensagens = query.get().getDocuments().stream()
                .map(doc -> doc.toObject(ChatMessage.class))
                .collect(Collectors.toList());

        logger.info("Total de mensagens recuperadas: {}", mensagens.size());
        return mensagens;
    }

    @Scheduled(fixedRate = 3600000) // roda a cada 1 hora
    public void apagarMensagensAntigas() throws ExecutionException, InterruptedException {
        Firestore db = FirestoreClient.getFirestore();
        long limite = System.currentTimeMillis() - 24 * 60 * 60 * 1000; // 24h atrás

        ApiFuture<QuerySnapshot> query = db.collection(COLLECTION_NAME)
                .whereLessThan("timestamp", limite)
                .get();

        List<QueryDocumentSnapshot> documentosAntigos = query.get().getDocuments();
        logger.info("Encontradas {} mensagens para apagar", documentosAntigos.size());

        for (QueryDocumentSnapshot doc : documentosAntigos) {
            db.collection(COLLECTION_NAME).document(doc.getId()).delete();
            logger.info("Mensagem com ID {} apagada", doc.getId());
        }
    }
}