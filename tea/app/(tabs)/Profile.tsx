import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../contexts/UserContext';

export default function Profile() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { userData, logout } = useUser();

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
    Alert.alert('Notificações', 'Configurações de notificações serão implementadas');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive', 
          onPress: () => {
            logout();
            router.replace('/Login');
          }
        }
      ]
    );
  };

  const handleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    Alert.alert('Modo Escuro', isDarkMode ? 'Modo escuro desativado' : 'Modo escuro ativado');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#70DEFE', '#D547F4']}
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
        <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
          <View style={styles.menuIconBox}>
            <Ionicons name="person-outline" size={22} color="#1163E7" />
          </View>
          <Text style={styles.menuText}>Editar perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
          <View style={styles.menuIconBox}>
            <Ionicons name="lock-closed-outline" size={22} color="#1163E7" />
          </View>
          <Text style={styles.menuText}>Alterar Senha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleNotifications}>
          <View style={styles.menuIconBox}>
            <Ionicons name="notifications-outline" size={22} color="#1163E7" />
          </View>
          <Text style={styles.menuText}>Notificações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuIconBox}>
            <Ionicons name="log-out-outline" size={22} color="#FF6B6B" />
          </View>
          <Text style={[styles.menuText, styles.logoutText]}>Sair da conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleDarkMode}>
          <View style={styles.menuIconBox}>
            <Ionicons name="moon-outline" size={22} color="#1163E7" />
          </View>
          <Text style={styles.menuText}>Adicionar modo escuro</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
    paddingTop: 28,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F6FF',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginBottom: 22, // Espaçamento maior entre inputs
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
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
});