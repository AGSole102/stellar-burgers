import { TOrder } from '@utils-types';
import { feedReducer, fetchFeeds, TFeedState } from './feed-slice';

const requestId = 'test-request-id';
const errorMessage = 'Не удалось загрузить ленту заказов';

const orders: TOrder[] = [
  {
    _id: '66e1f4a1119d45001b507a01',
    status: 'done',
    name: 'Краторный био-марсианский бургер',
    createdAt: '2026-09-15T10:00:00.000Z',
    updatedAt: '2026-09-15T10:00:01.000Z',
    number: 55001,
    ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941']
  }
];

const feed = {
  orders,
  total: 10757,
  totalToday: 29
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

describe('Редьюсер ленты заказов', () => {
  it('возвращает начальное состояние', () => {
    expect(feedReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('загрузка ленты', () => {
    it('при начале запроса устанавливает isLoading в true и сбрасывает ошибку', () => {
      const state = feedReducer(
        { ...initialState, error: errorMessage },
        fetchFeeds.pending(requestId)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при успешном запросе записывает заказы и счётчики и устанавливает isLoading в false', () => {
      const state = feedReducer(
        { ...initialState, isLoading: true },
        fetchFeeds.fulfilled(feed, requestId)
      );

      expect(state.orders).toEqual(orders);
      expect(state.total).toBe(feed.total);
      expect(state.totalToday).toBe(feed.totalToday);
      expect(state.isLoading).toBe(false);
    });

    it('при ошибке запроса записывает ошибку и устанавливает isLoading в false', () => {
      const state = feedReducer(
        { ...initialState, isLoading: true },
        fetchFeeds.rejected(null, requestId, undefined, errorMessage)
      );

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });
  });
});
