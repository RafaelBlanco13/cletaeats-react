import { useState, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { crudApi } from '../api/client';
import { toast } from '../components/Toast';

// ── Field helpers ─────────────────────────────────────────────────────────────

function FormField({ label, type = 'text', value, onChange, options, min, step }) {
  return (
    <div className="field">
      <label>{label}</label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} min={min} step={step} />
      )}
    </div>
  );
}

// ── Badge helpers ─────────────────────────────────────────────────────────────

function BadgeEstadoPedido({ estado }) {
  const map = { 'en preparacion': 'preparacion', 'en camino': 'camino', 'entregado': 'entregado', 'suspendido': 'suspendido' };
  return <span className={`badge badge-${map[estado] || 'preparacion'}`}>{estado}</span>;
}

function BadgeEstadoRepartidor({ estado }) {
  return <span className={`badge badge-${estado === 'disponible' ? 'disponible' : 'ocupado'}`}>{estado}</span>;
}

// ── Configs per section ───────────────────────────────────────────────────────

const SECTIONS = {
  clientes: {
    title: '👤 Clientes',
    avatarBg: '#E3F2FD',
    avatarColor: '#1565C0',
    emptyMsg: 'Sin clientes registrados',
    fields: () => [
      { key: 'nombre',         label: 'Nombre completo' },
      { key: 'identificacion', label: 'Cédula' },
      { key: 'correo',         label: 'Correo electrónico', type: 'email' },
      { key: 'telefono',       label: 'Teléfono' },
      { key: 'direccion',      label: 'Dirección exacta' },
    ],
    defaultValues: () => ({ nombre: '', identificacion: '', correo: '', telefono: '', direccion: '' }),
    cardTitle: item => item.nombre,
    cardSub: item => `Cédula: ${item.identificacion} · ${item.correo}`,
    cardExtra: item => <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>📞 {item.telefono} · 📍 {item.direccion}</p>,
    avatarText: item => item.nombre?.[0]?.toUpperCase() || '?',
  },

  restaurantes: {
    title: '🍽️ Restaurantes',
    avatarBg: '#E8F5E9',
    avatarColor: '#2E7D32',
    emptyMsg: 'Sin restaurantes registrados',
    fields: () => [
      { key: 'nombre',         label: 'Nombre del restaurante' },
      { key: 'cedulaJuridica', label: 'Cédula jurídica' },
      { key: 'tipoComida',     label: 'Tipo de comida' },
      { key: 'direccion',      label: 'Dirección' },
    ],
    defaultValues: () => ({ nombre: '', cedulaJuridica: '', tipoComida: '', direccion: '' }),
    cardTitle: item => item.nombre,
    cardSub: item => `Cédula: ${item.cedulaJuridica} · ${item.tipoComida}`,
    cardExtra: item => <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>📍 {item.direccion}</p>,
    avatarText: () => '🍽️',
  },

  repartidores: {
    title: '🚴 Repartidores',
    avatarBg: '#EDE7F6',
    avatarColor: '#6A1B9A',
    emptyMsg: 'Sin repartidores registrados',
    fields: () => [
      { key: 'nombre',        label: 'Nombre completo' },
      { key: 'cedula',        label: 'Cédula' },
      { key: 'correo',        label: 'Correo electrónico', type: 'email' },
      { key: 'telefono',      label: 'Teléfono' },
      { key: 'direccion',     label: 'Dirección' },
      { key: 'numeroTarjeta', label: 'Número de tarjeta' },
      { key: 'estado',        label: 'Estado', options: [{ value: 'disponible', label: 'Disponible' }, { value: 'ocupado', label: 'Ocupado' }] },
      { key: 'amonestaciones', label: 'Amonestaciones', type: 'number', min: '0' },
    ],
    defaultValues: () => ({ nombre: '', cedula: '', correo: '', telefono: '', direccion: '', numeroTarjeta: '', estado: 'disponible', amonestaciones: '0' }),
    cardTitle: item => item.nombre,
    cardSub: item => `Cédula: ${item.cedula} · 📞 ${item.telefono}`,
    cardExtra: item => (
      <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <BadgeEstadoRepartidor estado={item.estado} />
        {item.amonestaciones > 0 && <span className="badge badge-ocupado">⚠️ {item.amonestaciones} amonest.</span>}
      </div>
    ),
    avatarText: () => '🚴',
    parseValues: v => ({ ...v, amonestaciones: parseInt(v.amonestaciones) || 0 }),
  },

  pedidos: {
    title: '📦 Pedidos',
    avatarBg: '#FFF3E0',
    avatarColor: '#E65100',
    emptyMsg: 'Sin pedidos registrados',
    fields: () => [
      { key: 'clienteNombre',     label: 'Nombre del cliente' },
      { key: 'clienteId',         label: 'ID del cliente' },
      { key: 'restauranteNombre', label: 'Nombre del restaurante' },
      { key: 'restauranteId',     label: 'ID del restaurante' },
      { key: 'repartidorNombre',  label: 'Nombre del repartidor' },
      { key: 'repartidorId',      label: 'ID del repartidor' },
      { key: 'numerosCombo',      label: 'Combos (ej: 1,3,5)' },
      { key: 'horaRealizacion',   label: 'Hora de realización' },
      { key: 'horaEntrega',       label: 'Hora de entrega (opcional)' },
      { key: 'total',             label: 'Total (₡)', type: 'number', min: '0', step: '1' },
      { key: 'estado',            label: 'Estado', options: [
        { value: 'en preparacion', label: 'En preparación' },
        { value: 'en camino',      label: 'En camino' },
        { value: 'entregado',      label: 'Entregado' },
        { value: 'suspendido',     label: 'Suspendido' },
      ]},
    ],
    defaultValues: () => ({
      clienteNombre: '', clienteId: '',
      restauranteNombre: '', restauranteId: '',
      repartidorNombre: '', repartidorId: '',
      numerosCombo: '', horaRealizacion: '', horaEntrega: '',
      total: '0', estado: 'en preparacion',
    }),
    cardTitle: item => item.clienteNombre,
    cardSub: item => `${item.restauranteNombre} · Repartidor: ${item.repartidorNombre}`,
    cardExtra: item => (
      <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <BadgeEstadoPedido estado={item.estado} />
        <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--orange)' }}>₡{Number(item.total).toLocaleString()}</span>
      </div>
    ),
    avatarText: () => '📦',
    parseValues: v => ({ ...v, total: parseFloat(v.total) || 0 }),
  },
};

// ── Main CRUD Page ────────────────────────────────────────────────────────────

export default function CrudPage({ section }) {
  const cfg = SECTIONS[section];
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(cfg.defaultValues());
  const [confirm, setConfirm] = useState(null); // { id, name }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await crudApi.getAll(section);
      setItems(data);
    } catch (e) {
      toast(typeof e === 'string' ? e : 'Error cargando datos', true);
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => { load(); }, [load]);

  const filtered = search
    ? items.filter(i => JSON.stringify(i).toLowerCase().includes(search.toLowerCase()))
    : items;

  function openCreate() {
    setEditingId(null);
    setForm(cfg.defaultValues());
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    const vals = {};
    cfg.fields().forEach(f => { vals[f.key] = item[f.key] !== undefined ? String(item[f.key]) : ''; });
    setForm(vals);
    setModalOpen(true);
  }

  function setField(key, val) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    // Basic validation
    const required = cfg.fields().filter(f => !f.options || f.key !== 'horaEntrega');
    for (const f of required) {
      if (!form[f.key] && form[f.key] !== '0') {
        toast(`El campo "${f.label}" es requerido`, true); return;
      }
    }

    setSaving(true);
    try {
      const payload = cfg.parseValues ? cfg.parseValues(form) : form;
      if (editingId) {
        await crudApi.update(section, editingId, payload);
        toast(`Registro actualizado ✓`);
      } else {
        await crudApi.create(section, payload);
        toast(`Registro creado ✓`);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      toast(typeof e === 'string' ? e : 'Error al guardar', true);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await crudApi.delete(section, id);
      toast('Registro eliminado');
      load();
    } catch (e) {
      toast(typeof e === 'string' ? e : 'Error al eliminar', true);
    } finally {
      setConfirm(null);
    }
  }

  return (
    <Layout title={cfg.title} fab={openCreate}>
      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-muted)' }}>🔍</span>
        <input
          style={{ width: '100%', padding: '12px 16px 12px 44px', border: '1.5px solid var(--border)', borderRadius: 50, fontFamily: 'inherit', fontSize: 14, outline: 'none', background: 'var(--surface)' }}
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="loading-box"><div className="spinner" /><p>Cargando...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="es-icon">📭</div>
          <h3>{cfg.emptyMsg}</h3>
          <p>Presioná + para agregar uno</p>
        </div>
      ) : (
        filtered.map(item => (
          <div key={item.id} style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16 }}>
              {/* Avatar */}
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                background: cfg.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 900, color: cfg.avatarColor, flexShrink: 0,
              }}>
                {cfg.avatarText(item)}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cfg.cardTitle(item)}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{cfg.cardSub(item)}</p>
                {cfg.cardExtra(item)}
              </div>
            </div>
            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, padding: '0 16px 14px' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => openEdit(item)}>✏️ Editar</button>
              <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => setConfirm({ id: item.id, name: cfg.cardTitle(item) })}>🗑️ Eliminar</button>
            </div>
          </div>
        ))
      )}

      {/* Form Modal */}
      <FormModal
        open={modalOpen}
        title={editingId ? `Editar ${cfg.title}` : `Nuevo registro`}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
      >
        {cfg.fields().map(f => (
          <FormField
            key={f.key}
            label={f.label}
            type={f.type}
            value={form[f.key] ?? ''}
            onChange={val => setField(f.key, val)}
            options={f.options}
            min={f.min}
            step={f.step}
          />
        ))}
      </FormModal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={!!confirm}
        title="¿Eliminar registro?"
        message={`¿Eliminar "${confirm?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={() => handleDelete(confirm.id)}
        onCancel={() => setConfirm(null)}
      />
    </Layout>
  );
}
