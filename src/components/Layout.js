import { useState } from 'react';
import Topbar from './Topbar';
import Drawer from './Drawer';

export default function Layout({ title, children, fab }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Topbar title={title} onMenuClick={() => setDrawerOpen(true)} />
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
        {children}
      </div>

      {fab && (
        <button onClick={fab} style={{
          position: 'fixed', bottom: 28, right: 24,
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--orange)', color: '#fff', border: 'none',
          fontSize: 28, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(255,107,53,.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform .18s',
          zIndex: 50,
        }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >＋</button>
      )}
    </div>
  );
}
