import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  
  return (
    
    <View style={styles.container}>
    
      <Text style={styles.title}>Voltar</Text>

      <Text style={styles.label}>Senha atual</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <Text style={styles.label}>Nova senha</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      {newPassword.length > 0 && newPassword.length < 8 && (
        <Text style={styles.error}>Minimo 8 caracteres</Text>
      )}

      <Text style={styles.label}>Confirme a nova senha</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Text style={styles.forgot}>Esqueceu sua senha?</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Salvar Informações</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    

  },
  back: {
    fontSize: 14,
    color: "#000",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 150,
  },
  label: {
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 13,
    marginBottom: 10,
    
  },
  error: {
    fontSize: 12,
    color: "red",
    marginBottom: 10,
  },
  forgot: {
    fontSize: 14,
    color: "blue",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "linear-gradient(90deg, #00C6FF, #1163E7)", // depois ajusto esse gradiente
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#ff0000ff",
    fontWeight: "bold",
    fontSize: 16,
   
  },
});
{
  }

