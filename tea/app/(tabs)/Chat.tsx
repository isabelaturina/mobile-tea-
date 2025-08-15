import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Chat() {
  const chatRooms = [
    {
      id: 1,
      name: 'Grupo Saúde & Bem-estar',
      lastMessage: 'Olá! Como vocês estão se sentindo hoje?',
      time: '2 min',
      unread: 3,
    },
    {
      id: 2,
      name: 'Suporte Tea',
      lastMessage: 'Estamos aqui para ajudar você!',
      time: '1 hora',
      unread: 0,
    },
    {
      id: 3,
      name: 'Comunidade Fitness',
      lastMessage: 'Quem vai treinar hoje?',
      time: '3 horas',
      unread: 1,
    },
    {
      id: 4,
      name: 'Dicas Nutrição',
      lastMessage: 'Nova receita saudável compartilhada!',
      time: '5 horas',
      unread: 0,
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#00C6FF', '#1163E7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Chat</Text>
        <Text style={styles.headerSubtitle}>Conecte-se com a comunidade</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {chatRooms.map((room) => (
          <TouchableOpacity key={room.id} style={styles.chatCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="people" size={24} color="#1163E7" />
            </View>
            
            <View style={styles.chatInfo}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatName}>{room.name}</Text>
                <Text style={styles.chatTime}>{room.time}</Text>
              </View>
              
              <View style={styles.chatFooter}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {room.lastMessage}
                </Text>
                {room.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{room.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="#B0B0B0" />
          <Text style={styles.emptyStateTitle}>Nenhuma conversa ativa</Text>
          <Text style={styles.emptyStateText}>
            Comece uma conversa com a comunidade Tea
          </Text>
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
  chatCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatTime: {
    fontSize: 12,
    color: '#666',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#1163E7',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
}); 