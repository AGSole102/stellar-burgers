import { TConstructorItems } from '@utils-types';
import { RootState } from '../store';

export const selectConstructorItems = (state: RootState): TConstructorItems =>
  state.burgerConstructor;
