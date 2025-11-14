package com.tea.tea.api.model;

import java.util.Date;

public class PasswordResetToken {
    private String id;
    private String email;
    private String token;
    private Date expiresAt;
    private boolean used;
    private Date createdAt;

    public PasswordResetToken() {}

    public PasswordResetToken(String email, String token, Date expiresAt) {
        this.email = email;
        this.token = token;
        this.expiresAt = expiresAt;
        this.used = false;
    }

    // Getters e Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Date getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Date expiresAt) { this.expiresAt = expiresAt; }

    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public boolean isExpired() {
        return new Date().after(expiresAt);
    }
}