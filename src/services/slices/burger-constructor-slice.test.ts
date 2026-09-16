import {
  TConstructorIngredient,
  TConstructorItems,
  TIngredient
} from '@utils-types';
import {
  addIngredient,
  burgerConstructorReducer,
  clearConstructor,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from './burger-constructor-slice';

const bun: TIngredient = {
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
};

const anotherBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png'
};

const main: TIngredient = {
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
};

const sauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
};

const constructorMain: TConstructorIngredient = { ...main, id: 'main-id' };
const constructorSauce: TConstructorIngredient = { ...sauce, id: 'sauce-id' };
const constructorBun: TConstructorIngredient = { ...bun, id: 'bun-id' };

const initialState: TConstructorItems = {
  bun: null,
  ingredients: []
};

const filledState: TConstructorItems = {
  bun: constructorBun,
  ingredients: [constructorMain, constructorSauce]
};

describe('Редьюсер конструктора бургера', () => {
  it('возвращает начальное состояние', () => {
    expect(
      burgerConstructorReducer(undefined, { type: 'UNKNOWN_ACTION' })
    ).toEqual(initialState);
  });

  describe('добавление ингредиента', () => {
    it('добавляет булку и присваивает ей уникальный id', () => {
      const state = burgerConstructorReducer(initialState, addIngredient(bun));

      expect(state.bun).toEqual({ ...bun, id: expect.any(String) });
      expect(state.ingredients).toEqual([]);
    });

    it('заменяет ранее добавленную булку новой', () => {
      const state = burgerConstructorReducer(
        filledState,
        addIngredient(anotherBun)
      );

      expect(state.bun).toEqual({ ...anotherBun, id: expect.any(String) });
      expect(state.ingredients).toEqual(filledState.ingredients);
    });

    it('добавляет начинку в конец списка ингредиентов', () => {
      const state = burgerConstructorReducer(filledState, addIngredient(main));

      expect(state.ingredients).toHaveLength(3);
      expect(state.ingredients[2]).toEqual({ ...main, id: expect.any(String) });
      expect(state.bun).toEqual(constructorBun);
    });

    it('присваивает разные id одинаковым ингредиентам', () => {
      const stateWithFirst = burgerConstructorReducer(
        initialState,
        addIngredient(main)
      );
      const state = burgerConstructorReducer(
        stateWithFirst,
        addIngredient(main)
      );

      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('удаление ингредиента', () => {
    it('удаляет ингредиент по id', () => {
      const state = burgerConstructorReducer(
        filledState,
        removeIngredient(constructorMain.id)
      );

      expect(state.ingredients).toEqual([constructorSauce]);
      expect(state.bun).toEqual(constructorBun);
    });

    it('не меняет список при удалении несуществующего id', () => {
      const state = burgerConstructorReducer(
        filledState,
        removeIngredient('unknown-id')
      );

      expect(state.ingredients).toEqual(filledState.ingredients);
    });
  });

  describe('изменение порядка ингредиентов', () => {
    it('перемещает ингредиент вверх', () => {
      const state = burgerConstructorReducer(filledState, moveIngredientUp(1));

      expect(state.ingredients).toEqual([constructorSauce, constructorMain]);
    });

    it('перемещает ингредиент вниз', () => {
      const state = burgerConstructorReducer(
        filledState,
        moveIngredientDown(0)
      );

      expect(state.ingredients).toEqual([constructorSauce, constructorMain]);
    });
  });

  it('очищает конструктор', () => {
    const state = burgerConstructorReducer(filledState, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
