import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/App';
import WelcomePage from './components/WelcomePage';
import FindOwnersPage from './components/owners/FindOwnersPage';
import OwnersPage from './components/owners/OwnersPage';
import NewOwnerPage from './components/owners/NewOwnerPage';
import EditOwnerPage from './components/owners/EditOwnerPage';
import NewPetPage from './components/pets/NewPetPage';
import EditPetPage from './components/pets/EditPetPage';
import VisitsPage from './components/visits/VisitsPage';
import VetsPage from './components/vets/VetsPage';
import ErrorPage from './components/ErrorPage';
import NotFoundPage from './components/NotFoundPage';
import PetTypesPage from './components/pets/PetTypesPage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<WelcomePage />} />
        <Route path="owners">
          <Route path="list" element={<FindOwnersPage />} />
          <Route path="new" element={<NewOwnerPage />} />
          <Route path=":ownerId">
            <Route index element={<OwnersPage />} />
            <Route path="edit" element={<EditOwnerPage />} />
            <Route path="pets">
              <Route path="new" element={<NewPetPage />} />
              <Route path=":petId">
                <Route path="edit" element={<EditPetPage />} />
                <Route path="visits">
                  <Route path="new" element={<VisitsPage />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="pettypes" element={<PetTypesPage />} />
        <Route path="vets" element={<VetsPage />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;