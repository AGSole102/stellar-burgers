import { createSelector } from '@reduxjs/toolkit';

import { TFeed, TOrder } from '@utils-types';
import { RootState } from '../store';

export const selectFeedOrders = (state: RootState): TOrder[] =>
  state.feed.orders;

export const selectFeedLoading = (state: RootState): boolean =>
  state.feed.isLoading;

export const selectFeed = createSelector(
  [
    (state: RootState) => state.feed.total,
    (state: RootState) => state.feed.totalToday
  ],
  (total, totalToday): TFeed => ({ total, totalToday })
);
