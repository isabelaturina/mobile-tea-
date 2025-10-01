package com.grupo.chat.controller;

import com.grupo.chat.model.ChatMessage;
import com.grupo.chat.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
class WebSocketChatController {

    private final ChatService chatService;

    public WebSocketChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat")  // O endpoint que o front usa para enviar ("/app/chat")
    @SendTo("/topic/mensagens") // O tópico que os clientes estão inscritos para receber mensagens
    public ChatMessage enviarViaWebSocket(ChatMessage message) throws Exception {
        // Salvar a mensagem no banco Firebase
        chatService.salvarMensagem(message);
        // Retorna a mensagem para ser enviada a todos os inscritos
        return message;
    }
}
