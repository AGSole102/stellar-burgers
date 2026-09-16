import { TUser } from '@utils-types';
import { RootState } from '../store';

export const selectUser = (state: RootState): TUser | null => state.user.user;

export const selectUserName = (state: RootState): string =>
  state.user.user?.name ?? '';

export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;

export const selectUserError = (state: RootState): string | null =>
  state.user.error;
