package com.autismo.api_noticias.model;

import java.util.List;

    public class NoticiasResponse {
        private List<NoticiasModel> articles;

        public List<NoticiasModel> getArticles() {
            return articles;
        }

        public void setArticles(List<NoticiasModel> articles) {
            this.articles = articles;
        }
    }


