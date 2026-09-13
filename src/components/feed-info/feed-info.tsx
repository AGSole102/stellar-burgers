import { FC } from 'react';

import { selectFeed, selectFeedOrders } from '@selectors';
import { TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { FeedInfoUI } from '../ui/feed-info';

const maxOrdersInColumn = 20;

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, maxOrdersInColumn);

export const FeedInfo: FC = () => {
  const orders = useSelector(selectFeedOrders);
  const feed = useSelector(selectFeed);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
