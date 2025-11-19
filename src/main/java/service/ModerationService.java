package com.grupo.chat.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class ModerationService {

    private static final Logger logger = LoggerFactory.getLogger(ModerationService.class);

    private final List<String> palavroes = Arrays.asList(
            "caralho", "porra", "merda", "foda", "puta", "viado", "buceta",
            "cu", "pau", "cacete", "corno", "otario", "idiota", "imbecil", "burro",
            "vai se foder", "vai tomar no cu", "vai pra puta que pariu",
            "seu merda", "sua puta", "sua vagabunda", "filho da puta", "fdp",
            "arrombado", "bosta", "cretino", "desgraça", "escroto", "lixo", "mongol",
            "retardado", "estupido", "palerma", "panaca", "troxa", "jumento"
    );

    private final List<String> ameacas = Arrays.asList(
            "vou te matar", "vou te bater", "vou acabar com você", "te mato",
            "te quebro", "vou te dar uma surra", "vou acabar com sua vida",
            "suicídio", "me matar", "me mato", "vou me matar", "morre", "morra",
            "quero que você morra", "vou te matar", "te exterminar", "te destruir",
            "vou te foder", "te arrebento", "te acabo", "vou acabar com vc"
    );

    public ModerationResult verificarMensagem(String texto) {
        if (texto == null || texto.isBlank()) {
            return new ModerationResult(true, "");
        }

        String textoLower = texto.toLowerCase().trim();

        logger.info("🔍 Verificando mensagem: {}", textoLower);

        // Verificar palavrões
        for (String palavra : palavroes) {
            if (textoLower.contains(palavra.toLowerCase())) {
                String mensagemRepreensao = "🚫 MENSAGEM BLOQUEADA!\n" +
                        "Conteúdo ofensivo detectado: \"" + palavra + "\"\n" +
                        "Por favor, mantenha o respeito no chat.";
                logger.warn("❌ Palavrão detectado: {}", palavra);
                return new ModerationResult(false, mensagemRepreensao);
            }
        }

        // Verificar ameaças
        for (String ameaca : ameacas) {
            if (textoLower.contains(ameaca.toLowerCase())) {
                String mensagemRepreensao = "🚫 MENSAGEM BLOQUEADA!\n" +
                        "Ameaça detectada: \"" + ameaca + "\"\n" +
                        "Comportamento ofensivo não será tolerado!";
                logger.warn("❌ Ameaça detectada: {}", ameaca);
                return new ModerationResult(false, mensagemRepreensao);
            }
        }

        // Verificar padrões de ameaça com regex
        if (contemPadraoAmeaca(textoLower)) {
            String mensagemRepreensao = "🚫 MENSAGEM BLOQUEADA!\n" +
                    "Conteúdo inapropriado detectado.\n" +
                    "Respeite os outros usuários do chat.";
            logger.warn("❌ Padrão de ameaça detectado");
            return new ModerationResult(false, mensagemRepreensao);
        }

        logger.info("✅ Mensagem aprovada: {}", textoLower);
        return new ModerationResult(true, "");
    }

    private boolean contemPadraoAmeaca(String texto) {
        // Padrões regex para detectar ameaças
        Pattern[] padroesAmeaca = {
                Pattern.compile("vou\\s+(te|você)\\s+(matar|bater|espancar|agredir)"),
                Pattern.compile("(te|você)\\s+(mato|bato|acabo)"),
                Pattern.compile("quero\\s+(te|você)\\s+(morto|morto)"),
                Pattern.compile("(vou|irei)\\s+(acabar\\s+com|destruir)\\s+(vc|você|te)"),
                Pattern.compile("(morra|morre)\\s+(vc|você|te)"),
                Pattern.compile("(quero|espero)\\s+que\\s+(vc|você|te)\\s+(morra|morre)"),
                Pattern.compile("vou\\s+te\\s+(foder|arrebentar)")
        };

        for (Pattern padrao : padroesAmeaca) {
            if (padrao.matcher(texto).find()) {
                logger.warn("❌ Padrão de ameaça detectado com regex: {}", padrao.pattern());
                return true;
            }
        }
        return false;
    }

    public static class ModerationResult {
        private final boolean aprovada;
        private final String mensagemErro;

        public ModerationResult(boolean aprovada, String mensagemErro) {
            this.aprovada = aprovada;
            this.mensagemErro = mensagemErro;
        }

        public boolean isAprovada() {
            return aprovada;
        }

        public String getMensagemErro() {
            return mensagemErro;
        }
    }
}