import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../contexts/UserContext';

export default function Home() {
  const { userData } = useUser();

  return (
    <View style={styles.container}>
      {/* Header com gradiente e ilustração */}
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              Conecte-se com outras famílias e encontre apoio no dia a dia.
            </Text>
          </View>
          <View style={styles.headerIllustration}>
            {/* Ícones decorativos */}
            <View style={styles.iconsContainer}>
              <Ionicons name="star" size={20} color="#fff" style={styles.decorativeIcon} />
              <Ionicons name="heart" size={20} color="#8B5CF6" style={styles.decorativeIcon} />
              <Ionicons name="heart" size={20} color="#fff" style={styles.decorativeIcon} />
              <Ionicons name="people" size={20} color="#fff" style={styles.decorativeIcon} />
            </View>
            {/* Ilustração da família */}
            <View style={styles.illustrationContainer}>
              <Image 
                source={require('../../assets/images/homefamily.png')}
                style={styles.familyImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Mensagem de boas-vindas */}
        <Text style={styles.welcomeText}>
          Bem Vindo {userData?.name || 'Usuário'}!
        </Text>

        {/* Cards de funcionalidades */}
        <View style={styles.featureCardsContainer}>
          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="location" size={32} color="#3B82F6" />
            <Text style={styles.featureCardText}>Localização</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <Ionicons name="calendar" size={32} color="#3B82F6" />
            <Text style={styles.featureCardText}>Cronograma</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <View style={styles.newsIconContainer}>
              <Ionicons name="newspaper" size={24} color="#fff" />
              <Text style={styles.newsText}>NEWS</Text>
            </View>
            <Text style={styles.featureCardText}>Notícias</Text>
          </TouchableOpacity>
        </View>

        {/* Seção "Conheça a Bea" */}
        <View style={styles.beaCard}>
          <View style={styles.beaContent}>
                         <View style={styles.beaIllustration}>
               <Image 
                 source={require('../../assets/images/bea.png')} 
                 style={styles.beaImage}
                 resizeMode="contain"
               />
             </View>
            <View style={styles.beaTextContainer}>
              <View style={styles.beaTitleContainer}>
                <Text style={styles.beaTitle}>Conheça a </Text>
                <Text style={styles.beaName}>Bea</Text>
                <Ionicons name="heart" size={16} color="#3B82F6" style={styles.beaHeart} />
              </View>
              <Text style={styles.beaDescription}>
                Sua assistente virtual do TEA+ pronta para acolher, orientar e responder dúvidas sobre o espectro autista. Seja você mãe, pai ou cuidador, a Bea está aqui para ajudar com informações seguras e apoio humanizado.
              </Text>
              <TouchableOpacity style={styles.beaButton}>
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.beaButtonGradient}
                >
                  <Text style={styles.beaButtonText}>Converse com a Bea</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Seção "Quer saber mais sobre o autismo?" */}
        <View style={styles.autismCard}>
          <View style={styles.autismContent}>
                         <View style={styles.autismIconContainer}>
               <Text style={styles.brainIcon}>🧠</Text>
             </View>
            <View style={styles.autismTextContainer}>
              <Text style={styles.autismTitle}>Quer saber mais sobre o autismo?</Text>
              <Text style={styles.autismDescription}>
                Se você está usando o TeaMais e ainda não conhece muito sobre o tema, clique no botão abaixo e acesse nosso site! Lá você encontra curiosidades, informações importantes e muito mais. Conhecimento transforma!{' '}
                <Ionicons name="heart" size={14} color="#3B82F6" />
              </Text>
              <TouchableOpacity style={styles.autismButton}>
                <Text style={styles.autismButtonText}>Clique Aqui</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 28,
  },
  headerIllustration: {
    alignItems: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  decorativeIcon: {
    marginHorizontal: 2,
  },
  illustrationContainer: {
    alignItems: 'center',
  },
  familyImage: {
    width: 120,
    height: 120,
    marginTop: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 24,
  },
  featureCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: '#E0F2FF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    aspectRatio: 1,
  },
  featureCardText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  newsIconContainer: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 4,
    alignItems: 'center',
  },
  newsText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 2,
  },
  beaCard: {
    backgroundColor: '#E0F2FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    minHeight: 140,
  },
  beaContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  beaIllustration: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    zIndex: 1,
  },
  beaImage: {
    width: 100,
    height: 120,
  },
  beaTextContainer: {
    flex: 1,
    marginRight: 120,
  },
  beaTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  beaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  beaName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  beaHeart: {
    marginLeft: 4,
  },
  beaDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
  },
  beaButton: {
    alignSelf: 'flex-end',
  },
  beaButtonGradient: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  beaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  autismCard: {
    backgroundColor: '#E0F2FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  autismContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  autismIconContainer: {
    marginRight: 16,
    marginTop: 4,
  },
  brainIcon: {
    fontSize: 24,
  },
  autismTextContainer: {
    flex: 1,
  },
  autismTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  autismDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
  },
  autismButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'flex-end',
  },
  autismButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 