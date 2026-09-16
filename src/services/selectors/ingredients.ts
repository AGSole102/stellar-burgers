import { createSelector } from '@reduxjs/toolkit';

import { TIngredient } from '@utils-types';
import { RootState } from '../store';

const bunType = 'bun';
const mainType = 'main';
const sauceType = 'sauce';

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;

export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;

const selectIngredientsByType = (type: string) =>
  createSelector([selectIngredients], (ingredients) =>
    ingredients.filter((ingredient) => ingredient.type === type)
  );

export const selectBuns = selectIngredientsByType(bunType);
export const selectMains = selectIngredientsByType(mainType);
export const selectSauces = selectIngredientsByType(sauceType);

export const selectIngredientById =
  (id: string) =>
  (state: RootState): TIngredient | undefined =>
    state.ingredients.items.find((ingredient) => ingredient._id === id);
