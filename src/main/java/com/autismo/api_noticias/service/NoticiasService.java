package com.autismo.api_noticias.service;

import com.autismo.api_noticias.dto.NoticiasDTO;
import com.autismo.api_noticias.model.NoticiasModel;
import com.autismo.api_noticias.model.NoticiasResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticiasService {

    private static final String API_URL = "https://newsapi.org/v2/everything"
            + "?q=(\"transtorno do espectro autista\" OR autismo OR TEA)"
            + " AND NOT (bbb OR celebridade OR namoro OR televisão OR futebol OR nissan OR carro)"
            + "&language=pt"
            + "&sortBy=relevancy"
            + "&in=title"
            + "&apiKey=af48289baae04377a8365ee0f2515922";

    @Autowired
    private RestTemplate restTemplate;

    private List<NoticiasModel> noticiasCache;

    // ⏱️ Atualiza automaticamente a cada 2 dias (172800000 ms)
    @Scheduled(fixedRate = 172800000)
    @Scheduled(fixedRate = 172800000)
    public void atualizarNoticias() {
        NoticiasResponse response = restTemplate.getForObject(API_URL, NoticiasResponse.class);
        if (response != null && response.getArticles() != null) {
            noticiasCache = response.getArticles().stream()
                    .filter(n -> n.getTitle() != null && !n.getTitle().isBlank())
                    .filter(n -> contemPalavrasRelacionadas(n.getTitle(), n.getDescription()))
                    .collect(Collectors.toList());
        }
    }

    private boolean contemPalavrasRelacionadas(String title, String description) {
        String texto = (title + " " + description).toLowerCase();

        return texto.contains("autismo") ||
                texto.contains("transtorno do espectro autista") ||
                texto.contains("tea") ||
                texto.contains("neurodiversidade") ||
                texto.contains("diagnóstico de autismo") ||
                texto.contains("pessoa autista") ||
                texto.contains("intervenção precoce");
    }

    public List<NoticiasDTO> getNoticias() {
        if (noticiasCache == null) {
            atualizarNoticias();
        }

        if (noticiasCache == null) {
            return new ArrayList<>();
        }

        return noticiasCache.stream()
                .map(n -> new NoticiasDTO(
                        n.getTitle(),
                        n.getDescription(),
                        n.getUrl(),
                        n.getUrlToImage(),
                        n.getPublishedAt()
                ))
                .collect(Collectors.toList());
    }
}
