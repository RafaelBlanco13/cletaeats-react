import { useAuth } from '../context/AuthContext';

export default function Topbar({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--orange)',
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 20px', height: 60,
      boxShadow: '0 2px 8px rgba(255,107,53,.3)',
    }}>
      <button onClick={onMenuClick} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#fff', fontSize: 24, padding: 4,
        display: 'flex', alignItems: 'center',
      }}>☰</button>
      <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', flex: 1 }}>{title}</span>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{user}</span>
    </div>
  );
}
