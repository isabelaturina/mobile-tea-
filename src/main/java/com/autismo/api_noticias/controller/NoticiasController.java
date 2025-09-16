package com.autismo.api_noticias.controller;

import com.autismo.api_noticias.dto.NoticiasDTO;
import com.autismo.api_noticias.model.NoticiasModel;
import com.autismo.api_noticias.service.NoticiasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/noticias")
public class NoticiasController {

    @Autowired
    private NoticiasService noticiasService;

    @GetMapping
    public List<NoticiasDTO> getNoticias() {
        return noticiasService.getNoticias();
    }
}
