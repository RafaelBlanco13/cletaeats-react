export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div style={{
        background: 'var(--surface)', borderRadius: 20, padding: '28px 24px',
        maxWidth: 340, width: '100%', textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <h4 style={{ fontSize: 18, fontWeight: 900, marginBottom: 10 }}>{title}</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
