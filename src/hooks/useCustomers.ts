import { useQuery, useMutation, useQueryClient } from 'react-query';
import { customerAPI } from '../services/api';
import { Customer } from '../types';

export function useCustomers() {
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery('customers', customerAPI.getAll);

  const createCustomer = useMutation(customerAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
    },
  });

  const updateCustomerVisit = useMutation(customerAPI.updateVisit, {
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
    },
  });

  return {
    customers,
    isLoading,
    createCustomer: createCustomer.mutate,
    isCreating: createCustomer.isLoading,
    updateCustomerVisit: updateCustomerVisit.mutate,
    isUpdatingVisit: updateCustomerVisit.isLoading,
  };
}