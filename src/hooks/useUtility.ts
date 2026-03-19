'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useFaq() {
  return useQuery({
    queryKey: ['faq'],
    queryFn: async () => (await api.get('/user/faq')).data,
  });
}

export function useAddressLookup(address: string) {
  return useQuery({
    queryKey: ['address', address],
    queryFn: async () => (await api.get(`/user/address?address=${encodeURIComponent(address)}`)).data,
    enabled: !!address,
  });
}
