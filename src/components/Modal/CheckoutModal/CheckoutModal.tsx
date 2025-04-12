import { useState, useEffect } from 'react';
import { useAuth } from 'src/app/lib/AuthContext';
import { getUserAddresses, addAddress, createOrder, getCartItems } from 'src/services/CartService';
import './CheckoutModal.scss';

type CheckoutModalProps = {
  cartId: number;
  onClose: () => void;
  onOrderSuccess: () => void;
};

const CheckoutModal = ({ cartId, onClose, onOrderSuccess }: CheckoutModalProps) => {
  const { userId } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) return;
      try {
        const data = await getUserAddresses(userId);
        setAddresses(data);
        const defaultAddress = data.find((addr: any) => addr.isDefault);
        if (defaultAddress) setSelectedAddressId(defaultAddress.id);
      } catch (err) {
        setError('Ошибка загрузки адресов');
        console.error(err);
      }
    };

    fetchAddresses();
  }, [userId]);

  const handleAddAddress = async () => {
    if (!newAddress.trim()) {
      alert('Введите адрес');
      return;
    }
    if (!userId) return;

    try {
      const addedAddress = await addAddress(userId, newAddress);
      setAddresses([...addresses, addedAddress]);
      setSelectedAddressId(addedAddress.id);
      setNewAddress('');
    } catch (err) {
      console.error('Ошибка добавления адреса:', err);
      alert('Не удалось добавить адрес');
    }
  };

  const handleCheckout = async () => {
    if (!userId || !selectedAddressId) {
      alert('Выберите адрес доставки');
      return;
    }

    setLoading(true);
    try {
      const cartItems = await getCartItems(cartId);
      await createOrder(userId, selectedAddressId, cartItems);
      alert('Заказ успешно оформлен!');
      onOrderSuccess();
      onClose();
    } catch (err) {
      console.error('Ошибка оформления заказа:', err);
      alert('Не удалось оформить заказ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="CheckoutModal-overlay" onClick={onClose}>
      <div className="CheckoutModal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Оформление заказа</h2>
        {error && <p className="error">{error}</p>}
        <div className="address-section">
          <h3>Выберите адрес доставки</h3>
          {addresses.length > 0 ? (
            <select
              value={selectedAddressId || ''}
              onChange={(e) => setSelectedAddressId(Number(e.target.value))}
            >
              <option value="">Выберите адрес</option>
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.addressText}
                </option>
              ))}
            </select>
          ) : (
            <p>Адреса отсутствуют. Добавьте новый адрес.</p>
          )}
          <div className="new-address">
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Введите новый адрес"
            />
            <button onClick={handleAddAddress}>Добавить адрес</button>
          </div>
        </div>
        <div className="actions">
          <button onClick={onClose} disabled={loading}>
            Отмена
          </button>
          <button onClick={handleCheckout} disabled={loading || !selectedAddressId}>
            {loading ? 'Оформление...' : 'Оформить заказ'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;