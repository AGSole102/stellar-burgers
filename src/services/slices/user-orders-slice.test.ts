import { TOrder } from '@utils-types';
import {
  fetchUserOrders,
  TUserOrdersState,
  userOrdersReducer
} from './user-orders-slice';

const requestId = 'test-request-id';
const errorMessage = 'Не удалось загрузить историю заказов';

const orders: TOrder[] = [
  {
    _id: '66e1f4a1119d45001b507a02',
    status: 'pending',
    name: 'Флюоресцентный бургер',
    createdAt: '2026-09-15T11:00:00.000Z',
    updatedAt: '2026-09-15T11:00:01.000Z',
    number: 55002,
    ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d']
  }
];

const initialState: TUserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

describe('Редьюсер истории заказов пользователя', () => {
  it('возвращает начальное состояние', () => {
    expect(userOrdersReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('загрузка истории заказов', () => {
    it('при начале запроса устанавливает isLoading в true и сбрасывает ошибку', () => {
      const state = userOrdersReducer(
        { ...initialState, error: errorMessage },
        fetchUserOrders.pending(requestId)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при успешном запросе записывает заказы и устанавливает isLoading в false', () => {
      const state = userOrdersReducer(
        { ...initialState, isLoading: true },
        fetchUserOrders.fulfilled(orders, requestId)
      );

      expect(state.orders).toEqual(orders);
      expect(state.isLoading).toBe(false);
    });

    it('при ошибке запроса записывает ошибку и устанавливает isLoading в false', () => {
      const state = userOrdersReducer(
        { ...initialState, isLoading: true },
        fetchUserOrders.rejected(null, requestId, undefined, errorMessage)
      );

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });
});
