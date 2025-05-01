import SidebarProfile from './SidebarProfile';
import Navigation from './Navigation';
import LogoutButton from './LogoutButton';

function Sidebar({ view, setView }) {
  return (
    <aside className="sidebar custom-scrollbar bg-gradient-radial from-accent/5 to-transparent">
      <SidebarProfile />
      <Navigation view={view} setView={setView} />
      <LogoutButton />
    </aside>
  );
}

export default Sidebar;
