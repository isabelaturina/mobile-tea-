import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "../contexts/UserContext";

type SupportLevel = "leve" | "moderado" | "severo" | "nao_possui";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [supportLevel, setSupportLevel] = useState<SupportLevel | null>(null);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const router = useRouter();
  const { signUp } = useUser();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // 🎨 Define cores com base no tema
  const colors = isDarkMode
    ? {
        background: "#000000",
        textPrimary: "#F8FAFC",
        textSecondary: "#94A3B8",
        card: "#1E293B",
        accent: "#3B82F6",
        lightAccent: "#60A5FA",
        border: "#334155",
        placeholder: "#64748B",
        circle: "#1E293B",
        modal: "#1E293B",
      }
    : {
        background: "#fff",
        textPrimary: "#222",
        textSecondary: "#7b7b7bff",
        card: "#fff",
        accent: "#1163E7",
        lightAccent: "#00C6FF",
        border: "#00C6FF",
        placeholder: "#575757",
        circle: "#E0F2FF",
        modal: "#fff",
      };

  // ✅ Fecha o modal automaticamente após 2,5 segundos
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        router.replace("/(tabs)/Home" as any);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  const levels = useMemo(
    () => [
      { label: "Leve", value: "leve" as const, description: "Suporte leve" },
      { label: "Moderado", value: "moderado" as const, description: "Suporte moderado" },
      { label: "Severo", value: "severo" as const, description: "Suporte severo" },
      { label: "Não possuo o espectro", value: "nao_possui" as const, description: "Pai, mãe ou cuidador" },
    ],
    []
  );

  const levelLabel = useMemo(() => {
    const found = levels.find((l) => l.value === supportLevel);
    return found?.label ?? "Nível de suporte (opcional)";
  }, [levels, supportLevel]);

  const levelDescription = useMemo(() => {
    const found = levels.find((l) => l.value === supportLevel);
    return found?.description ?? "";
  }, [levels, supportLevel]);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert(
        "Ops!",
        "Parece que você esqueceu de preencher algum campo. Tente novamente!"
      );
      return;
    }

    const regexNome = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/;
    if (!regexNome.test(name)) {
      Alert.alert("Nome inválido", "O nome deve conter apenas letras.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const regexGmail = /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!regexGmail.test(email)) {
      Alert.alert(
        "Erro",
        "O email deve ser do Gmail, não começar com ponto e não conter dois pontos seguidos."
      );
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const signUpSuccess = await signUp(name, email, password);

      if (signUpSuccess) {
        setShowSuccessModal(true);
      } else {
        Alert.alert("Erro", "Erro ao criar a conta");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao criar a conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.backgroundCircle, { backgroundColor: colors.circle }]} />
        <Image
          source={require("../assets/images/logo tea.png")}
          style={styles.image}
        />

        <Text style={[styles.title, { color: colors.textPrimary }]}>Crie sua conta</Text>
        <TouchableOpacity onPress={() => router.push("/Login")}>
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            Já possui uma conta? <Text style={[styles.link, { color: colors.accent }]}>Faça seu Login</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Nome:"
            placeholderTextColor={colors.placeholder}
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textPrimary }]}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Email:"
            placeholderTextColor={colors.placeholder}
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textPrimary }]}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Senha:"
              placeholderTextColor={colors.placeholder}
              style={[styles.inputPassword, { backgroundColor: colors.card, borderColor: colors.border, color: colors.textPrimary }]}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              accessibilityRole="button"
              accessibilityLabel={
                showPassword ? "Ocultar senha" : "Mostrar senha"
              }
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
            style={[styles.dropdownTrigger, { backgroundColor: colors.card, borderColor: colors.border }]}
            accessibilityRole="button"
            accessibilityLabel="Selecionar nível de suporte"
          >
            <View style={styles.dropdownContent}>
              <Text
                style={[
                  styles.dropdownText,
                  { color: supportLevel ? colors.textPrimary : colors.placeholder },
                ]}
              >
                {levelLabel}
              </Text>
              {supportLevel && levelDescription && (
                <Text style={[styles.dropdownDescription, { color: colors.textSecondary }]}>
                  {levelDescription}
                </Text>
              )}
            </View>
            <Text style={[styles.dropdownCaret, { color: colors.textPrimary }]}>▾</Text>
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

            <View style={[styles.modalSheet, { backgroundColor: colors.modal }]}>
              {levels.map((item) => (
                <Pressable
                  key={item.value}
                  onPress={() => {
                    setSupportLevel(item.value);
                    setIsLevelModalOpen(false);
                  }}
                  style={[
                    styles.optionItem,
                    supportLevel === item.value && { backgroundColor: colors.accent + '20' },
                  ]}
                >
                  <View style={styles.optionContent}>
                    <Text style={[styles.optionText, { color: colors.textPrimary }]}>{item.label}</Text>
                    <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                      {item.description}
                    </Text>
                  </View>
                  {supportLevel === item.value && (
                    <Text style={[styles.checkmark, { color: colors.accent }]}>✓</Text>
                  )}
                </Pressable>
              ))}
            </View>
          </Modal>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <LinearGradient
              colors={[colors.accent, colors.lightAccent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Criando Conta..." : "Criar Conta"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 🔹 Modal de sucesso estilizado e automático */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.successModal, { backgroundColor: colors.modal }]}>
            <LinearGradient
              colors={[colors.accent, colors.lightAccent]}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Sucesso!</Text>
            </LinearGradient>

            <Text style={[styles.modalMessage, { color: colors.textPrimary }]}>
              Conta criada com sucesso! Bem-vindo ao Tea+
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    zIndex: -1,
  },
  image: { width: 200, height: 200, marginBottom: 16, resizeMode: "contain" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 14,
    textAlign: "center",
  },
  linkText: {
    marginBottom: 16,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  link: { fontWeight: "bold" },
  formContainer: { width: "100%", marginBottom: 16 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 56,
    padding: 12,
    marginBottom: 30,
    fontSize: 14,
    fontWeight: "600",
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
    borderRadius: 56,
    padding: 12,
    fontSize: 14,
    fontWeight: "600",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eyeButton: { marginLeft: -40, padding: 8, zIndex: 1 },
  dropdownTrigger: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownContent: {
    flex: 1,
  },
  dropdownText: { fontSize: 14, fontWeight: "600" },
  dropdownDescription: { fontSize: 12, marginTop: 2 },
  dropdownCaret: { fontSize: 16 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  modalSheet: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 32,
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  optionItem: { 
    paddingVertical: 13, 
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionContent: {
    flex: 1,
  },
  optionText: { fontSize: 16, fontWeight: "600" },
  optionDescription: { fontSize: 14, marginTop: 2 },
  checkmark: { fontSize: 18, fontWeight: "bold" },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: "#7b7b7b",
    resizeMode: "contain",
  },
  button: {
    borderRadius: 15,
    marginTop: 8,
    width: "70%",
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    left: 50,
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  buttonDisabled: { opacity: 0.7 },

  // 🔹 Estilos do modal de sucesso
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  successModal: {
    width: "80%",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
  },
  modalHeader: {
    paddingVertical: 14,
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalMessage: {
    padding: 20,
    fontSize: 16,
    textAlign: "center",
  },
});
