import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


const profileIcons = [
  require("../../assets/images/gato-icon.png"),
  require("../../assets/images/panda-icon.png"),
  require("../../assets/images/servo-icon.png"),
  require("../../assets/images/raposinha-icon.png"),
  require("../../assets/images/whitegirl-icon.png"),
  require("../../assets/images/blackgirl-icon.png"),
  require("../../assets/images/whiteboy-icon.png"),
  require("../../assets/images/blackboy-icon.png"),
];

export default function EditProfile() {
  const router = useRouter();
  const [selectedIcon, setSelectedIcon] = useState(0);
  const [showIconOptions, setShowIconOptions] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [autismLevel, setAutismLevel] = useState("");

  return (
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
          <Image source={profileIcons[selectedIcon]} style={styles.selectedIconImage} />
          <TouchableOpacity
            style={styles.editPhotoButton}
            onPress={() => setShowIconOptions(!showIconOptions)}
          >
            <Ionicons name="camera-outline" size={22} color="#8B5CF6" />
            <Text style={styles.editPhotoText}>Editar foto</Text>
          </TouchableOpacity>
        </View>
        {showIconOptions && (
          <View style={styles.iconsRow}>
            {profileIcons.map((icon, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.iconCircle,
                  selectedIcon === idx && styles.iconSelected,
                ]}
                onPress={() => setSelectedIcon(idx)}
                activeOpacity={0.8}
              >
                <Image source={icon} style={styles.iconImage} />
              </TouchableOpacity>
            ))}
          </View>
        )}
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
          placeholder="Digite seu E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Número de celular:</Text>
        <TextInput
          style={styles.input}
          placeholder="(99) 99999-9999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Grau autismo:</Text>
        <TextInput
          style={styles.input}
          placeholder="Opcional"
          value={autismLevel}
          onChangeText={setAutismLevel}
        />

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Salvar informações</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    position: "relative",
  },
  selectedIconImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    resizeMode: "cover",
    borderWidth: 3,
    borderColor: "#8B5CF6",
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
  iconsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
    marginTop: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconSelected: {
    borderColor: "#8B5CF6",
    borderWidth: 2.5,
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  iconImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
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