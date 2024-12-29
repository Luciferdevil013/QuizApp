import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function Dashboard() {
  return (
    <div className='w-full h-full flex relative'>
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard; 