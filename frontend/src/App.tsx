import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/pages/Dashboard'
import Customers from '@/pages/Customers'
import Leads from '@/pages/Leads'
import Contacts from '@/pages/Contacts'
import Deals from '@/pages/Deals'
import Tasks from '@/pages/Tasks'
import Notes from '@/pages/Notes'
import Settings from '@/pages/Settings'

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}
