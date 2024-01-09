import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ListLayout } from './pages/ListLayout';
import { ListSelection } from './pages/ListSelection';
import { SelectedList } from './pages/SelectedList';

const router = createBrowserRouter([
  {
    Component: ListLayout,
    children: [
      { path: '/', Component: ListSelection },
      { path: 'list/', children: [{ path: ':id', Component: SelectedList }] },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
