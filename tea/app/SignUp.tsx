import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
  View
} from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { useUser } from '../contexts/UserContext';

type SupportLevel = 'leve' | 'moderado' | 'severo';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [supportLevel, setSupportLevel] = useState<SupportLevel | null>(null);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [grauAutismo, setGrauAutismo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { signUp } = useUser();

  const levels = useMemo(
    () => [
      { label: 'leve', value: 'leve' as const },
      { label: 'moderado', value: 'moderado' as const },
      { label: 'severo', value: 'severo' as const },
    ],
    []
  );

  const levelLabel = useMemo(() => {
    const found = levels.find(l => l.value === supportLevel);
    return found?.label ?? 'Nível de suporte';
  }, [levels, supportLevel]);

  const handleSignUp = async () => {
    if (!name || !email || !password || !supportLevel) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const signUpSuccess = await signUp(name, email, password);

      if (signUpSuccess) {
        Alert.alert('Sucesso!', 'Conta criada com sucesso! Bem-vindo ao Tea+', [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/Home' as any),
          },
        ]);
        Alert.alert(
          'Sucesso!',
          'Conta criada com sucesso! Bem-vindo ao Tea+',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)/Home' as any) }]
        );
      } else {
        Alert.alert('Erro', 'Erro ao criar a conta');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao criar a conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.backgroundCircle} />
        <Image
          source={require('../assets/images/logo tea.png')}
          style={styles.image}
        />

        <Text style={styles.title}>Crie sua conta</Text>
        <TouchableOpacity onPress={() => router.push('/Login')}>
          <Text style={styles.linkText}>
            Já possui uma conta? <Text style={styles.link}>Faça seu Login</Text>
          </Text>
         
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Nome:"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Email:"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Senha:"
              style={styles.inputPassword}
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
              accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              <Image
                source={
                  showPassword
                    ? require('../assets/images/olho-aberto.png')
                    : require('../assets/images/olho-fechado.png')
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <Pressable
            onPress={() => setIsLevelModalOpen(true)}
            style={styles.dropdownTrigger}
            accessibilityRole="button"
            accessibilityLabel="Selecionar nível de suporte"
          >
            <Text style={[styles.dropdownText, !supportLevel && { color: '#9aa0a6' }]}>
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
            <TouchableWithoutFeedback onPress={() => setIsLevelModalOpen(false)}>
              <View style={styles.modalBackdrop} />
            </TouchableWithoutFeedback>

            <View style={styles.modalSheet}>
              {levels.map(item => (
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
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#00C6FF', '#1163E7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Criando Conta...' : 'Criar Conta'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  backgroundCircle: {
    position: 'absolute',
    top: -120,
    right: 35,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: '#E0F2FF',
    zIndex: -1,
  },
  image: { width: 200, height: 200, marginBottom: 16, resizeMode: 'contain' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8, color: '#222', textAlign: 'center' },
  linkText: { color: '#7b7b7bff', marginBottom: 16, textAlign: 'center' },
  link: { color: '#007AFF', fontWeight: 'bold' },
  formContainer: { width: '100%', marginBottom: 16 },

  // Inputs iguais à 1ª imagem
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#00C6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 12 },
  inputPassword: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#00C6FF',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eyeButton: { marginLeft: -40, padding: 8, zIndex: 1 },
  dropdownTrigger: {
    width: '45%',
    borderWidth: 1,
    borderColor: '#00C6FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: { fontSize: 16, color: '#000000ff' },
  dropdownCaret: { fontSize: 16 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)' },
  modalSheet: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  optionItem: { paddingVertical: 14, paddingHorizontal: 16 },
  optionItemActive: { backgroundColor: '#EAF3FF' },
  optionText: { fontSize: 16, color: '#222' },
  
  eyeIcon: { width: 24, height: 24, tintColor: '#7b7b7b', resizeMode: 'contain' },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#00C6FF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: { width: '100%', height: 50 },

  button: {
    borderRadius: 12,
    marginTop: 8,
    width: '100%',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  buttonDisabled: { opacity: 0.7 },
});
