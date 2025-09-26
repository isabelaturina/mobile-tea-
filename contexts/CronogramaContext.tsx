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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Erro ao salvar eventos:', error);
    }
  };

  const addEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, ...eventData } : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const refreshEvents = async () => {
    await loadEvents();
  };

  return (
    <CronogramaContext.Provider
      value={{
        events,
        isLoading,
        addEvent,
        updateEvent,
        deleteEvent,
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
