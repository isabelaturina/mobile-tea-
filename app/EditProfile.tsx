import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";

// Ícones de avatar
const profileIcons = [
  require("../assets/images/gato-icon.png"),
  require("../assets/images/panda-icon.png"),
  require("../assets/images/servo-icon.png"),
  require("../assets/images/raposinha-icon.png"),
  require("../assets/images/whitegirl-icon.png"),
  require("../assets/images/blackgirl-icon.png"),
  require("../assets/images/whiteboy-icon.png"),
  require("../assets/images/blackboy-icon.png"),
];

// ⚠️ Substitua pelo IP local do seu computador, se estiver testando em celular físico
const API_URL = "http://localhost:8080/api/user";

export default function EditProfile() {
  const router = useRouter();

  // Estado dos dados
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // preenchido automaticamente se possível
  const [autismLevel, setAutismLevel] = useState("");
  const [userId, setUserId] = useState(null);

  // ⚠️ Simulação: substitua por onde você estiver guardando o e-mail do usuário logado
  const loggedEmail = "teste@email.com";

  // Carrega os dados do usuário com base no e-mail
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_URL}/email/${loggedEmail}`);
        const data = await res.json();

        if (data) {
          setUserId(data.id);
          setName(data.nome);
          setEmail(data.email);
          setAutismLevel(data.nivelSuporte || "");
        } else {
          console.warn("Usuário não encontrado.");
        }
      } catch (err) {
        console.error("Erro ao buscar dados do usuário:", err);
      }
    };

    fetchUserData();
  }, []);

  // Salvar alterações
  const handleSave = async () => {
    if (!userId) {
      Alert.alert("Erro", "ID do usuário não encontrado.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: name,
          email: email,
          senha: "123456", // ⚠️ Placeholder — você pode ignorar ou esconder isso
          nivelSuporte: autismLevel,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log("✅ Usuário atualizado:", updatedUser);
        Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        router.back();
      } else {
        const errText = await response.text();
        console.error("Erro ao atualizar:", errText);
        Alert.alert("Erro", "Não foi possível atualizar o perfil.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert("Erro", "Ocorreu um erro ao atualizar.");
    }
  };

  // Navegação entre ícones
  const goPrevIcon = () => {
    setSelectedIcon((prev) => (prev - 1 + profileIcons.length) % profileIcons.length);
  };

  const goNextIcon = () => {
    setSelectedIcon((prev) => (prev + 1) % profileIcons.length);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
        <LinearGradient
          colors={["#70DEFE", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Editar perfil</Text>

          <View style={styles.selectedIconContainer}>
            <View style={styles.avatarWrapper}>
              {showArrows && (
                <TouchableOpacity style={styles.arrowLeft} onPress={goPrevIcon}>
                  <Ionicons name="chevron-back" size={34} color="#fff" />
                </TouchableOpacity>
              )}

              <View style={styles.avatarCircle}>
                <Image source={profileIcons[selectedIcon]} style={styles.selectedIconImage} />
              </View>

              {showArrows && (
                <TouchableOpacity style={styles.arrowRight} onPress={goNextIcon}>
                  <Ionicons name="chevron-forward" size={34} color="#fff" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.editPhotoButton}
              onPress={() => setShowArrows(!showArrows)}
            >
              <Ionicons name="camera-outline" size={22} color="#8B5CF6" />
              <Text style={styles.editPhotoText}>Editar foto</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>E-mail:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            value={email}
            onChangeText={setEmail}
            editable={false} // normalmente o email não deve ser editável
          />

          <Text style={styles.label}>Grau de autismo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Opcional"
            value={autismLevel}
            onChangeText={setAutismLevel}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar informações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 18,
    top: 44,
    zIndex: 2,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    marginTop: 8,
  },
  selectedIconContainer: {
    marginTop: 8,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarWrapper: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#8B5CF6",
    backgroundColor: "#fff",
    overflow: "hidden", // força a imagem a ficar dentro do círculo
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIconImage: {
    width: "120%",
    height: "125%",
    resizeMode: "contain", 
  },
  arrowLeft: {
    position: "absolute",
    left: -25,
    top: "50%",
    transform: [{ translateY: -17 }],
  },
  arrowRight: {
    position: "absolute",
    right: -25,
    top: "50%",
    transform: [{ translateY: -17 }],
  },
  editPhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 8,
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  editPhotoText: {
    color: "#8B5CF6",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 15,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  label: {
    fontSize: 15,
    color: "#222",
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#70DEFE",
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 10,
   
  
  },
  saveButton: {
    backgroundColor: "#70DEFE",
    borderRadius: 18,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 18,
    shadowColor: "#70DEFE",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
