import { useQuery, useMutation, useQueryClient } from 'react-query';
import { orderAPI } from '../services/api';
import { Order } from '../types';

export function useOrders() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery('orders', orderAPI.getAll);

  const createOrder = useMutation(orderAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('orders');
    },
  });

  const updateOrderStatus = useMutation(
    ({ orderId, status }: { orderId: string; status: Order['status'] }) =>
      orderAPI.updateStatus(orderId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders');
      },
    }
  );

  return {
    orders,
    isLoading,
    createOrder: createOrder.mutate,
    isCreating: createOrder.isLoading,
    updateOrderStatus: updateOrderStatus.mutate,
    isUpdating: updateOrderStatus.isLoading,
  };
}