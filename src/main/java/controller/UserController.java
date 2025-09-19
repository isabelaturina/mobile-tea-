package com.tea.tea.api.controller;

import com.tea.tea.api.model.User;
import com.tea.tea.api.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User createUser(@RequestBody User user) throws ExecutionException, InterruptedException {
        return userService.saveUser(user);
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) throws ExecutionException, InterruptedException {
        return userService.getUserById(id);
    }

    @GetMapping
    public List<User> getAllUsers() throws ExecutionException, InterruptedException {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) throws ExecutionException, InterruptedException {
        user.setId(id);
        return userService.updateUser(user);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) throws ExecutionException, InterruptedException {
        return userService.deleteUser(id);
    }

    // ✅ MÉTODO DE TESTE
    @GetMapping("/teste")
    public String teste() {
        return "✅ API TEA+ FUNCIONANDO! " + new java.util.Date();
    }

    // ✅ MÉTODO DE SAUDAÇÃO
    @GetMapping("/hello")
    public String hello() {
        return "👋 Olá! API TEA+ está no ar!";
    }

    // 🔍 MÉTODO DE DIAGNÓSTICO
    @GetMapping("/diagnose")
    public String diagnose() throws ExecutionException, InterruptedException {
        userService.diagnoseUsers();
        return "Diagnóstico completo! Verifique os logs do console.";
    }

    // 🔄 MÉTODO DE MIGRAÇÃO
    @GetMapping("/migrate")
    public String migrate() throws ExecutionException, InterruptedException {
        userService.migrateExistingUsers();
        return "Migração de dados completa! Verifique os logs.";
    }

    // 🔍 BUSCAR POR EMAIL
    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) throws ExecutionException, InterruptedException {
        return userService.getUserByEmail(email);
    }
}