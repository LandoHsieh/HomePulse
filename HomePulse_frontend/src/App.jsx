import { Route, Routes} from 'react-router-dom'
import LoginPage from "./pages/LoginPage"
import MonitorPage from "./pages/MonitorPage"
import ControllerPage from './pages/ControllerPage'
import GroupsPage from './pages/GroupsPage'
import StoreGroupInvitePage from './pages/StoreGroupInvitePage'
import LogsPage from './pages/LogsPage'
function App() {
  return (
    <Routes>
      <Route path='/Login' element={<LoginPage />} />
      <Route path='/Monitor' element={<MonitorPage />} />
      <Route path='/Controller' element={<ControllerPage /> } />
      <Route path='/Groups' element={<GroupsPage />} />
      <Route path='/Logs' element={<LogsPage />} />
      <Route path='/invite' element={<StoreGroupInvitePage />} />
    </Routes>
    
  )
}

export default App
