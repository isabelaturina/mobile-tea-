package com.tea.tea.api.model;

import com.google.cloud.firestore.annotation.PropertyName;

public class User {
    private Long id;

    @PropertyName("nome")
    private String nome;

    @PropertyName("email")
    private String email;

    @PropertyName("senha")
    private String senha;

    @PropertyName("nivelSuporte")
    private String nivelSuporte;

    // Construtor vazio (OBRIGATÓRIO para o Firestore)
    public User() {}

    // Construtor completo
    public User(Long id, String nome, String email, String senha, String nivelSuporte) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.nivelSuporte = nivelSuporte;
    }

    // Construtor sem ID (útil para criação)
    public User(String nome, String email, String senha, String nivelSuporte) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.nivelSuporte = nivelSuporte;
    }

    // Getters e Setters
    public Long getId() { return id; }

    // ✅ Setter robusto para ID que aceita múltiplos tipos
    public void setId(Object id) {
        if (id instanceof Long) {
            this.id = (Long) id;
        } else if (id instanceof String) {
            try {
                this.id = Long.parseLong((String) id);
            } catch (NumberFormatException e) {
                System.err.println("⚠️  ID string não convertível para Long: " + id);
                this.id = null;
            }
        } else if (id instanceof Integer) {
            this.id = ((Integer) id).longValue();
        } else if (id == null) {
            this.id = null;
        } else {
            System.err.println("⚠️  Tipo de ID não suportado: " + id.getClass().getSimpleName());
            this.id = null;
        }
    }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getNivelSuporte() { return nivelSuporte; }
    public void setNivelSuporte(String nivelSuporte) { this.nivelSuporte = nivelSuporte; }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", nome='" + nome + '\'' +
                ", email='" + email + '\'' +
                ", senha='" + senha + '\'' +
                ", nivelSuporte='" + nivelSuporte + '\'' +
                '}';
    }
}