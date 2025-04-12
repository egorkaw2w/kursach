// src/services/AdminService.ts
import axios from "axios";

const API_URL = "http://localhost:5252/api";

export interface MenuItemDTO {
    id: number;
    name: string;
    description: string | null;
    price: number;
    categoryName: string;
    categoryId: number;
    imageUrl: string | null; // Уже подходит
  }

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
}

// src/services/AdminService.ts
export interface UserDTO {
    id: number;
    fullName: string;
    roleName: string;
    roleId: number | null;
    email: string; // Добавляем email
    avatarUrl: string | null; // Добавляем avatarUrl
  }

export interface CategoryDTO {
  id: number;
  name: string;
}

export interface RoleDTO {
  id: number;
  name: string;
}

export const getMenuItems = async (): Promise<MenuItemDTO[]> => {
  const response = await axios.get(`${API_URL}/MenuItems`);
  return response.data;
};

export const getEvents = async (): Promise<EventDTO[]> => {
  const response = await axios.get(`${API_URL}/Events`);
  return response.data;
};

// src/services/AdminService.ts
export const getUsers = async (): Promise<UserDTO[]> => {
    try {
      const response = await axios.get(`${API_URL}/Users`);
      console.log("Response from /api/Users:", response.data);
  
      if (!response.data.success) {
        console.error("API Error in getUsers:", response.data.error || response.data.Error);
        throw new Error(response.data.error || response.data.Error || "Unknown error");
      }
  
      if (!Array.isArray(response.data.data)) {
        console.error("response.data.data is not an array:", response.data.data);
        throw new Error("Invalid data format: data is not an array");
      }
  
      const mappedData = response.data.data.map((u: any) => {
        const user = {
          id: u.id,
          fullName: u.fullName,
          roleName: u.name || "Не указана роль",
          roleId: u.roleId ?? null,
          email: u.email || "", // Добавляем email, с запасным значением
          avatarUrl: u.avatarUrl || null, // Добавляем avatarUrl, с запасным значением
        };
        console.log("Mapped user:", user);
        return user;
      });
      return mappedData;
    } catch (err) {
      console.error("Error in getUsers:", err);
      throw err;
    }
  };

export const getCategories = async (): Promise<CategoryDTO[]> => {
  const response = await axios.get(`${API_URL}/Categories`);
  return response.data;
};

export const getRoles = async (): Promise<RoleDTO[]> => {
  const response = await axios.get(`${API_URL}/Roles`);
  return response.data;
};

export const createMenuItem = async (data: Partial<MenuItemDTO>, file?: File): Promise<void> => {
    await axios.post(`${API_URL}/MenuItems`, {
      Id: data.id || 0,
      Name: data.name || "",
      Description: data.description || "",
      Price: data.price || 0,
      CategoryId: data.categoryId || 0,
      ImageUrl: data.imageUrl || "" // Отправляем imageUrl
    });
  };

  export const updateMenuItem = async (id: number, data: Partial<MenuItemDTO>, file?: File): Promise<void> => {
    await axios.put(`${API_URL}/MenuItems/${id}`, {
      Id: id,
      CategoryId: data.categoryId || 0,
      Name: data.name || "",
      Description: data.description || "",
      Price: data.price || 0,
      ImageUrl: data.imageUrl || "" // Отправляем imageUrl
    });
  };

export const deleteMenuItem = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/MenuItems/${id}`);
};

export const createEvent = async (data: Partial<EventDTO>): Promise<void> => {
  await axios.post(`${API_URL}/Events`, {
    Title: data.title || "",
    Description: data.description || "",
    ImageUrl: data.imageUrl || ""
  });
};

export const updateEvent = async (id: number, data: Partial<EventDTO>): Promise<void> => {
  await axios.put(`${API_URL}/Events/${id}`, {
    Title: data.title || "",
    Description: data.description || "",
    ImageUrl: data.imageUrl || ""
  });
};

export const deleteEvent = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/Events/${id}`);
};

// src/services/AdminService.ts
export const updateUser = async (id: number, data: Partial<UserDTO>): Promise<void> => {
    await axios.put(`${API_URL}/Users/${id}`, {
      Id: id,
      FullName: data.fullName || "",
      Email: data.email || "", // Добавляем email
      AvatarUrl: data.avatarUrl || "" // Добавляем avatarUrl
    });
  };

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/Users/${id}`);
};