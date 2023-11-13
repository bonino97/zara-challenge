import { lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { paths } from './paths';

const Home = lazy(() => import('#/pages/home/home'));

const AppRoutes: React.FC = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route path={paths.home} element={<Home />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default AppRoutes;
