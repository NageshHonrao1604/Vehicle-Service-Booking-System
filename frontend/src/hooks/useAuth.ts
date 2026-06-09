import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@features/auth/authSlice';
import { RootState } from '@app/store';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  return {
    isAuthenticated,
    user,
    loading,
    logout: () => dispatch(logout()),
    hasRole: (role: string) => user?.role === role,
  };
};
