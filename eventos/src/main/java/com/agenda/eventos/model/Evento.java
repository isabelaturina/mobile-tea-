package com.agenda.eventos.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Evento {
    private String id;
    private String titulo;
    private String descricao;
    private int ano;
    private int mes;
    private int dia;
    private String hora;
    private String usuarioId;

    private boolean receberNotificacao; // <-- novo campo
}

