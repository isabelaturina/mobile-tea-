package com.grupo.chat.controller;

import com.grupo.chat.model.ChatMessage;
import com.grupo.chat.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*") // CORS liberado para todas as origens
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // REST - Enviar mensagem
    @PostMapping("/enviar")
    public String enviarMensagem(@RequestBody ChatMessage mensagem) throws ExecutionException, InterruptedException {
        return chatService.salvarMensagem(mensagem);
    }

    // REST - Listar mensagens
    @GetMapping("/mensagens")
    public List<ChatMessage> buscarMensagens() throws ExecutionException, InterruptedException {
        return chatService.listarMensagens();
    }

    // WEBSOCKET - quando alguém envia para /app/sendMessage
    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public ChatMessage enviarMensagemWS(ChatMessage mensagem) throws ExecutionException, InterruptedException {
        chatService.salvarMensagem(mensagem);
        return mensagem;
    }

    // Endpoint de saúde para testar se a API está funcionando
    @GetMapping("/health")
    public String healthCheck() {
        return "API do Chat está funcionando! ✅";
    }
}