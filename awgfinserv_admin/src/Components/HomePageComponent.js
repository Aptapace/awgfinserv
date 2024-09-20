import React, { useState, useEffect } from 'react';
import { FaSearch, FaEnvelope, FaBell, FaPowerOff, FaBars, FaHome, FaCalendar, FaList, FaTable, FaIcons, FaChartLine, FaUser, FaPiggyBank } from 'react-icons/fa';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Logo from './Circle_logo.png';
import './HomePageComponent.css';

const HomePageComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home/dashboard');
    }
  }, [location.pathname, navigate]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const handleMenuClick = (route) => {
    navigate(route);
  };

  return (
    <div className="page-container">
      <div className={`sidebar-container ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-logo-container">
          <img className="sidebar-logo-icon" src={Logo} alt="AWG Circle" />
          {isSidebarOpen && (
            <div className="sidebar-company-info">
              <h4 className="sidebar-company-name">AWG</h4>
              <p className="sidebar-company-tagline">Finserv Pvt Ltd</p>
            </div>
          )}
        </div>

        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => handleMenuClick('/home/dashboard')}>
            {isSidebarOpen && <span>Dashboard</span>}
            <FaHome className="sidebar-icon" />
          </div>
          <div className={`sidemenu-part ${activeSubMenu === 'Plans' ? 'active' : ''}`}>
            <div className="menu-item" onClick={() => setActiveSubMenu(activeSubMenu === 'Plans' ? null : 'Plans')}>
              {isSidebarOpen && <span>Plans</span>}
              <FaCalendar className="sidebar-icon" />
            </div>
            <div className={`submenu ${activeSubMenu === 'Plans' ? 'submenu-open' : ''}`}>
              <span onClick={() => navigate('/home/plans/current')}>Current Plans</span>
              <span onClick={() => navigate('/home/plans/add')}>Add Plans</span>
              <span onClick={() => navigate('/home/plans/delete')}>Delete Plans</span>
            </div>
          </div>

          <div className="menu-item" onClick={() => handleMenuClick('/home/users')}>
            {isSidebarOpen && <span>Users List</span>}
            <FaList className="sidebar-icon" />
          </div>

          <div className="menu-item" onClick={() => handleMenuClick('/home/investments')}>
            {isSidebarOpen && <span>Investments</span>}
            <FaTable className="sidebar-icon" />
          </div>

          <div className="menu-item" onClick={() => handleMenuClick('/home/withdraws')}>
            {isSidebarOpen && <span>Withdraws</span>}
            <FaIcons className="sidebar-icon" />
          </div>

          <div className="menu-item" onClick={() => handleMenuClick('/home/monthlyreturns')}>
            {isSidebarOpen && <span>Rate Of Interest</span>}
            <FaChartLine className="sidebar-icon" />
          </div>

          <div className="menu-item" onClick={() => handleMenuClick('/home/AddBank')}>
            {isSidebarOpen && <span>Add Bank Account</span>}
            <FaPiggyBank className="sidebar-icon" />
          </div>

          <div className="menu-item" onClick={() => handleMenuClick('/logout')}>
            {isSidebarOpen && <span>Logout</span>}
            <FaUser className="sidebar-icon" />
          </div>
        </div>
      </div>

      <div className={`header-container ${isSidebarOpen ? 'header-expanded' : 'header-collapsed'}`}>
        <div className="header-content">
          <FaBars className="menu-icon" color='#ccc' size={20} onClick={toggleSidebar} />
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search projects" className="search-input" />
          </div>
          <div className="actions-container">
            <FaEnvelope className="mail-icon" />
            <FaBell className="notification-icon" />
            <FaPowerOff className="power-icon" />
          </div>
        </div>
      </div>

      {/* Main content area where nested routes will render */}
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Outlet /> {/* Render nested routes here */}
      </div>
    </div>
  );
}

export default HomePageComponent;
