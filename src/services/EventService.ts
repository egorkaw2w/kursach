// src/services/EventService.ts
import axios from "axios";

const API_URL = "http://localhost:5252/api";

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getEvents = async (): Promise<EventDTO[]> => {
    console.log("getEvents вызван, URL:", `${API_URL}/Events`);
    try {
      const response = await axios.get(`${API_URL}/Events`);
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки мероприятий:", error);
      throw error;
    }
  };