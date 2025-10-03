import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useUser } from "../contexts/UserContext";

type SupportLevel = "leve" | "moderado" | "severo";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [supportLevel, setSupportLevel] = useState<SupportLevel | null>(null);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useUser();
  const router = useRouter();

  const levels = useMemo(
    () => [
      { label: "Leve", value: "leve" as const },
      { label: "Moderado", value: "moderado" as const },
      { label: "Severo", value: "severo" as const },
    ],
    []
  );

  const levelLabel = useMemo(() => {
    const found = levels.find((l) => l.value === supportLevel);
    return found?.label ?? "Nível de suporte";
  }, [levels, supportLevel]);

  const handleSignUp = async () => {
    if (!name || !email || !password || !supportLevel) {
      Alert.alert("Campos obrigatórios", "Preencha todos os campos.");
      return;
    }

    const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/;
    if (!regexNome.test(name)) {
      Alert.alert("Nome inválido", "O nome deve conter apenas letras.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Senha fraca", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const regexGmail = /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regexGmail.test(email)) {
      Alert.alert(
        "Email inválido",
        "Use um email válido do Gmail, sem pontos duplicados ou começando com ponto."
      );
      return;
    }

    setIsLoading(true);
    try {
      const success = await signUp(name, email, password, supportLevel);
      if (success) {
        Alert.alert("Conta criada", "Seja bem-vindo ao Tea+!", [
          { text: "OK", onPress: () => router.replace("/(tabs)/Home") },
        ]);
      } else {
        Alert.alert("Erro", "Não foi possível criar a conta.");
      }
    } catch (err) {
      Alert.alert("Erro", "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.backgroundCircle} />
        <Image
          source={require("../assets/images/logo tea.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Crie sua conta</Text>
        <TouchableOpacity onPress={() => router.push("/Login")}>
          <Text style={styles.linkText}>
            Já possui uma conta?{" "}
            <Text style={styles.link}>Faça seu Login</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Nome"
            style={styles.input}
            placeholderTextColor="#575757"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Email"
            style={styles.input}
            placeholderTextColor="#575757"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Senha"
              style={styles.inputPassword}
              placeholderTextColor="#575757"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Image
                source={
                  showPassword
                    ? require("../assets/images/olho-aberto.png")
                    : require("../assets/images/olho-fechado.png")
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <Pressable
            onPress={() => setIsLevelModalOpen(true)}
            style={styles.dropdownTrigger}
          >
            <Text
              style={[
                styles.dropdownText,
                !supportLevel && { color: "#575757" },
              ]}
            >
              {levelLabel}
            </Text>
            <Text style={styles.dropdownCaret}>▾</Text>
          </Pressable>

          <Modal
            visible={isLevelModalOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setIsLevelModalOpen(false)}
          >
            <TouchableWithoutFeedback
              onPress={() => setIsLevelModalOpen(false)}
            >
              <View style={styles.modalBackdrop} />
            </TouchableWithoutFeedback>
            <View style={styles.modalSheet}>
              {levels.map((item) => (
                <Pressable
                  key={item.value}
                  onPress={() => {
                    setSupportLevel(item.value);
                    setIsLevelModalOpen(false);
                  }}
                  style={[
                    styles.optionItem,
                    supportLevel === item.value && styles.optionItemActive,
                  ]}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          </Modal>

          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, isLoading && styles.buttonDisabled]}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#008BEF", "#008BEF"]}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Criando conta..." : "Criar Conta"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  backgroundCircle: {
    position: "absolute",
    top: -120,
    right: 35,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: "#E0F2FF",
    zIndex: -1,
  },
  image: { width: 200, height: 200, marginBottom: 16, resizeMode: "contain" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#222",
    textAlign: "center",
  },
  linkText: {
    color: "#7b7b7bff",
    marginBottom: 16,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  link: { color: "#007AFF", fontWeight: "bold" },
  formContainer: { width: "100%", marginBottom: 16 },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#00C6FF",
    borderRadius: 56,
    padding: 12,
    marginBottom: 30,
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  inputPassword: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#00C6FF",
    borderRadius: 56,
    padding: 12,
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eyeButton: { marginLeft: -40, padding: 8, zIndex: 1 },
  dropdownTrigger: {
    width: "45%",
    borderWidth: 1,
    borderColor: "#00C6FF",
    borderRadius: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 30,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: { fontSize: 14, color: "#000000ff", fontWeight: "600" },
  dropdownCaret: { fontSize: 16 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  modalSheet: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  optionItem: { paddingVertical: 13, paddingHorizontal: 16 },
  optionItemActive: { backgroundColor: "#EAF3FF" },
  optionText: { fontSize: 16, color: "#222", fontWeight: "600" },

  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: "#7b7b7b",
    resizeMode: "contain",
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#00C6FF",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: { width: "100%", height: 50 },

  button: {
    borderRadius: 12,
    marginTop: 8,
    width: "80%",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    left: 35,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000066",
  },
  modalContent: {
    backgroundColor: "#222",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  levelOption: {
    paddingVertical: 12,
    borderBottomColor: "#444",
    borderBottomWidth: 1,
  },
  levelOptionSelected: {
    backgroundColor: "#4F46E5",
  },
  levelOptionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  levelOptionTextSelected: {
    fontWeight: "bold",
  },
});
