import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex gradient-bg">
      <Sidebar role={user?.role} />
      <div className="flex-1 p-8 overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
