import axios from "axios";

const API_URL = "http://strhzy.ru:8080/api";

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
  description: string | null;
  imageUrl: string | null;
}

export interface UserDTO {
  id: number;
  login: string;
  fullName: string;
  birthDate: string | null;
  phone: string;
  email: string;
  avatarUrl: string | null;
  roleId: number;
  roleName: string;
  createdAt: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
  slug: string;
}

export interface RoleDTO {
  id: number;
  name: string;
}

export const getMenuItems = async (): Promise<MenuItemDTO[]> => {
  try {
    const response = await axios.get(`${API_URL}/MenuItems`);
    console.log("Response from /api/MenuItems:", response.data);
    if (!Array.isArray(response.data)) {
      console.error("getMenuItems: response.data is not an array:", response.data);
      throw new Error("Invalid data format: MenuItems is not an array");
    }
    return response.data;
  } catch (err) {
    console.error("Error in getMenuItems:", err);
    throw err;
  }
};

export const getEvents = async (): Promise<EventDTO[]> => {
  try {
    const response = await axios.get(`${API_URL}/Events`);
    console.log("Response from /api/Events:", response.data);
    if (!Array.isArray(response.data)) {
      console.error("getEvents: response.data is not an array:", response.data);
      throw new Error("Invalid data format: Events is not an array");
    }
    return response.data;
  } catch (err) {
    console.error("Error in getEvents:", err);
    throw err;
  }
};

export const getUsers = async (): Promise<UserDTO[]> => {
  try {
    const response = await axios.get(`${API_URL}/Users`);
    console.log("Response from /api/Users:", response.data);
    if (!Array.isArray(response.data)) {
      console.error("getUsers: response.data is not an array:", response.data);
      throw new Error("Invalid data format: Users is not an array");
    }
    return response.data;
  } catch (err) {
    console.error("Error in getUsers:", err);
    throw err;
  }
};

export const getCategories = async (): Promise<CategoryDTO[]> => {
  try {
    const response = await axios.get(`${API_URL}/MenuCategories`);
    console.log("Response from /api/MenuCategories in getCategories:", response.data);
    if (!Array.isArray(response.data)) {
      console.error("getCategories: response.data is not an array:", response.data);
      throw new Error("Invalid data format: Categories is not an array");
    }
    return response.data.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));
  } catch (err) {
    console.error("Error in getCategories:", err);
    throw err;
  }
};

export const getRoles = async (): Promise<RoleDTO[]> => {
  try {
    const response = await axios.get(`${API_URL}/Roles`);
    console.log("Response from /api/Roles:", response.data);
    if (!Array.isArray(response.data)) {
      console.error("getRoles: response.data is not an array:", response.data);
      throw new Error("Invalid data format: Roles is not an array");
    }
    return response.data;
  } catch (err) {
    console.error("Error in getRoles:", err);
    throw err;
  }
};

export const createMenuItem = async (data: Partial<MenuItemDTO>): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.post(
      `${API_URL}/MenuItems`,
      {
        Id: data.id || 0,
        Name: data.name || "",
        Description: data.description || "",
        Price: data.price || 0,
        CategoryId: data.categoryId || 0,
        ImageUrl: data.imageUrl || "",
      },
      config
    );
    console.log("Successfully created MenuItem:", data);
  } catch (err) {
    console.error("Error in createMenuItem:", err);
    throw err;
  }
};

export const updateMenuItem = async (id: number, data: Partial<MenuItemDTO>): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.put(
      `${API_URL}/MenuItems/${id}`,
      {
        Id: id,
        CategoryId: data.categoryId || 0,
        Name: data.name || "",
        Description: data.description || "",
        Price: data.price || 0,
        ImageUrl: data.imageUrl || "",
      },
      config
    );
    console.log(`Successfully updated MenuItem with id: ${id}`);
  } catch (err) {
    console.error(`Error in updateMenuItem with id: ${id}`, err);
    throw err;
  }
};

export const deleteMenuItem = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.delete(`${API_URL}/MenuItems/${id}`, config);
    console.log(`Successfully deleted MenuItem with id: ${id}`);
  } catch (err) {
    console.error(`Error in deleteMenuItem with id: ${id}`, err);
    throw err;
  }
};

export const createEvent = async (data: Partial<EventDTO>): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.post(
      `${API_URL}/Events`,
      {
        Title: data.title || "",
        Description: data.description || "",
        ImageUrl: data.imageUrl || "",
      },
      config
    );
    console.log("Successfully created Event:", data);
  } catch (err) {
    console.error("Error in createEvent:", err);
    throw err;
  }
};

export const updateEvent = async (id: number, data: Partial<EventDTO>): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.put(
      `${API_URL}/Events/${id}`,
      {
        Id: id,
        Title: data.title || "",
        Description: data.description || "",
        ImageUrl: data.imageUrl || "",
      },
      config
    );
    console.log(`Successfully updated Event with id: ${id}`);
  } catch (err) {
    console.error(`Error in updateEvent with id: ${id}`, err);
    throw err;
  }
};

export const deleteEvent = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.delete(`${API_URL}/Events/${id}`, config);
    console.log(`Successfully deleted Event with id: ${id}`);
  } catch (err) {
    console.error(`Error in deleteEvent with id: ${id}`, err);
    throw err;
  }
};

export const createUser = async (data: Partial<UserDTO>): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.post(
      `${API_URL}/Users`,
      {
        Login: data.login || "",
        FullName: data.fullName || "",
        BirthDate: data.birthDate || null,
        Phone: data.phone || "",
        Email: data.email || "",
        AvatarUrl: data.avatarUrl || null,
        RoleId: data.roleId || 0,
        PasswordHash: data.password || "", // Сервер ожидает PasswordHash
      },
      config
    );
    console.log("Successfully created User:", data);
  } catch (err) {
    console.error("Error in createUser:", err);
    throw err;
  }
};

export const updateUser = async (id: number, data: Partial<UserDTO>): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.put(
      `${API_URL}/Users/${id}`,
      {
        Id: id,
        Login: data.login || "",
        FullName: data.fullName || "",
        BirthDate: data.birthDate || null,
        Phone: data.phone || "",
        Email: data.email || "",
        AvatarUrl: data.avatarUrl || null,
        RoleId: data.roleId || 0,
      },
      config
    );
    console.log(`Successfully updated User with id: ${id}`);
  } catch (err) {
    console.error(`Error in updateUser with id: ${id}`, err);
    throw err;
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    await axios.delete(`${API_URL}/Users/${id}`, config);
    console.log(`Successfully deleted User with id: ${id}`);
  } catch (err) {
    console.error(`Error in deleteUser with id: ${id}`, err);
    throw err;
  }
};