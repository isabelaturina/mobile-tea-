package com.agenda.eventos.controller;

import com.agenda.eventos.model.Evento;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5500")
@RequestMapping("/eventos")
public class EventoController {

    @Autowired
    private Firestore firestore;

    // Criar um novo evento
    @PostMapping("/criar")
    public ResponseEntity<String> criarEvento(@RequestBody Evento evento) {
        try {
            CollectionReference eventos = firestore.collection("eventos");
            DocumentReference docRef = eventos.document(); // ID automático
            ApiFuture<WriteResult> future = docRef.set(evento);
            return ResponseEntity.ok("Evento criado com ID: " + docRef.getId() +
                    " em: " + future.get().getUpdateTime());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao criar evento: " + e.getMessage());
        }
    }

    // Buscar um evento pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<Evento> buscarEvento(@PathVariable String id) {
        try {
            DocumentReference docRef = firestore.collection("eventos").document(id);
            DocumentSnapshot document = docRef.get().get();
            if (document.exists()) {
                Evento evento = document.toObject(Evento.class);
                evento.setId(document.getId()); // importante para exclusão
                return ResponseEntity.ok(evento);
            } else {
                return ResponseEntity.status(404).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Listar todos os eventos
    @GetMapping
    public ResponseEntity<List<Evento>> listarEventos() {
        try {
            ApiFuture<QuerySnapshot> future = firestore.collection("eventos").get();
            List<Evento> eventos = future.get().getDocuments()
                    .stream()
                    .map(doc -> {
                        Evento e = doc.toObject(Evento.class);
                        e.setId(doc.getId());
                        return e;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(eventos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // Atualizar apenas o campo receberNotificacao
    @PutMapping("/{id}/notificacao")
    public ResponseEntity<String> atualizarNotificacao(@PathVariable String id,
                                                       @RequestParam boolean receber) {
        try {
            DocumentReference docRef = firestore.collection("eventos").document(id);
            DocumentSnapshot document = docRef.get().get();

            if (!document.exists()) {
                return ResponseEntity.status(404).body("Evento não encontrado");
            }

            ApiFuture<WriteResult> writeResult = docRef.update("receberNotificacao", receber);
            return ResponseEntity.ok("Notificação atualizada em: " + writeResult.get().getUpdateTime());

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao atualizar notificação: " + e.getMessage());
        }
    }

    // Excluir um evento pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> excluirEvento(@PathVariable String id) {
        try {
            DocumentReference docRef = firestore.collection("eventos").document(id);
            DocumentSnapshot document = docRef.get().get();

            if (!document.exists()) {
                return ResponseEntity.status(404).body("Evento não encontrado");
            }

            ApiFuture<WriteResult> writeResult = docRef.delete(); // deleta do Firestore
            writeResult.get(); // garante que o delete seja concluído antes de responder
            return ResponseEntity.ok("Evento excluído com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao excluir evento: " + e.getMessage());
        }
    }

    // -----------------------
    // Atualização parcial (editar campos específicos)
    // -----------------------
    @PatchMapping("/{id}")
    public ResponseEntity<String> atualizarCamposEvento(@PathVariable String id,
                                                        @RequestBody Map<String, Object> campos) {
        try {
            DocumentReference docRef = firestore.collection("eventos").document(id);
            DocumentSnapshot document = docRef.get().get();

            if (!document.exists()) {
                return ResponseEntity.status(404).body("Evento não encontrado");
            }

            ApiFuture<WriteResult> writeResult = docRef.update(campos);
            return ResponseEntity.ok("Campos atualizados em: " + writeResult.get().getUpdateTime());

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao atualizar campos: " + e.getMessage());
        }
    }
}
