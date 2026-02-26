import { NavLink, Outlet } from 'react-router-dom';

const menuItems = [
  { to: '/vehicles', label: 'Veículos' },
  { to: '/parts', label: 'Peças' },
  { to: '/independent-parts', label: 'Peças Independentes' },
];

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">Estoque Ferro-Velho</header>
      <div className="body-wrap">
        <aside className="sidebar">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `menu-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </aside>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
