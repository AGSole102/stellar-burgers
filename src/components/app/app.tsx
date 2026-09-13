import { FC, useEffect } from 'react';
import {
  Location,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { checkUserAuth, fetchIngredients } from '@slices';
import { useDispatch } from '../../services/store';

const orderNumberLength = 6;

const formatOrderNumber = (number?: string): string =>
  `#${(number ?? '').padStart(orderNumberLength, '0')}`;

const OrderDetailPage: FC = () => {
  const { number } = useParams();

  return (
    <div className={styles.detailPageWrap}>
      <p className={`text text_type_digits-default ${styles.detailHeader}`}>
        {formatOrderNumber(number)}
      </p>
      <OrderInfo />
    </div>
  );
};

const IngredientDetailPage: FC = () => (
  <div className={styles.detailPageWrap}>
    <p className={`text text_type_main-large ${styles.detailHeader}`}>
      Детали ингредиента
    </p>
    <IngredientDetails />
  </div>
);

const OrderModal: FC<{ onClose: () => void }> = ({ onClose }) => {
  const { number } = useParams();

  return (
    <Modal title={formatOrderNumber(number)} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const backgroundLocation = (location.state as { background?: Location })
    ?.background;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const closeModal = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderDetailPage />} />
        <Route path='/ingredients/:id' element={<IngredientDetailPage />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={<OrderModal onClose={closeModal} />}
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <OrderModal onClose={closeModal} />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
