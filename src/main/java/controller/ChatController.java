package com.grupo.chat.controller;

import com.grupo.chat.model.ChatMessage;
import com.grupo.chat.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Exemplo genérico, você deve substituir por autenticação real
    private String getLoggedUserName() {
        return "Usuário";
    }

    private String getLoggedUserId() {
        return "1";
    }

    @PostMapping("/enviar")
    public String enviarMensagem(@RequestBody Map<String, String> payload) throws ExecutionException, InterruptedException {
        String texto = payload.get("texto");
        if (texto == null || texto.isBlank()) {
            return "Mensagem vazia";
        }

        ChatMessage mensagem = new ChatMessage();
        mensagem.setTexto(texto);
        mensagem.setUsuario(getLoggedUserName());
        mensagem.setUserId(getLoggedUserId());
        mensagem.setTimestamp(System.currentTimeMillis());

        return chatService.salvarMensagem(mensagem);
    }

    @GetMapping("/mensagens")
    public List<ChatMessage> buscarMensagens() throws ExecutionException, InterruptedException {
        return chatService.listarMensagens();
    }
}
