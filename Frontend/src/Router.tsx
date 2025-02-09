import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Settings } from './pages/settings';
import { Units } from './pages/Units';
import { Resource } from './pages/resources';
import { PowerPlant } from './pages/PowerPlant';
import { Maintenance } from './pages/Maintenance';
import { Staff } from './pages/staff';
import { Inspection } from './pages/Inspection';
import { Login } from './components/login/login';
import { Household } from './pages/Household';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/homepage',
    element: <HomePage />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/units',
    element: <Units />,
  },
  {
    path: '/resources',
    element: <Resource />,
  },
  {
    path: '/powerplant',
    element: <PowerPlant />,
  },
  {
    path: '/maintenance',
    element: <Maintenance />,
  },
  {
    path: '/staff',
    element: <Staff />,
  },
  {
    path: '/inspection',
    element: <Inspection />,
  },
  {
    path: '/households',
    element: <Household />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
