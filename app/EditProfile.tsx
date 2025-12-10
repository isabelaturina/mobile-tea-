import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContext";
import { authApi, mapSupportLevelToAPI } from "../services/api/authApi";

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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function EditProfile() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const colors = isDarkMode
    ? {
        background: "#000",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        card: "#1a1a1a",
        accent: "#3B82F6",
        lightAccent: "#60A5FA",
        border: "#334155",
        placeholder: "#64748B",
        modal: "#1E293B",
        modalText: "#F8FAFC",
      }
    : {
        background: "#F8F9FA",
        textPrimary: "#222",
        textSecondary: "#666",
        card: "#fff",
        accent: "#8B5CF6",
        lightAccent: "#70DEFE",
        border: "#70DEFE",
        placeholder: "#999",
        modal: "#fff",
        modalText: "#333",
      };

  const [selectedIcon, setSelectedIcon] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  const [name, setName] = useState("");
  const [lastValidName, setLastValidName] = useState("");
  const [email, setEmail] = useState("");
  // leve / moderado / severo (ou vazio)
  const [autismLevel, setAutismLevel] = useState<"" | "leve" | "moderado" | "severo">("");

  const [userId, setUserId] = useState<number | null>(null);

  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const nameValidRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]*$/;
  const gmailStrictRegex = /^[A-Za-z0-9][A-Za-z0-9._]*@gmail\.com$/;

  // Carrega dados do usuário salvos no login
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await AsyncStorage.getItem("userData");
        if (!data) {
          console.log("userData não encontrado");
          return;
        }

        const user = JSON.parse(data);
        console.log("userData carregado:", user);

        setUserId(user.id);
        setName(user.nome || "");
        setLastValidName(user.nome || "");
        setEmail(user.email || "");

        // converte nivelSuporte da API para o campo de grau do app
        if (user.nivelSuporte === "Intermediário") setAutismLevel("leve");
        else if (user.nivelSuporte === "Avançado") setAutismLevel("moderado");
        else if (user.nivelSuporte === "Profissional") setAutismLevel("severo");
      } catch (err) {
        console.warn("Erro ao carregar userData:", err);
      }
    };

    loadUserData();
  }, []);

  const handleNameChange = (text: string) => {
    if (nameValidRegex.test(text)) {
      setName(text);
      setLastValidName(text);
    } else {
      setWarningMessage("Nome inválido: não aceita números ou caracteres.");
      setShowWarning(true);
    }
  };

  const goPrevIcon = () => {
    setSelectedIcon((prev) => (prev === 0 ? profileIcons.length - 1 : prev - 1));
  };

  const goNextIcon = () => {
    setSelectedIcon((prev) =>
      prev === profileIcons.length - 1 ? 0 : prev + 1
    );
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      setWarningMessage("Por favor, preencha seu nome e e-mail.");
      setShowWarning(true);
      return;
    }

    const nameFullValidRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
    if (!nameFullValidRegex.test(name.trim())) {
      setWarningMessage("Nome inválido: não aceita números ou caracteres.");
      setShowWarning(true);
      return;
    }

    if (!gmailStrictRegex.test(email.trim())) {
      setWarningMessage(
        "Use apenas Gmail. Agora números são permitidos no nome do e-mail."
      );
      setShowWarning(true);
      return;
    }

    if (!userId) {
      setWarningMessage("Não foi possível identificar o usuário logado.");
      setShowWarning(true);
      return;
    }

    try {
      // se o usuário escolheu um grau válido, mapeia; senão envia "Básico"
      const nivelSuporteAPI =
        autismLevel === "leve" ||
        autismLevel === "moderado" ||
        autismLevel === "severo"
          ? mapSupportLevelToAPI(autismLevel)
          : "Básico";

      await authApi.updateUserProfile(userId, {
        nome: name.trim(),
        email: email.trim(),
        nivelSuporte: nivelSuporteAPI,
      });

      const newUserData = {
        id: userId,
        nome: name.trim(),
        email: email.trim(),
        nivelSuporte: nivelSuporteAPI,
      };
      await AsyncStorage.setItem("userData", JSON.stringify(newUserData));

      setShowSuccess(true);
    } catch (err: any) {
      setWarningMessage(err?.message || "Erro ao atualizar perfil.");
      setShowWarning(true);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
        <LinearGradient
          colors={[colors.lightAccent, colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Image
              source={require("../assets/images/seta.png")}
              style={styles.backImage}
              resizeMode="contain"
              tintColor="#fff"
            />
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
                <Image
                  source={profileIcons[selectedIcon]}
                  style={styles.selectedIconImage}
                />
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
              <Ionicons name="camera-outline" size={22} color={colors.accent} />
              <Text style={[styles.editPhotoText, { color: colors.accent }]}>
                Editar foto
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>Nome:</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Digite seu nome"
            placeholderTextColor={colors.placeholder}
            value={name}
            onChangeText={handleNameChange}
          />

          <Text style={[styles.label, { color: colors.textPrimary }]}>E-mail:</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Digite seu Gmail"
            placeholderTextColor={colors.placeholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Grau autismo (leve, moderado, severo):
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Opcional"
            placeholderTextColor={colors.placeholder}
            value={autismLevel}
            onChangeText={(text) =>
              setAutismLevel(
                text === "leve" || text === "moderado" || text === "severo"
                  ? (text as "leve" | "moderado" | "severo")
                  : ""
              )
            }
          />

          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: colors.lightAccent },
              (!name.trim() || !email.trim()) && { opacity: 0.5 },
            ]}
            disabled={!name.trim() || !email.trim()}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Salvar informações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal transparent visible={showWarning} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.modal }]}>
            <Ionicons name="warning-outline" size={40} color={colors.accent} />
            <Text style={[styles.modalText, { color: colors.modalText }]}>
              {warningMessage}
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.accent }]}
              onPress={() => setShowWarning(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={showSuccess} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.modal }]}>
            <Ionicons
              name="checkmark-circle-outline"
              size={42}
              color={colors.accent}
            />

            <Text style={[styles.modalText, { color: colors.modalText }]}>
              Perfil atualizado com sucesso! 🎉
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.accent }]}
              onPress={() => {
                setShowSuccess(false);
                router.back();
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    overflow: "hidden",
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
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    borderRadius: 10,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 10,
  },
  saveButton: {
    borderRadius: 18,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 18,
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    left: 18,
    top: 50,
    zIndex: 2,
    padding: 8,
  },
  backImage: {
    width: 24,
    height: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalBox: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "500",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
    minWidth: 120,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
