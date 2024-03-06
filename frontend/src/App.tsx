import './App.css';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import { PageLayout } from './pages/PageLayout';
import { SelectedListItems } from './components/SelectedListItems';
import { MainView } from './pages/MainView';
import { ListContainer } from './pages/ListContainer';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<PageLayout />}>
      <Route path="/" element={<MainView />} />
      <Route path="list">
        <Route path=":id" element={<ListContainer />} />
      </Route>
    </Route>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
