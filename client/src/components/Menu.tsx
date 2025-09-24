import { NavLink, useLocation } from 'react-router-dom';

interface MenuItemProps {
  to: string;
  title: string;
  icon: string;
  exact?: boolean;
  isActive: boolean;
  children: string;
}

function MenuItem({ to, title, icon, exact, isActive, children }: MenuItemProps) {
  return (
    <li className={isActive ? 'active' : undefined}>
      <NavLink to={to} title={title} end={exact}>
        <span className={`glyphicon ${icon}`} aria-hidden="true"></span>&nbsp;
        <span>{children}</span>
      </NavLink>
    </li>
  );
}

function Menu() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <nav className="navbar navbar-default" role="navigation">
      <div className="container">
        <div className="navbar-header">
          <NavLink className="navbar-brand" to="/">
            <span></span>
          </NavLink>
          <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#main-navbar">
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        <div className="navbar-collapse collapse" id="main-navbar">
          <ul className="nav navbar-nav navbar-right">
            <MenuItem to="/" title="home page" icon="glyphicon-home" exact isActive={pathname === '/'}>
              Home
            </MenuItem>
            <MenuItem
              to="/owners/list"
              title="find owners"
              icon="glyphicon-search"
              isActive={pathname.startsWith('/owners')}
            >
              Find owners
            </MenuItem>
            <MenuItem
              to="/pettypes"
              title="pet types"
              icon="glyphicon-list-alt"
              isActive={pathname.startsWith('/pettypes')}
            >
              Pet Types
            </MenuItem>
            <MenuItem
              to="/vets"
              title="veterinarians"
              icon="glyphicon-th-list"
              isActive={pathname.startsWith('/vets')}
            >
              Veterinarians
            </MenuItem>
            <MenuItem
              to="/error"
              title="trigger a RuntimeException to see how it is handled"
              icon="glyphicon-warning-sign"
              isActive={pathname.startsWith('/error')}
            >
              Error
            </MenuItem>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Menu;
