import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



export default function Chat() {
  const router = useRouter();
  const chatRooms = [
    {
      id: 1,
      name: 'Chat em grupo',
      subtitle: 'Se comunique com os usuarios do app!!',
      icon: require('../../assets/images/logo tea.png'),
      route: '/ChatGrupo',
    },
    {
      id: 2,
      name: 'Bea',
      subtitle: 'Converse com a Bea, sua companheira digital.',
      icon: require('../../assets/images/bea.png'),
      route: '/ChatBea',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Chats</Text>
        <Text style={styles.subtitle}>Encontre apoio, compartilhe vivências, e faça parte da comunidade Tea+</Text>

        {chatRooms.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={styles.chatCard}
            onPress={() => router.push(room.route as any)}
          >
            <View style={styles.avatarContainer}>
              <Image source={room.icon} style={styles.avatarImage} />
            </View>
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{room.name}</Text>
              <Text style={styles.chatSubtitle}>{room.subtitle}</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 15,
    color: '#333',
    marginBottom: 18,
    textAlign: 'left',
  },
  chatCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'contain',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 0,
  },
}); 