@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {
    private String usuario;
    private String userId;  // NOVO campo para id do usuário
    private String texto;
    private long timestamp;
}
