import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';

export default function Profile() {
  const router = useRouter();
  const { userData, logout } = useUser();
  const { theme, toggleTheme } = useTheme(); 
  const isDarkMode = theme === "dark";

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // novo estado para logout

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const handleEditProfile = () => {
    router.push('/EditProfile');
  };

  const handleChangePassword = () => {
    router.push('/AlterarSenha');
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

  // Confirma logout
  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.replace('/Login');
  };

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      
      <LinearGradient
        colors={isDarkMode ? ['#158EE5', '#A05BF0', '#D547F4'] : ['#70DEFE', '#D547F4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image source={userData.profileImage} style={styles.profileImage} />
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>
      </LinearGradient>

      <View style={styles.menuContainer}>
        {/* Editar perfil */}
        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <View style={styles.menuIconBox}>
            <Ionicons name="person-outline" size={22} color="#1163E7" />
          </View>
          <Text style={styles.menuText}>Editar perfil</Text>
        </TouchableOpacity>

        {/* Alterar senha */}
        <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
          <View style={styles.menuIconBox}>
            <Ionicons name="lock-closed-outline" size={22} color="#1163E7" />
          </View>
          <Text style={styles.menuText}>Alterar Senha</Text>
        </TouchableOpacity>

        {/* Notificações */}
        <TouchableOpacity style={styles.menuItem} onPress={handleNotifications}>
          <View style={styles.menuIconBox}>
            <Ionicons name="notifications-outline" size={22} color="#1163E7" />
          </View>
          <Text style={styles.menuText}>Notificações</Text>
        </TouchableOpacity>

        {/* Sair da conta */}
        <TouchableOpacity style={styles.menuItem} onPress={() => setShowLogoutModal(true)}>
          <View style={styles.menuIconBox}>
            <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
          </View>
          <Text style={[styles.menuText, styles.logoutText]}>Sair da conta</Text>
        </TouchableOpacity>

        {/* Alternar modo escuro */}
        <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
          <View style={styles.menuIconBox}>
            <Ionicons
              name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color="#1163E7"
            />
          </View>
          <Text style={styles.menuText}>
            {isDarkMode ? 'Adicionar modo claro' : 'Adicionar modo escuro'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de notificações */}
      {showNotificationModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Deseja receber notificações do app?</Text>
            <Image
              source={require('../../assets/images/notification-bell.png')}
              style={styles.modalImage}
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.modalButton} onPress={handleLater}>
                <Text style={styles.modalButtonText}>Talvez mais tarde</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleAllowNotifications}>
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Sim desejo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Modal de logout */}
      {showLogoutModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tem certeza que deseja sair da conta?</Text>
            <Image
              source={require('../../assets/images/logout.png')} // salve sua imagem aqui
              style={styles.modalImage}
            />
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.modalButtonText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={confirmLogout}>
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Sim, tenho certeza</Text>
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
    backgroundColor: '#F8F9FA',
  },
  darkContainer: {
    backgroundColor: '#000',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  headerGradient: {
    height: 220,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 40,
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
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#fff',
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
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
  },
  userName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 15,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 10,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 38,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 22,
    shadowColor: '#1163E7',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  menuIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#1163E7',
    fontWeight: '600',
  },
  logoutText: {
    color: '#FF6B6B',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 18,
  },
  modalImage: {
    width: 140,
    height: 120,
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
    backgroundColor: '#E3F6FF',
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#158EE5',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalButtonPrimary: {
    backgroundColor: '#16c9ffff',
  },
  modalButtonPrimaryText: {
    color: '#fff',
  },
});
