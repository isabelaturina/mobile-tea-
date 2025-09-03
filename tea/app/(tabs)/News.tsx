import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function News() {
  const newsItems = [
    {
      id: 1,
      title: 'Dicas para uma vida mais saudável',
      excerpt: 'Descubra como pequenas mudanças podem transformar sua saúde...',
      category: 'Saúde',
      readTime: '3 min',
    },
    {
      id: 2,
      title: 'Benefícios do exercício regular',
      excerpt: 'Saiba por que a atividade física é essencial para o bem-estar...',
      category: 'Fitness',
      readTime: '5 min',
    },
    {
      id: 3,
      title: 'Alimentação equilibrada',
      excerpt: 'Guia completo para uma alimentação saudável e nutritiva...',
      category: 'Nutrição',
      readTime: '4 min',
    },
    {
      id: 4,
      title: 'Meditação para iniciantes',
      excerpt: 'Aprenda técnicas simples de meditação para reduzir o estresse...',
      category: 'Bem-estar',
      readTime: '6 min',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00C6FF', '#96bfffff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Notícias</Text>
        <Text style={styles.headerSubtitle}>Fique por dentro das novidades</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {newsItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.newsCard}>
            <View style={styles.newsHeader}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <View style={styles.readTimeContainer}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.readTimeText}>{item.readTime}</Text>
              </View>
            </View>
            
            <Text style={styles.newsTitle}>{item.title}</Text>
            <Text style={styles.newsExcerpt}>{item.excerpt}</Text>
            
            <View style={styles.newsFooter}>
              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>Ler mais</Text>
                <Ionicons name="arrow-forward" size={16} color="#1163E7" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1163E7',
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTimeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  newsExcerpt: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  newsFooter: {
    alignItems: 'flex-end',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1163E7',
    marginRight: 4,
  },
}); 