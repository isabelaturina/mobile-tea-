import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Verificar se está rodando no Expo Go
const isExpoGo = __DEV__ && typeof expo !== 'undefined';

// Configurar como as notificações devem ser tratadas quando o app está em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  date: string;
  time: string;
}

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      // No Expo Go, apenas notificações locais são suportadas
      if (isExpoGo) {
        console.log('Rodando no Expo Go - usando apenas notificações locais');
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          console.log('Permissão de notificação negada');
          return false;
        }

        // Configurar canal para Android
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#3B82F6',
          });
        }

        return true;
      }

      // Para development builds, usar push notifications
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permissão de notificação negada');
        return false;
      }

      // Para Android, também precisamos configurar o canal de notificação
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#3B82F6',
        });
      }

      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões de notificação:', error);
      return false;
    }
  }

  static async scheduleEventNotification(eventData: NotificationData): Promise<string | null> {
    try {
      // Verificar permissões primeiro
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Permissão de notificação não concedida');
      }

      // Criar a data e hora da notificação
      const [year, month, day] = eventData.date.split('-').map(Number);
      const [hours, minutes] = eventData.time.split(':').map(Number);
      
      const notificationDate = new Date(year, month - 1, day, hours, minutes);
      
      // Verificar se a data não é no passado
      if (notificationDate <= new Date()) {
        throw new Error('Não é possível agendar notificação para o passado');
      }

      // Cancelar notificações existentes para este evento (se houver)
      await this.cancelNotification(eventData.title + eventData.date);

      // Agendar a notificação
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `📅 ${eventData.title}`,
          body: eventData.body || 'Lembrete de evento',
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: {
            eventTitle: eventData.title,
            eventDate: eventData.date,
            eventTime: eventData.time,
          },
        },
        trigger: {
          date: notificationDate,
        } as any,
        identifier: eventData.title + eventData.date, // ID único para poder cancelar depois
      });

      console.log('Notificação agendada com ID:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
      return null;
    }
  }

  static async cancelNotification(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log('Notificação cancelada:', identifier);
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Todas as notificações foram canceladas');
    } catch (error) {
      console.error('Erro ao cancelar todas as notificações:', error);
    }
  }

  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Erro ao obter notificações agendadas:', error);
      return [];
    }
  }
}
