package br.com.apidelocalizacao.service;

import br.com.apidelocalizacao.dto.ClinicaRuaDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClinicaService {

    @Value("${google.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

    public ResponseEntity<?> buscarClinicasProximas(double lat, double lng, int raioEmMetros) {
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("${google.api.key}")) {
            return ResponseEntity.badRequest().body("🔐 API KEY do Google Places não configurada.");
        }

        String location = lat + "," + lng;
        String keyword = "autism clinic";

        String url = BASE_URL +
                "?location=" + location +
                "&radius=" + raioEmMetros +
                "&keyword=" + keyword.replace(" ", "+") +
                "&key=" + apiKey;

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);

        Map<String, Object> body = response.getBody();
        if (body == null || !"OK".equals(body.get("status"))) {
            return ResponseEntity.status(502).body("Erro ao consultar a API do Google: " + (body != null ? body.get("status") : "Sem resposta"));
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> resultados = (List<Map<String, Object>>) body.get("results");

        if (resultados == null || resultados.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        // Filtro por palavras relacionadas ao autismo
        List<String> palavrasChaveAutismo = Arrays.asList(
                "autismo", "tea", "espectro autista", "transtorno do espectro"
        );

        List<ClinicaRuaDTO> clinicasFiltradas = resultados.stream()
                .filter(result -> {
                    String nome = Optional.ofNullable((String) result.get("name")).orElse("").toLowerCase();
                    String rua = Optional.ofNullable((String) result.get("vicinity")).orElse("").toLowerCase();
                    return palavrasChaveAutismo.stream().anyMatch(
                            termo -> nome.contains(termo) || rua.contains(termo)
                    );
                })
                .map(result -> new ClinicaRuaDTO(
                        (String) result.get("name"),
                        (String) result.getOrDefault("vicinity", "Endereço não informado")
                ))
                .collect(Collectors.toList());

        if (clinicasFiltradas.isEmpty()) {
            clinicasFiltradas = resultados.stream()
                    .map(result -> new ClinicaRuaDTO(
                            (String) result.get("name"),
                            (String) result.getOrDefault("vicinity", "Endereço não informado")
                    ))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(clinicasFiltradas);
    }
}