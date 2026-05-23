export default function FormModal({ open, title, onClose, onSave, saving, children }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 24,
        width: '100%', maxWidth: 480, maxHeight: '90vh',
        overflowY: 'auto', boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Header */}
        <div style={{
          background: 'var(--orange)', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderRadius: '24px 24px 0 0', position: 'sticky', top: 0, zIndex: 1,
        }}>
          <h3 style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>{children}</div>

        {/* Footer */}
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" style={{ flex: 2 }} onClick={onSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
