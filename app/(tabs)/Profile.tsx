import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

const { height: screenHeight } = Dimensions.get('window');

export default function Profile() {
  const router = useRouter();
  const { userData, logout } = useUser();
  const { theme, toggleTheme } = useTheme(); 
  const isDarkMode = theme === "dark";

  const colors = isDarkMode
    ? {
        background: "#050F1E",
        card: "#111827",
        cardShadow: "rgba(0, 0, 0, 0.7)",
        iconBackground: "#1F2937",
        accent: "#70DEFE",
        menuText: "#E2E8F0",
        textPrimary: "#E2E8F0",
        modalBackground: "#0F172A",
        modalText: "#E2E8F0",
        overlay: "rgba(0, 0, 0, 0.7)",
        secondaryButtonBg: "#1F2937",
        secondaryButtonText: "#E2E8F0",
        primaryButtonBg: "#2563EB",
        primaryButtonText: "#FFFFFF",
        profileRing: "#0F172A",
      }
    : {
        background: "#F8F9FA",
        card: "#FFFFFF",
        cardShadow: "rgba(17, 99, 231, 0.25)",
        iconBackground: "#F2F6FF",
        accent: "#1163E7",
        menuText: "#1163E7",
        textPrimary: "#222222",
        modalBackground: "#FFFFFF",
        modalText: "#222222",
        overlay: "rgba(0, 0, 0, 0.18)",
        secondaryButtonBg: "#E3F6FF",
        secondaryButtonText: "#158EE5",
        primaryButtonBg: "#16C9FF",
        primaryButtonText: "#FFFFFF",
        profileRing: "#FFFFFF",
      };

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!userData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>Carregando...</Text>
      </View>
    );
  }

  const handleEditProfile = () => {
    router.push('/EditProfile');
  };

  const handleChangePassword = () => {
   router.replace('/forgot-password');
  };

  const handleNotifications = () => {
    setShowNotificationModal(true);
  };

  const handleAllowNotifications = () => {
    setShowNotificationModal(false);
    alert('Notificações ativadas!');
  };

  const handleLater = () => {
    setShowNotificationModal(false);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.replace('/Login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* Header com altura relativa */}
      <LinearGradient
        colors={isDarkMode ? ['#158EE5', '#A05BF0', '#D547F4'] : ['#70DEFE', '#D547F4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.profileSection}>
          <View style={[styles.profileImageContainer, { backgroundColor: colors.profileRing }]}>
            <Image source={userData.profileImage} style={styles.profileImage} />
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>
      </LinearGradient>

      {/* Conteúdo principal com ScrollView */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuContainer}>
          {/* Editar perfil */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}
            onPress={handleEditProfile}
          >
            <View style={[styles.menuIconBox, { backgroundColor: colors.iconBackground }]}>
              <Ionicons name="person-outline" size={22} color={colors.accent} />
            </View>
            <Text style={[styles.menuText, { color: colors.menuText }]}>Editar perfil</Text>
          </TouchableOpacity>

          {/* Esqueceu senha  */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}
            onPress={handleChangePassword}
          >
            <View style={[styles.menuIconBox, { backgroundColor: colors.iconBackground }]}>
              <Ionicons name="lock-closed-outline" size={22} color={colors.accent} />
            </View>
            <Text style={[styles.menuText, { color: colors.menuText }]}>Esqueceu Senha?</Text>
          </TouchableOpacity>

          {/* Notificações */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}
            onPress={handleNotifications}
          >
            <View style={[styles.menuIconBox, { backgroundColor: colors.iconBackground }]}>
              <Ionicons name="notifications-outline" size={22} color={colors.accent} />
            </View>
            <Text style={[styles.menuText, { color: colors.menuText }]}>Notificações</Text>
          </TouchableOpacity>

          {/* Sair da conta */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}
            onPress={() => setShowLogoutModal(true)}
          >
            <View style={[styles.menuIconBox, { backgroundColor: colors.iconBackground }]}>
              <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
            </View>
            <Text style={[styles.menuText, styles.logoutText]}>Sair da conta</Text>
          </TouchableOpacity>

          {/* Alternar modo escuro */}
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.card, shadowColor: colors.cardShadow }]}
            onPress={toggleTheme}
          >
            <View style={[styles.menuIconBox, { backgroundColor: colors.iconBackground }]}>
              <Ionicons
                name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                size={22}
                color={colors.accent}
              />
            </View>
            <Text style={[styles.menuText, { color: colors.menuText }]}>
              {isDarkMode ? 'Adicionar modo claro' : 'Adicionar modo escuro'}
            </Text>
          </TouchableOpacity>

          {/* Espaço extra no final */}
          <View style={styles.spacer} />
        </View>
      </ScrollView>

      {/* Modais */}
      {showNotificationModal && (
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.modalText }]}>Deseja receber notificações do app?</Text>
            <Image
              source={require('../../assets/images/notification-bell.png')}
              style={styles.modalImage}
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.secondaryButtonBg }]}
                onPress={handleLater}
              >
                <Text style={[styles.modalButtonText, { color: colors.secondaryButtonText }]}>
                  Talvez mais tarde
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primaryButtonBg }]}
                onPress={handleAllowNotifications}
              >
                <Text style={[styles.modalButtonText, { color: colors.primaryButtonText }]}>
                  Sim desejo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showLogoutModal && (
        <View style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.modalContainer, { backgroundColor: colors.modalBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.modalText }]}>Tem certeza que deseja sair da conta?</Text>
            <Image
              source={require('../../assets/images/logout.png')}
              style={styles.modalImage}
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.secondaryButtonBg }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.secondaryButtonText }]}>
                  Não
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primaryButtonBg }]}
                onPress={confirmLogout}
              >
                <Text style={[styles.modalButtonText, { color: colors.primaryButtonText }]}>
                  Sim, tenho certeza
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  headerGradient: {
    height: screenHeight * 0.3, // 30% da altura da tela
    maxHeight: 280, // altura máxima para tablets
    minHeight: 200, // altura mínima para telas pequenas
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    // ...existing code...
paddingTop: (StatusBar.currentHeight ?? 0) + 20, // usa 0 se for undefined
// ...existing code...
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  profileImageContainer: {
    width: screenHeight * 0.12, // 12% da altura da tela
    height: screenHeight * 0.12,
    maxWidth: 110,
    maxHeight: 110,
    minWidth: 80,
    minHeight: 80,
    borderRadius: screenHeight * 0.06,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: '90%',
    height: '90%',
    borderRadius: screenHeight * 0.055,
    resizeMode: 'cover',
  },
 // ...existing code...
userName: {
  fontSize: Math.max(Math.min(screenHeight * 0.025, 21), 18), // limita entre 18 e 21
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 2,
  textAlign: 'center',
},
userEmail: {
  fontSize: Math.max(Math.min(screenHeight * 0.018, 15), 12), // limita entre 12 e 15
  color: '#fff',
  opacity: 0.9,
  textAlign: 'center',
  marginBottom: 10,
},
// ...existing code...
  menuContainer: {
    paddingHorizontal: 18,
    paddingTop: 30,
    paddingBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 15,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    minHeight: 60,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutText: {
    color: '#FF6B6B',
  },
  spacer: {
    height: 30,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    marginHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 18,
  },
  modalImage: {
    width: 120,
    height: 100,
    marginBottom: 18,
    resizeMode: 'contain',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    minHeight: 44, // altura mínima para acessibilidade
  },
  modalButtonText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});