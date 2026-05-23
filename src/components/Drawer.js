import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const items = [
  { icon: '🏠', label: 'Inicio',       path: '/' },
  { icon: '👤', label: 'Clientes',     path: '/clientes' },
  { icon: '🍽️', label: 'Restaurantes', path: '/restaurantes' },
  { icon: '🚴', label: 'Repartidores', path: '/repartidores' },
  { icon: '📦', label: 'Pedidos',      path: '/pedidos' },
];

export default function Drawer({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const go = (path) => { navigate(path); onClose(); };
  const doLogout = () => { logout(); onClose(); navigate('/login'); };

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        zIndex: 200, opacity: open ? 1 : 0,
        pointerEvents: open ? 'all' : 'none',
        transition: 'opacity .25s',
      }} />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 280,
        background: 'var(--surface)', zIndex: 201,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform .25s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column',
        borderRadius: '0 24px 24px 0',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Header */}
        <div style={{
          background: 'var(--orange)', padding: '32px 20px 20px',
          borderRadius: '0 24px 0 0',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🛵</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>CletaEats</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.85)', marginTop: 4 }}>Hola, {user}</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: 12, overflowY: 'auto' }}>
          {items.map(item => (
            <button key={item.path} onClick={() => go(item.path)} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', borderRadius: 'var(--radius-sm)',
              cursor: 'pointer', color: 'var(--text)',
              fontSize: 15, fontWeight: 700,
              border: 'none', background: 'none',
              width: '100%', textAlign: 'left', fontFamily: 'inherit',
              transition: 'background .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--orange-bg)'; e.currentTarget.style.color = 'var(--orange)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text)'; }}
            >
              <span style={{ fontSize: 20, width: 24, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: 12, borderTop: '1px solid var(--border)' }}>
          <button onClick={doLogout} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '12px 16px', borderRadius: 'var(--radius-sm)',
            cursor: 'pointer', color: 'var(--red)',
            fontSize: 15, fontWeight: 700,
            border: 'none', background: 'none',
            width: '100%', textAlign: 'left', fontFamily: 'inherit',
          }}>
            <span style={{ fontSize: 20 }}>🚪</span> Cerrar sesión
          </button>
        </div>
      </div>
    </>
  );
}
