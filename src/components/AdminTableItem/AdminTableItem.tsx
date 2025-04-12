// src/components/AdminTableItem/AdminTableItem.tsx
'use client';
import { useEffect, useState } from "react";
import "./AdminTableItem.scss";
import { getRoles, CategoryDTO, RoleDTO, updateMenuItem, deleteMenuItem, updateUser, deleteUser, updateEvent, deleteEvent, MenuItemDTO, EventDTO, UserDTO } from "src/services/AdminService";

type AdminTableItemProps = {
  bdItem: MenuItemDTO | EventDTO | UserDTO;
  onUpdate: (category: string) => void;
  category: string;
  categories: CategoryDTO[];
};

const AdminTableItem = ({ bdItem, onUpdate, category, categories }: AdminTableItemProps) => {
  const [readOnlyItem, setReadOnlyItem] = useState(true);
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [itemState, setItemState] = useState(bdItem);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setReadOnlyItem(true);
    setItemState(bdItem);
    setSelectedFile(null);
    if ('roleName' in bdItem) {
      getRoles().then(setRoles).catch(console.error);
    }
  }, [bdItem]);

  const keys = Object.keys(bdItem).filter(key => key !== "id" && key !== "categoryId" && key !== "roleId");
  const columnCount = keys.length + 1;

  const handleInputChange = (key: string, value: string) => {
    setItemState(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input event:", e.target.files);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("Selected file:", {
        name: file.name,
        size: file.size,
        type: file.type
      });
      if (file.size > 5 * 1024 * 1024) {
        setError("Файл слишком большой, максимум 5 МБ");
        return;
      }
      setSelectedFile(file);
    } else {
      console.log("No file selected");
      setSelectedFile(null);
    }
  };

  const handleSelectChange = (key: string, id: number | null) => {
    setItemState(prev => ({
      ...prev,
      [key]: key === "categoryName" ? categories.find(c => c.id === id)?.name || "" : roles.find(r => r.id === id)?.name || "",
      [key === "categoryName" ? "categoryId" : "roleId"]: id ?? 0
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      if ('categoryName' in itemState) {
        await updateMenuItem((itemState as MenuItemDTO).id, itemState as MenuItemDTO, selectedFile || undefined);
      } else if ('roleName' in itemState) {
        await updateUser((itemState as UserDTO).id, itemState as UserDTO);
      } else if ('title' in itemState) {
        await updateEvent((itemState as EventDTO).id, itemState as EventDTO);
      }
      setReadOnlyItem(true);
      setSelectedFile(null);
      onUpdate(category);
    } catch (err: any) {
      setError(err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : "Ошибка сохранения");
    }
  };

  const handleDelete = async () => {
    try {
      setError(null);
      if ('categoryName' in bdItem) {
        await deleteMenuItem((bdItem as MenuItemDTO).id);
      } else if ('roleName' in bdItem) {
        await deleteUser((bdItem as UserDTO).id);
      } else if ('title' in bdItem) {
        await deleteEvent((bdItem as EventDTO).id);
      }
      onUpdate(category);
    } catch (err: any) {
      setError(err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : "Ошибка удаления");
    }
  };

  return (
    <div className={`admin-table-item py-1 gap-1 grid-cols-${columnCount}`}>
      {error && <div className="error">{error}</div>}
      {keys.map((key, index) => (
        <div key={index} className="grid-item">
          {key === "imageUrl" && !readOnlyItem && 'categoryName' in bdItem ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="Editable"
            />
          ) : (key === "categoryName" || key === "roleName") && !readOnlyItem ? (
            <select
              value={key === "categoryName" ? (itemState as MenuItemDTO).categoryId || 0 : (itemState as UserDTO).roleId || 0}
              onChange={(e) => handleSelectChange(key, e.target.value ? parseInt(e.target.value) : null)}
              className="Editable"
            >
              <option value={0}>Выберите...</option>
              {(key === "categoryName" ? categories : roles).map(option => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          ) : (
            <input
              className={`grid-item ${readOnlyItem ? "" : "Editable"}`}
              value={(itemState as any)[key] ?? ''}
              onChange={(e) => handleInputChange(key, e.target.value)}
              readOnly={readOnlyItem}
            />
          )}
        </div>
      ))}
      <div className="ActionsBtnArea gap-2 grid-cols-2">
        <button className="ChangeBtn" onClick={readOnlyItem ? () => setReadOnlyItem(false) : handleSave}>
          {readOnlyItem ? "Изменить" : "Сохранить"}
        </button>
        <button className="DeleteBtn" onClick={handleDelete}>Удалить</button>
      </div>
    </div>
  );
};

export default AdminTableItem;