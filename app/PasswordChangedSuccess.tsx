import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

const PasswordChangedSuccess: React.FC = () => {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/Profile");
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <View style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </View>
        <View style={styles.dotsWrapper}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
      </View>

      <Text style={styles.heading}>Senha alterada com sucesso!</Text>
      <Text style={styles.paragraph}>
        Sua senha foi alterada com sucesso,{"\n"}
        Você já pode usar sua nova senha para acessar sua conta.
      </Text>

      {/* Botão secundário para voltar */}
      <Pressable onPress={() => router.push("/(tabs)/Profile")}>
        <Text style={styles.backButton}>← Voltar</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  iconWrapper: {
    position: "relative",
    marginBottom: 24,
  },
  outerCircle: {
    width: 170,
    height: 170,
    backgroundColor: "#d6eaff",
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 100,
    height: 100,
    backgroundColor: "#6ec8ff",
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  dotsWrapper: {
    position: "absolute",
    top: -10,
    right: -10,
  },
  dot: {
    position: "absolute",
    backgroundColor: "#cfe7ff",
    borderRadius: 50,
  },
  dot1: {
    width: 10,
    height: 10,
    top: 0,
    left: 0,
  },
  dot2: {
    width: 8,
    height: 8,
    top: 10,
    left: 30,
  },
  dot3: {
    width: 6,
    height: 6,
    top: 40,
    left: -10,
  },
  heading: {
    fontSize: 19,
    color: "#333333",
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 30,
    maxWidth: 300,
  },
  button: {
    backgroundColor: "#1163E7",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButtonContainer: {
    marginTop: 10,
  },
  backButton: {
    fontSize: 17,
    color: "#1163E7",
    bottom: 470,
    right: 140,
  },
});

export default PasswordChangedSuccess;
