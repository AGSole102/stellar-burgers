import { FC } from 'react';
import { Location, Navigate, useLocation } from 'react-router-dom';

import { selectIsAuthChecked, selectUser } from '@selectors';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { ProtectedRouteProps } from './type';

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const { from } = (location.state as { from?: Location }) ?? {};
    return <Navigate to={from ?? '/'} replace />;
  }

  return children;
};
