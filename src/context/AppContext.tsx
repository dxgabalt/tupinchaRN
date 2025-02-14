import React, {createContext, useContext, useState} from 'react';

// Tipos básicos de datos
interface Order {
  id: string;
  concreteType: string;
  volume: number;
  plant: string;
  deliveryDate: string;
  comments: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'in-progress';
}

// Definimos la estructura del contexto
interface AppContextProps {
  user: {id: string; name: string} | null;
  setUser: (user: {id: string; name: string} | null) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<{id: string; name: string} | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  return (
    <AppContext.Provider value={{user, setUser, orders, setOrders}}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar el contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error('useAppContext debe ser usado dentro de AppProvider');
  return context;
};
