import { TOrder } from '@utils-types';
import {
  clearOrderModalData,
  createOrder,
  fetchOrderByNumber,
  orderReducer,
  TOrderState
} from './order-slice';

const requestId = 'test-request-id';
const errorMessage = 'Не удалось оформить заказ';

const ingredientIds = [
  '643d69a5c3f7b9001cfa093c',
  '643d69a5c3f7b9001cfa0941',
  '643d69a5c3f7b9001cfa093c'
];

const order: TOrder = {
  _id: '66e1f4a1119d45001b507a03',
  status: 'done',
  name: 'Краторный био-марсианский бургер',
  createdAt: '2026-09-15T12:00:00.000Z',
  updatedAt: '2026-09-15T12:00:01.000Z',
  number: 55003,
  ingredients: ingredientIds
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderByNumber: null,
  isOrderByNumberLoading: false,
  error: null
};

describe('Редьюсер заказа', () => {
  it('возвращает начальное состояние', () => {
    expect(orderReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('создание заказа', () => {
    it('при начале запроса устанавливает orderRequest в true и сбрасывает ошибку', () => {
      const state = orderReducer(
        { ...initialState, error: errorMessage },
        createOrder.pending(requestId, ingredientIds)
      );

      expect(state.orderRequest).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при успешном запросе записывает заказ и устанавливает orderRequest в false', () => {
      const state = orderReducer(
        { ...initialState, orderRequest: true },
        createOrder.fulfilled(order, requestId, ingredientIds)
      );

      expect(state.orderModalData).toEqual(order);
      expect(state.orderRequest).toBe(false);
    });

    it('при ошибке запроса записывает ошибку и устанавливает orderRequest в false', () => {
      const state = orderReducer(
        { ...initialState, orderRequest: true },
        createOrder.rejected(null, requestId, ingredientIds, errorMessage)
      );

      expect(state.error).toBe(errorMessage);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });
  });

  describe('загрузка заказа по номеру', () => {
    it('при начале запроса устанавливает isOrderByNumberLoading в true', () => {
      const state = orderReducer(
        initialState,
        fetchOrderByNumber.pending(requestId, order.number)
      );

      expect(state.isOrderByNumberLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при успешном запросе записывает заказ и устанавливает isOrderByNumberLoading в false', () => {
      const state = orderReducer(
        { ...initialState, isOrderByNumberLoading: true },
        fetchOrderByNumber.fulfilled(order, requestId, order.number)
      );

      expect(state.orderByNumber).toEqual(order);
      expect(state.isOrderByNumberLoading).toBe(false);
    });

    it('при ошибке запроса записывает ошибку и устанавливает isOrderByNumberLoading в false', () => {
      const state = orderReducer(
        { ...initialState, isOrderByNumberLoading: true },
        fetchOrderByNumber.rejected(null, requestId, order.number, errorMessage)
      );

      expect(state.error).toBe(errorMessage);
      expect(state.isOrderByNumberLoading).toBe(false);
    });
  });

  it('очищает данные модального окна заказа', () => {
    const state = orderReducer(
      { ...initialState, orderModalData: order, error: errorMessage },
      clearOrderModalData()
    );

    expect(state.orderModalData).toBeNull();
    expect(state.error).toBeNull();
  });
});
