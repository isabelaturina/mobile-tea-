import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface Event {
  id: string;
  title: string;
  note: string;
  time: string;
  date: string;
  hasAlarm?: boolean;
  alarmTime?: string;
  repeatAlarm?: boolean;
}

interface CronogramaContextType {
  events: Event[];
  isLoading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  forceDeleteEvent: (id: string) => Promise<void>;
  getEventsForDate: (date: string) => Event[];
  refreshEvents: () => Promise<void>;
}

const CronogramaContext = createContext<CronogramaContextType | undefined>(undefined);

interface CronogramaProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = '@cronograma_events';

export function CronogramaProvider({ children }: CronogramaProviderProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar eventos salvos ao inicializar
  useEffect(() => {
    loadEvents();
  }, []);

  // Salvar eventos sempre que a lista mudar
  useEffect(() => {
    if (!isLoading) {
      saveEvents();
    }
  }, [events, isLoading]);

  const loadEvents = async () => {
    try {
      const savedEvents = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        setEvents(parsedEvents);
      } else {
        // Evento de exemplo se não houver dados salvos
        const exampleEvent: Event = {
          id: "1",
          title: "Fonoaudiologo",
          note: "com a doutora patricia",
          time: "08:00",
          date: new Date().toISOString().split("T")[0], // hoje
          hasAlarm: true,
          alarmTime: "08:00",
          repeatAlarm: false,
        };
        setEvents([exampleEvent]);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEvents = async () => {
    try {
      console.log('Salvando eventos no AsyncStorage:', events);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      console.log('Eventos salvos com sucesso');
    } catch (error) {
      console.error('Erro ao salvar eventos:', error);
    }
  };

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
    };
    console.log('Adicionando evento:', newEvent);
    setEvents(prev => {
      const updated = [...prev, newEvent];
      console.log('Lista de eventos atualizada:', updated);
      return updated;
    });
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    console.log('Atualizando evento:', id, eventData);
    setEvents(prev => {
      const updated = prev.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      );
      console.log('Lista de eventos após atualização:', updated);
      
      // Salva imediatamente no AsyncStorage
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        .then(() => console.log('Evento atualizado salvo no AsyncStorage'))
        .catch(error => console.error('Erro ao salvar atualização:', error));
      
      return updated;
    });
  };

  const deleteEvent = (id: string) => {
    console.log('Excluindo evento com ID:', id);
    console.log('Lista atual de eventos:', events);
    
    setEvents(prev => {
      const updated = prev.filter(event => {
        console.log('Comparando evento ID:', event.id, 'com ID para exclusão:', id);
        return event.id !== id;
      });
      console.log('Lista de eventos após exclusão:', updated);
      return updated;
    });
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const refreshEvents = async () => {
    console.log('Forçando refresh dos eventos...');
    await loadEvents();
  };

  const forceDeleteEvent = async (id: string) => {
    console.log('Forçando exclusão do evento:', id);
    try {
      // Remove do estado atual
      const updatedEvents = events.filter(event => event.id !== id);
      console.log('Lista após filtro:', updatedEvents);
      
      // Atualiza o estado
      setEvents(updatedEvents);
      
      // Salva imediatamente no AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      console.log('Exclusão forçada concluída e salva no AsyncStorage');
      
      // Força um refresh para garantir consistência
      setTimeout(() => {
        loadEvents();
      }, 100);
      
    } catch (error) {
      console.error('Erro na exclusão forçada:', error);
      throw error;
    }
  };

  return (
    <CronogramaContext.Provider
      value={{
        events,
        isLoading,
        addEvent,
        updateEvent,
        deleteEvent,
        forceDeleteEvent,
        getEventsForDate,
        refreshEvents,
      }}
    >
      {children}
    </CronogramaContext.Provider>
  );
}

export function useCronograma() {
  const context = useContext(CronogramaContext);
  if (context === undefined) {
    throw new Error('useCronograma must be used within a CronogramaProvider');
  }
  return context;
}
