package com.grupo.chat.controller;

import com.grupo.chat.model.ChatMessage;
import com.grupo.chat.service.ChatService;
import com.grupo.chat.service.ModerationService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;

@Controller
public class WebsocketChatController { // 🟢 MUDOU AQUI - "Websocket" sem o "S" maiúsculo

    private static final Logger logger = LoggerFactory.getLogger(WebsocketChatController.class);

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ModerationService moderationService;

    public WebsocketChatController(ChatService chatService,
                                   SimpMessagingTemplate messagingTemplate,
                                   ModerationService moderationService) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
        this.moderationService = moderationService;
    }

    @MessageMapping("/chat")
    public void enviarViaWebSocket(ChatMessage message) {
        logger.info("📨 Recebendo mensagem via WebSocket: {} - {}", message.getUsuario(), message.getTexto());

        // Verificar moderação ANTES de qualquer coisa
        ModerationService.ModerationResult resultado = moderationService.verificarMensagem(message.getTexto());

        if (!resultado.isAprovada()) {
            // 🚫 MENSAGEM BLOQUEADA - NÃO SALVAR E NÃO ENVIAR PARA O TÓPICO
            logger.warn("🚫 MENSAGEM BLOQUEADA: Usuário: {}, Mensagem: {}", message.getUsuario(), message.getTexto());

            // Enviar mensagem de erro apenas para o usuário que enviou
            ChatMessage mensagemErro = new ChatMessage();
            mensagemErro.setUsuario("Sistema");
            mensagemErro.setUserId("system");
            mensagemErro.setTexto(resultado.getMensagemErro());
            mensagemErro.setTimestamp(System.currentTimeMillis());

            // Enviar erro apenas para o usuário ofensor
            messagingTemplate.convertAndSendToUser(
                    message.getUserId(),
                    "/queue/errors",
                    mensagemErro
            );

            logger.info("📤 Enviada mensagem de erro para o usuário: {}", message.getUserId());
            return; // 🚨 IMPORTANTE: SAIR DA FUNÇÃO SEM ENVIAR A MENSAGEM OFENSIVA
        }

        // ✅ MENSAGEM APROVADA - Salvar e enviar para todos
        try {
            // Salvar no Firebase
            chatService.salvarMensagem(message);
            logger.info("💾 Mensagem salva no Firebase: {}", message.getTexto());

            // Enviar para todos os usuários no tópico
            messagingTemplate.convertAndSend("/topic/mensagens", message);
            logger.info("📢 Mensagem enviada para /topic/mensagens: {}", message.getTexto());

        } catch (Exception e) {
            logger.error("❌ Erro ao processar mensagem: {}", e.getMessage(), e);

            // Enviar mensagem de erro para o usuário
            ChatMessage mensagemErro = new ChatMessage();
            mensagemErro.setUsuario("Sistema");
            mensagemErro.setUserId("system");
            mensagemErro.setTexto("❌ Erro ao enviar mensagem. Tente novamente.");
            mensagemErro.setTimestamp(System.currentTimeMillis());

            messagingTemplate.convertAndSendToUser(
                    message.getUserId(),
                    "/queue/errors",
                    mensagemErro
            );
        }
    }
}