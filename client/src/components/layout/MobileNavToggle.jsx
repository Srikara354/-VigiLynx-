function MobileNavToggle({ isMobileSidebarOpen, setIsMobileSidebarOpen }) {
  return (
    <button
      onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      className={`lg:hidden p-2 rounded-lg hover:bg-muted transition-all-normal ${isMobileSidebarOpen ? 'hamburger-active' : ''}`}
      aria-label="Toggle mobile navigation"
      aria-expanded={isMobileSidebarOpen}
    >
      <div className="hamburger-menu">
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </div>
    </button>
  );
}

export default MobileNavToggle;
