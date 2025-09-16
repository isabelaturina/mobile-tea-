package br.com.apidelocalizacao.controller;

import br.com.apidelocalizacao.service.ClinicaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/clinicas")
public class ClinicaController {

    private final ClinicaService clinicaService;

    @Autowired
    public ClinicaController(ClinicaService clinicaService) { this.clinicaService = clinicaService; }

    @GetMapping("/proximas")
    public ResponseEntity<?> buscarClinicasProximas(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10000") int raioEmMetros )
    {
        try {
            return ResponseEntity.status(200).body(clinicaService.buscarClinicasProximas(lat, lng, raioEmMetros));
        } catch(Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

}