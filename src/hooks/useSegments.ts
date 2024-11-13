import { useQuery, useMutation, useQueryClient } from 'react-query';
import { segmentAPI } from '../services/api';
import { Segment } from '../types';

export default function useSegments() {
  const queryClient = useQueryClient();

  const { data: segments = [], isLoading, error } = useQuery<Segment[]>('segments', segmentAPI.getAll);

  const createSegment = useMutation(segmentAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('segments');
    },
  });

  return {
    segments,
    isLoading,
    error,
    createSegment: createSegment.mutate,
    isCreating: createSegment.isLoading,
  };
}
