package com.autismo.api_noticias.dto;

public class NoticiasDTO {
    private String titulo;
    private String descricao;
    private String link;
    private String imagem;
    private String dataPublicacao;

    public NoticiasDTO(String titulo, String descricao, String link, String imagem, String dataPublicacao) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.link = link;
        this.imagem = imagem;
        this.dataPublicacao = dataPublicacao;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public String getDataPublicacao() {
        return dataPublicacao;
    }

    public void setDataPublicacao(String dataPublicacao) {
        this.dataPublicacao = dataPublicacao;
    }
}
