import './App.css';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import { ListLayout } from './pages/ListLayout';
import { ListSelection } from './pages/ListSelection';
import { SelectedList } from './pages/SelectedList';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<ListLayout />}>
      <Route path="/" element={<ListSelection />} />
      <Route path="list">
        <Route path=":id" element={<SelectedList />} />
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
