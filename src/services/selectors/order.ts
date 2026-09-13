import { TOrder } from '@utils-types';
import { RootState } from '../store';

export const selectOrderRequest = (state: RootState): boolean =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState): TOrder | null =>
  state.order.orderModalData;

export const selectOrderByNumber = (state: RootState): TOrder | null =>
  state.order.orderByNumber;
