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
  imageUrl: string | null;
}

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
}

export interface UserDTO {
  id: number;
  fullName: string;
  roleName: string;
  roleId: number | null;
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

export const getUsers = async (): Promise<UserDTO[]> => {
  const response = await axios.get(`${API_URL}/Users`);
  if (!response.data.Success) throw new Error(response.data.Error);
  return response.data.Data.map((u: any) => ({
    id: u.Id,
    fullName: u.FullName,
    roleName: u.Name,
    roleId: u.RoleId
  }));
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
  const formData = new FormData();
  formData.append("Name", data.name || "");
  formData.append("Description", data.description || "");
  formData.append("Price", (data.price || 0).toString());
  formData.append("CategoryId", (data.categoryId || 0).toString());
  if (file) {
    formData.append("Image", file);
  }

  await axios.post(`${API_URL}/MenuItems`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const updateMenuItem = async (id: number, data: Partial<MenuItemDTO>, file?: File): Promise<void> => {
  const formData = new FormData();
  formData.append("Id", id.toString());
  formData.append("CategoryId", (data.categoryId || 0).toString());
  formData.append("Name", data.name || "");
  formData.append("Description", data.description || "");
  formData.append("Price", (data.price || 0).toString());
  if (file) {
    formData.append("Image", file);
  }

  await axios.put(`${API_URL}/MenuItems/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
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

export const updateUser = async (id: number, data: Partial<UserDTO>): Promise<void> => {
  await axios.put(`${API_URL}/Users/${id}`, {
    Id: id,
    FullName: data.fullName || ""
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/Users/${id}`);
};