import { TOrder } from '@utils-types';
import { RootState } from '../store';

export const selectUserOrders = (state: RootState): TOrder[] =>
  state.userOrders.orders;

export const selectUserOrdersLoading = (state: RootState): boolean =>
  state.userOrders.isLoading;
