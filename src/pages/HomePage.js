import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const modules = [
  { icon: '👤', title: 'Clientes',     desc: 'Gestión de clientes',     path: '/clientes',     color: '#1565C0' },
  { icon: '🍽️', title: 'Restaurantes', desc: 'Restaurantes afiliados',  path: '/restaurantes', color: '#2E7D32' },
  { icon: '🚴', title: 'Repartidores', desc: 'Equipo de reparto',        path: '/repartidores', color: '#6A1B9A' },
  { icon: '📦', title: 'Pedidos',      desc: 'Pedidos y combos',         path: '/pedidos',      color: '#E65100' },
];

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout title="CletaEats">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900 }}>Bienvenido, {user} 👋</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>¿Qué módulo querés gestionar hoy?</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        {modules.map(m => (
          <button key={m.path} onClick={() => navigate(m.path)} style={{
            background: m.color, borderRadius: 'var(--radius)', padding: '22px 18px',
            cursor: 'pointer', color: '#fff', border: 'none',
            fontFamily: 'inherit', textAlign: 'left',
            boxShadow: 'var(--shadow)', transition: 'transform .18s, box-shadow .18s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{m.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 4 }}>{m.title}</div>
            <div style={{ fontSize: 12, opacity: .85 }}>{m.desc}</div>
          </button>
        ))}
      </div>
    </Layout>
  );
}
