import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function SidebarProfile() {
  const { user, userType } = useAuth();
  
  return (
    <div className="p-4 border-b border-border/20 flex items-center justify-between">
      <div>
        <p className="font-medium truncate max-w-[180px]">{user?.email || 'Guest User'}</p>
        <p className="text-sm text-sidebar-muted capitalize">{userType || 'Guest'} Account</p>
      </div>
      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
        <User size={18} className="text-primary" />
      </div>
    </div>
  );
}

export default SidebarProfile;
