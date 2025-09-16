package br.com.apidelocalizacao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClinicaRuaDTO {
    private String nome;
    private String rua;
}