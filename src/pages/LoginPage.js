import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit() {
    if (!username.trim() || !password) { toast('Ingresá usuario y contraseña', true); return; }
    setLoading(true);
    try {
      if (tab === 'login') await login(username.trim(), password);
      else await register(username.trim(), password);
      navigate('/');
    } catch (e) {
      toast(typeof e === 'string' ? e : 'Error de autenticación', true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--orange-bg) 0%, #fff 60%)', padding: 24,
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 24,
        boxShadow: 'var(--shadow-lg)', padding: '40px 36px',
        width: '100%', maxWidth: 420,
      }}>
        {/* Logo */}
        <div style={{
          width: 80, height: 80, background: 'var(--orange)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 36,
        }}>🛵</div>
        <h1 style={{ textAlign: 'center', fontSize: 28, fontWeight: 900, marginBottom: 4 }}>CletaEats</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginBottom: 28 }}>Panel de Administración</p>

        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: 8, border: 'none', borderRadius: 8,
              fontFamily: 'inherit', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              background: tab === t ? 'var(--surface)' : 'none',
              color: tab === t ? 'var(--orange)' : 'var(--text-muted)',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all .2s',
            }}>
              {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        <div className="field">
          <label>Usuario</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading} style={{ marginTop: 8 }}>
          {loading ? 'Cargando...' : tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
          Demo: admin / 1234
        </p>
      </div>
    </div>
  );
}
