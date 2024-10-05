import React, { useState, useEffect } from 'react';
import { 
  FaUserCog, 
  FaClipboardList, 
  FaChartPie, 
  FaHistory, 
  FaWallet, 
  FaSignOutAlt, 
  FaBars, 
  FaSearch, FaTimes,
  FaPowerOff 
} from 'react-icons/fa';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Logo from './Circle_logo.png';
import './HomePageComponent.css';

const HomePageComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('/home/profile'); // Default active menu item
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home/dashboard');
    }
  }, [location.pathname, navigate]);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  
  const handleMenuClick = (route) => {
    setActiveMenu(route); // Update active menu state
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
          <div 
            className={`menu-item ${activeMenu === '/home/profile' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('/home/profile')}
          >
            {isSidebarOpen && <span>Profile</span>}
            <FaUserCog className="sidebar-icon" />
          </div>
          <div 
            className={`menu-item ${activeMenu === '/home/plandisplay' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('/home/plandisplay')}
          >
            {isSidebarOpen && <span>Plans</span>}
            <FaClipboardList className="sidebar-icon" />
          </div>
          <div 
            className={`menu-item ${activeMenu === '/home/investementplans' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('/home/investementplans')}
          >
            {isSidebarOpen && <span>Investments</span>}
            <FaChartPie className="sidebar-icon" />
          </div>
          <div 
            className={`menu-item ${activeMenu === '/home/Withdrawn' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('/home/Withdrawn')}
          >
            {isSidebarOpen && <span>History</span>}
            <FaHistory className="sidebar-icon" />
          </div>
          <div 
            className={`menu-item ${activeMenu === '/home/wallets' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('/home/wallets')}
          >
            {isSidebarOpen && <span>Wallets</span>}
            <FaWallet className="sidebar-icon" />
          </div>
          <div 
            className={`menu-item ${activeMenu === '/' ? 'active' : ''}`} 
            onClick={() => handleMenuClick('/')}
          >
            {isSidebarOpen && <span>Logout</span>}
            <FaSignOutAlt className="sidebar-icon" />
          </div>
        </div>
      </div>

      <div className={`header-container ${isSidebarOpen ? 'header-expanded' : 'header-collapsed'}`}>
        <div className="header-content">
              {isSidebarOpen ? (
          <FaTimes className="menu-icon" color='#ccc' size={25} onClick={toggleSidebar} />
        ) : (
          <FaBars className="menu-icon" color='#ccc' size={25} onClick={toggleSidebar} />
        )}          
        {/* <div className="search-container">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search projects" className="search-input" />
          </div> */}
          <div className="actions-container" onClick={() => handleMenuClick('/')}>
            <FaPowerOff className="power-icon" color='white' />
          </div>
        </div>
      </div>

      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default HomePageComponent;
