import { TUser } from '@utils-types';
import {
  checkUserAuth,
  clearUserError,
  loginUser,
  logoutUser,
  registerUser,
  TUserState,
  updateUser,
  userReducer
} from './user-slice';

const requestId = 'test-request-id';
const errorMessage = 'email or password are incorrect';

const user: TUser = {
  email: 'test@example.com',
  name: 'Тестовый пользователь'
};

const loginData = {
  email: user.email,
  password: 'password'
};

const registerData = {
  ...loginData,
  name: user.name
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

const authorizedState: TUserState = {
  ...initialState,
  user,
  isAuthChecked: true
};

describe('Редьюсер пользователя', () => {
  it('возвращает начальное состояние', () => {
    expect(userReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(
      initialState
    );
  });

  describe('проверка авторизации', () => {
    it('при начале запроса устанавливает isLoading в true', () => {
      const state = userReducer(initialState, checkUserAuth.pending(requestId));

      expect(state.isLoading).toBe(true);
      expect(state.isAuthChecked).toBe(false);
    });

    it('при успешном запросе записывает пользователя и отмечает проверку авторизации', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        checkUserAuth.fulfilled(user, requestId)
      );

      expect(state.user).toEqual(user);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('без токена отмечает проверку авторизации и оставляет пользователя пустым', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        checkUserAuth.fulfilled(null, requestId)
      );

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });

    it('при ошибке запроса отмечает проверку авторизации и сбрасывает пользователя', () => {
      const state = userReducer(
        { ...authorizedState, isLoading: true },
        checkUserAuth.rejected(null, requestId, undefined, errorMessage)
      );

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('регистрация', () => {
    it('при начале запроса устанавливает isLoading в true и сбрасывает ошибку', () => {
      const state = userReducer(
        { ...initialState, error: errorMessage },
        registerUser.pending(requestId, registerData)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при успешном запросе записывает пользователя', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        registerUser.fulfilled(user, requestId, registerData)
      );

      expect(state.user).toEqual(user);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('при ошибке запроса записывает ошибку', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        registerUser.rejected(null, requestId, registerData, errorMessage)
      );

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('вход', () => {
    it('при начале запроса устанавливает isLoading в true и сбрасывает ошибку', () => {
      const state = userReducer(
        { ...initialState, error: errorMessage },
        loginUser.pending(requestId, loginData)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при успешном запросе записывает пользователя', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        loginUser.fulfilled(user, requestId, loginData)
      );

      expect(state.user).toEqual(user);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('при ошибке запроса записывает ошибку', () => {
      const state = userReducer(
        { ...initialState, isLoading: true },
        loginUser.rejected(null, requestId, loginData, errorMessage)
      );

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('обновление данных пользователя', () => {
    const updatedUser: TUser = { ...user, name: 'Новое имя' };

    it('при начале запроса устанавливает isLoading в true', () => {
      const state = userReducer(
        authorizedState,
        updateUser.pending(requestId, updatedUser)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('при успешном запросе записывает обновлённого пользователя', () => {
      const state = userReducer(
        { ...authorizedState, isLoading: true },
        updateUser.fulfilled(updatedUser, requestId, updatedUser)
      );

      expect(state.user).toEqual(updatedUser);
      expect(state.isLoading).toBe(false);
    });

    it('при ошибке запроса записывает ошибку и сохраняет прежние данные', () => {
      const state = userReducer(
        { ...authorizedState, isLoading: true },
        updateUser.rejected(null, requestId, updatedUser, errorMessage)
      );

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(user);
    });
  });

  describe('выход', () => {
    it('при успешном запросе удаляет данные пользователя', () => {
      const state = userReducer(
        { ...authorizedState, error: errorMessage },
        logoutUser.fulfilled(undefined, requestId)
      );

      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
    });

    it('при ошибке запроса записывает ошибку и сохраняет пользователя', () => {
      const state = userReducer(
        authorizedState,
        logoutUser.rejected(null, requestId, undefined, errorMessage)
      );

      expect(state.error).toBe(errorMessage);
      expect(state.user).toEqual(user);
    });
  });

  it('сбрасывает ошибку', () => {
    const state = userReducer(
      { ...initialState, error: errorMessage },
      clearUserError()
    );

    expect(state.error).toBeNull();
  });
});
