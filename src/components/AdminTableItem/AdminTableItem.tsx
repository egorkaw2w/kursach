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

  console.log(`AdminTableItem rendering for ${category}, bdItem:`, bdItem);

  useEffect(() => {
    setReadOnlyItem(true);
    setItemState(bdItem);
    if ('roleName' in bdItem) {
      console.log("Fetching roles for user:", bdItem);
      getRoles()
        .then((fetchedRoles) => {
          console.log("Roles fetched:", fetchedRoles);
          setRoles(fetchedRoles);
        })
        .catch((err) => console.error("Error fetching roles:", err));
    }
  }, [bdItem]);

  const keys = Object.keys(bdItem).filter(key => key !== "id" && key !== "categoryId" && key !== "roleId");
  console.log("Keys for rendering:", keys);
  const columnCount = keys.length + 1;

  const handleInputChange = (key: string, value: string) => {
    console.log(`Input change - ${key}:`, value);
    setItemState(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectChange = (key: string, id: number | null) => {
    console.log(`Select change - ${key}:`, id);
    setItemState(prev => ({
      ...prev,
      [key]: key === "categoryName" ? categories.find(c => c.id === id)?.name || "" : roles.find(r => r.id === id)?.name || "",
      [key === "categoryName" ? "categoryId" : "roleId"]: id ?? 0,
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      if ('categoryName' in itemState) {
        console.log("Saving MenuItem:", itemState);
        await updateMenuItem((itemState as MenuItemDTO).id, itemState as MenuItemDTO);
      } else if ('roleName' in itemState) {
        console.log("Saving User:", itemState);
        await updateUser((itemState as UserDTO).id, itemState as UserDTO);
      } else if ('title' in itemState) {
        console.log("Saving Event:", itemState);
        await updateEvent((itemState as EventDTO).id, itemState as EventDTO);
      }
      setReadOnlyItem(true);
      onUpdate(category);
    } catch (err: any) {
      console.error("Error in handleSave:", err);
      setError(err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : "Ошибка сохранения");
    }
  };

  const handleDelete = async () => {
    try {
      setError(null);
      if ('categoryName' in bdItem) {
        console.log("Deleting MenuItem:", bdItem);
        await deleteMenuItem((bdItem as MenuItemDTO).id);
      } else if ('roleName' in bdItem) {
        console.log("Deleting User:", bdItem);
        await deleteUser((bdItem as UserDTO).id);
      } else if ('title' in bdItem) {
        console.log("Deleting Event:", bdItem);
        await deleteEvent((bdItem as EventDTO).id);
      }
      onUpdate(category);
    } catch (err: any) {
      console.error("Error in handleDelete:", err);
      setError(err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : "Ошибка удаления");
    }
  };

  return (
    <div className={`admin-table-item py-1 gap-1 grid-cols-${columnCount}`}>
      {error && <div className="error">{error}</div>}
      {keys.map((key, index) => (
        <div key={index} className="grid-item">
          {(key === "categoryName" || key === "roleName") && !readOnlyItem ? (
            <select
              value={key === "categoryName" ? (itemState as MenuItemDTO).categoryId ?? 0 : (itemState as UserDTO).roleId ?? 0}
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