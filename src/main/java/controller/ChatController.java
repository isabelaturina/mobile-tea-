package com.grupo.chat.controller;

import com.grupo.chat.model.ChatMessage;
import com.grupo.chat.service.ChatService;
import com.grupo.chat.service.ModerationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;
    private final ModerationService moderationService;

    public ChatController(ChatService chatService, ModerationService moderationService) {
        this.chatService = chatService;
        this.moderationService = moderationService;
    }

    // Exemplo genérico, você deve substituir por autenticação real
    private String getLoggedUserName() {
        return "Usuário";
    }

    private String getLoggedUserId() {
        return "1";
    }

    @PostMapping("/enviar")
    public ResponseEntity<?> enviarMensagem(@RequestBody Map<String, String> payload) throws ExecutionException, InterruptedException {
        String texto = payload.get("texto");
        if (texto == null || texto.isBlank()) {
            return ResponseEntity.badRequest().body("Mensagem vazia");
        }

        // Verificar moderação
        ModerationService.ModerationResult resultado = moderationService.verificarMensagem(texto);
        if (!resultado.isAprovada()) {
            return ResponseEntity.badRequest().body(resultado.getMensagemErro());
        }

        ChatMessage mensagem = new ChatMessage();
        mensagem.setTexto(texto);
        mensagem.setUsuario(getLoggedUserName());
        mensagem.setUserId(getLoggedUserId());
        mensagem.setTimestamp(System.currentTimeMillis());

        String resultadoSalvamento = chatService.salvarMensagem(mensagem);
        return ResponseEntity.ok(resultadoSalvamento);
    }

    @GetMapping("/mensagens")
    public List<ChatMessage> buscarMensagens() throws ExecutionException, InterruptedException {
        return chatService.listarMensagens();
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "✅ Chat está funcionando!";
    }
}