import { TIngredient } from '@utils-types';
import {
  fetchIngredients,
  ingredientsReducer,
  TIngredientsState
} from './ingredients-slice';

const requestId = 'test-request-id';
const errorMessage = 'Не удалось загрузить ингредиенты';

const ingredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
  }
];

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

describe('Редьюсер ингредиентов', () => {
  it('возвращает начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('загрузка ингредиентов', () => {
    it('при начале запроса устанавливает isLoading в true и сбрасывает ошибку', () => {
      const state = ingredientsReducer(
        { ...initialState, error: errorMessage },
        fetchIngredients.pending(requestId)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при успешном запросе записывает ингредиенты и устанавливает isLoading в false', () => {
      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        fetchIngredients.fulfilled(ingredients, requestId)
      );

      expect(state.items).toEqual(ingredients);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('при ошибке запроса записывает ошибку и устанавливает isLoading в false', () => {
      const state = ingredientsReducer(
        { ...initialState, isLoading: true },
        fetchIngredients.rejected(null, requestId, undefined, errorMessage)
      );

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual([]);
    });
  });
});
