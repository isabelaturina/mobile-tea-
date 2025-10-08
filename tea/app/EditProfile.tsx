import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
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

// Pegamos largura e altura da tela
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function EditProfile() {
  const router = useRouter();
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [showArrows, setShowArrows] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [autismLevel, setAutismLevel] = useState("");

  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const goPrevIcon = () => {
    setSelectedIcon((prev) =>
      prev === 0 ? profileIcons.length - 1 : prev - 1
    );
  };

  const goNextIcon = () => {
    setSelectedIcon((prev) =>
      prev === profileIcons.length - 1 ? 0 : prev + 1
    );
  };

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      setWarningMessage("Por favor, preencha seu nome e e-mail.");
      setShowWarning(true);
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setWarningMessage("Digite um e-mail válido.");
      setShowWarning(true);
      return;
    }

    router.back();
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
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
                <TouchableOpacity
                  style={styles.arrowLeft}
                  onPress={goPrevIcon}
                >
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
                <TouchableOpacity
                  style={styles.arrowRight}
                  onPress={goNextIcon}
                >
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
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>E-mail:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu E-mail"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Text style={styles.label}>Grau autismo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Opcional"
            placeholderTextColor="#999"
            value={autismLevel}
            onChangeText={setAutismLevel}
          />

          <TouchableOpacity
            style={[
              styles.saveButton,
              (!name.trim() || !email.trim()) && { opacity: 0.5 },
            ]}
            disabled={!name.trim() || !email.trim()}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Salvar informações</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal personalizado */}
      <Modal
        transparent
        visible={showWarning}
        animationType="fade"
        onRequestClose={() => setShowWarning(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="warning-outline" size={40} color="#8B5CF6" />
            <Text style={styles.modalText}>{warningMessage}</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowWarning(false)}
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

  /* Estilos do Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,  // Espaço nas laterais para telas pequenas
  },

  modalBox: {
    width: "100%",
    maxWidth: 400,            // Máximo pra telas maiores, sem ser fixo absoluto
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,    // Padding em %, sem valor fixo grande
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },

  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "500",
  },

  modalButton: {
    backgroundColor: "#8B5CF6",
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
