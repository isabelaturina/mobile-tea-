import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SpeedDialFABProps {
  onAddEvent: () => void;
  onAddNote: () => void;
}

export default function SpeedDialFAB({ onAddEvent, onAddNote }: SpeedDialFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim1 = useRef(new Animated.Value(0)).current;
  const translateYAnim2 = useRef(new Animated.Value(0)).current;
  const opacityAnim1 = useRef(new Animated.Value(0)).current;
  const opacityAnim2 = useRef(new Animated.Value(0)).current;

  const toggleSpeedDial = () => {
    if (isOpen) {
      // Fechar Speed Dial
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim1, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim2, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim1, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim2, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Abrir Speed Dial
      Animated.parallel([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim1, {
          toValue: -60,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim2, {
          toValue: -120,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim1, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim2, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    setIsOpen(!isOpen);
  };

  const handleAddEvent = () => {
    toggleSpeedDial();
    onAddEvent();
  };

  const handleAddNote = () => {
    toggleSpeedDial();
    onAddNote();
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <View style={styles.container}>
      {/* Opção 1: Adicionar Evento */}
      <Animated.View
        style={[
          styles.optionContainer,
          {
            transform: [
              { translateY: translateYAnim2 },
              { scale: scaleAnim },
            ],
            opacity: opacityAnim2,
          },
        ]}
      >
        <TouchableOpacity style={styles.optionButton} onPress={handleAddEvent}>
          <LinearGradient
            colors={["#8B5CF6", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.optionGradient}
          >
            <Ionicons name="calendar" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.optionLabel}>
          <Text style={styles.optionLabelText}>Adicionar evento</Text>
        </View>
      </Animated.View>

      {/* Opção 2: Anotar Dia */}
      <Animated.View
        style={[
          styles.optionContainer,
          {
            transform: [
              { translateY: translateYAnim1 },
              { scale: scaleAnim },
            ],
            opacity: opacityAnim1,
          },
        ]}
      >
        <TouchableOpacity style={styles.optionButton} onPress={handleAddNote}>
          <LinearGradient
            colors={["#8B5CF6", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.optionGradient}
          >
            <Ionicons name="create" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.optionLabel}>
          <Text style={styles.optionLabelText}>Anotar dia</Text>
        </View>
      </Animated.View>

      {/* Botão Principal */}
      <TouchableOpacity style={styles.mainButton} onPress={toggleSpeedDial}>
        <LinearGradient
          colors={["#8B5CF6", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.mainButtonGradient}
        >
          <Animated.View
            style={{
              transform: [{ rotate: rotateInterpolate }],
            }}
          >
            <Ionicons
              name={isOpen ? "close" : "add"}
              size={24}
              color="#fff"
            />
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    right: 35,
    alignItems: "center",
  },
  optionContainer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    flexDirection: "row",
    right: 0,
  },
  optionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  optionGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionLabelText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
