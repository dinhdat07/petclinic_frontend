import { Outlet } from 'react-router-dom';
import Menu from './Menu';

function AppLayout() {
  return (
    <div>
      <Menu />
      <div className="container-fluid">
        <div className="container xd-container">
          <Outlet />
          <div className="container">
            <div className="row">
              <div className="col-12 text-center">
                <img src="/images/spring-pivotal-logo.png" alt="Sponsored by Pivotal" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
