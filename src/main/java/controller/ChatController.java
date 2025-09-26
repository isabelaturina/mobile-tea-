@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    // Simula usuário logado, na prática você pega da sessão ou token
    private String getLoggedUserName() {
        return "Guizola";  // Troque aqui pela lógica real de autenticação
    }

    private String getLoggedUserId() {
        return "1"; // Id fixo para teste, pode ser int ou string
    }

    // REST - Enviar mensagem (recebe só o texto)
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

    // REST - Listar mensagens
    @GetMapping("/mensagens")
    public List<ChatMessage> buscarMensagens() throws ExecutionException, InterruptedException {
        return chatService.listarMensagens();
    }

    // ... o resto do controller continua igual
}
