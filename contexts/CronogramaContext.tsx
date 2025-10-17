import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { NotificationService } from '../services/notificationService';

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

export interface DiaryEntry {
  id: string;
  date: string;
  mood: string;
  note: string;
  createdAt: string;
}

interface CronogramaContextType {
  events: Event[];
  diaryEntries: DiaryEntry[];
  isLoading: boolean;
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  forceDeleteEvent: (id: string) => Promise<void>;
  getEventsForDate: (date: string) => Event[];
  refreshEvents: () => Promise<void>;
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => void;
  getDiaryEntryForDate: (date: string) => DiaryEntry | null;
  updateDiaryEntry: (id: string, entry: Partial<DiaryEntry>) => void;
  deleteDiaryEntry: (id: string) => void;
  forceDeleteDiaryEntry: (id: string) => Promise<void>;
}

const CronogramaContext = createContext<CronogramaContextType | undefined>(undefined);

interface CronogramaProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = '@cronograma_events';
const DIARY_STORAGE_KEY = '@cronograma_diary_entries';

export function CronogramaProvider({ children }: CronogramaProviderProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar eventos e entradas do diário ao inicializar
  useEffect(() => {
    loadEvents();
    loadDiaryEntries();
  }, []);

  // Salvar eventos e entradas do diário sempre que as listas mudarem
  useEffect(() => {
    if (!isLoading) {
      saveEvents();
      saveDiaryEntries();
    }
  }, [events, diaryEntries, isLoading]);

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

  const loadDiaryEntries = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem(DIARY_STORAGE_KEY);
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries);
        setDiaryEntries(parsedEntries);
      } else {
        setDiaryEntries([]);
      }
    } catch (error) {
      console.error('Erro ao carregar entradas do diário:', error);
      setDiaryEntries([]);
    }
  };

  const saveDiaryEntries = async () => {
    try {
      console.log('Salvando entradas do diário no AsyncStorage:', diaryEntries);
      await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(diaryEntries));
      console.log('Entradas do diário salvas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar entradas do diário:', error);
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

      // Encontrar o evento antes de excluir para cancelar notificação
      const eventToDelete = events.find(event => event.id === id);
      if (eventToDelete && eventToDelete.hasAlarm) {
        // Cancelar notificação se existir
        await NotificationService.cancelNotification(eventToDelete.title + eventToDelete.date);
        console.log('Notificação cancelada para evento:', eventToDelete.title);
      }


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


  const addDiaryEntry = (entryData: Omit<DiaryEntry, 'id' | 'createdAt'>) => {
    const newEntry: DiaryEntry = {
      ...entryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    console.log('Adicionando entrada do diário:', newEntry);
    setDiaryEntries(prev => {
      // Remove entrada existente para a mesma data se houver
      const filtered = prev.filter(entry => entry.date !== entryData.date);
      const updated = [...filtered, newEntry];
      console.log('Lista de entradas do diário atualizada:', updated);
      return updated;
    });
  };

  const getDiaryEntryForDate = (date: string) => {
    return diaryEntries.find(entry => entry.date === date) || null;
  };

  const updateDiaryEntry = (id: string, entryData: Partial<DiaryEntry>) => {
    console.log('Atualizando entrada do diário:', id, entryData);
    setDiaryEntries(prev => {
      const updated = prev.map(entry => 
        entry.id === id ? { ...entry, ...entryData } : entry
      );
      console.log('Lista de entradas do diário após atualização:', updated);
      
      // Salva imediatamente no AsyncStorage
      AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(updated))
        .then(() => console.log('Entrada do diário atualizada salva no AsyncStorage'))
        .catch(error => console.error('Erro ao salvar atualização da entrada:', error));
      
      return updated;
    });
  };

  const deleteDiaryEntry = (id: string) => {
    console.log('Excluindo entrada do diário com ID:', id);
    setDiaryEntries(prev => {
      const updated = prev.filter(entry => entry.id !== id);
      console.log('Lista de entradas do diário após exclusão:', updated);
      
      // Salva imediatamente no AsyncStorage
      AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(updated))
        .then(() => console.log('Exclusão da entrada do diário salva no AsyncStorage'))
        .catch(error => console.error('Erro ao salvar exclusão da entrada:', error));
      
      return updated;
    });
  };

  const forceDeleteDiaryEntry = async (id: string) => {
    console.log('Forçando exclusão da entrada do diário:', id);
    try {
      // Remove do estado atual
      const updatedEntries = diaryEntries.filter(entry => entry.id !== id);
      console.log('Lista após filtro:', updatedEntries);
      
      // Atualiza o estado
      setDiaryEntries(updatedEntries);
      
      // Salva imediatamente no AsyncStorage
      await AsyncStorage.setItem(DIARY_STORAGE_KEY, JSON.stringify(updatedEntries));
      console.log('Exclusão forçada da entrada concluída e salva no AsyncStorage');
      
      // Força um refresh para garantir consistência
      setTimeout(() => {
        loadDiaryEntries();
      }, 100);
      
    } catch (error) {
      console.error('Erro na exclusão forçada da entrada:', error);
      throw error;
    }
  };


  return (
    <CronogramaContext.Provider
      value={{
        events,
        diaryEntries,
        isLoading,
        addEvent,
        updateEvent,
        deleteEvent,
        forceDeleteEvent,
        getEventsForDate,
        refreshEvents,
        addDiaryEntry,
        getDiaryEntryForDate,
        updateDiaryEntry,
        deleteDiaryEntry,
        forceDeleteDiaryEntry,
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
