import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function NovaSenha() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSavePassword = () => {
    if (!newPassword) {
      Alert.alert("Erro", "Por favor, digite a nova senha");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Erro", "A nova senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    Alert.alert(
      "Sucesso!", 
      "Sua senha foi alterada com sucesso!",
      [
        {
          text: "OK",
          onPress: () => router.push('/(tabs)/Profile')
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Botão de Voltar com a seta */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Image
            source={require("../assets/images/seta.png")} // Certifique-se de que a seta está no diretório correto
            style={styles.backImage}
            resizeMode="contain"
          />
        </Pressable>

        {/* Imagem "New Password" */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/new-password.png")} // Certifique-se de que a imagem está no diretório correto
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Título */}
        <Text style={styles.title}>Nova Senha</Text>

        {/* Descrição */}
        <Text style={styles.description}>
          Por favor, escreva sua nova senha.
        </Text>

        {/* Campo de Nova Senha */}
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Digite a nova senha"
          placeholderTextColor="#999"
        />

        {/* Campo de Confirmação da Senha */}
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirme a nova senha"
          placeholderTextColor="#999"
        />

        {/* Botão de Confirmar Código */}
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={handleSavePassword}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#1163E7", "#1163E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Confirmar Código</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  innerContainer: {
    flexGrow: 1,
    paddingTop: 40,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    top: 40,
  },
  backImage: {
    width: 20,
    height: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  image: {
     width: 300,
    height: 250,
   
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    bottom: 30,
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    color: "#575757",
    bottom: 20,
    fontWeight : "500"
  },
input: {
borderRadius: 15,
  borderWidth: 2,
  borderColor: "#A2AFBC", 
  paddingVertical: 15,
  paddingHorizontal: 15,
  fontSize: 16,
  marginBottom: 30,

},

  buttonWrapper: {
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center",
    width: "70%",
    marginTop: 30,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  button: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 17,
  },
});
