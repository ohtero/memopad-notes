import './App.css';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import { PageLayout } from './pages/PageLayout';
import { SelectedList } from './pages/SelectedList';
import { MainView } from './pages/MainView';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PageLayout />}>
      <Route path="/" element={<MainView />} />
      <Route path="list">
        <Route path=":id" element={<SelectedList />} />
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
