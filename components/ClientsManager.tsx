import React, { useState, useEffect } from 'react';
import {
    Users,
    Edit,
    Save,
    X,
    Mail,
    Briefcase,
    Search,
    UserPlus
} from 'lucide-react';
import { getAllClients, updateClient } from '../services/supabaseService';

export const ClientsManager: React.FC = () => {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        setLoading(true);
        const data = await getAllClients();
        setClients(data);
        setLoading(false);
    };

    const handleEdit = (client: any) => {
        setEditingId(client.id);
        setEditForm({ ...client });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSave = async (id: string) => {
        const updated = await updateClient(id, {
            name: editForm.name,
            company_name: editForm.company_name, // Using actual DB column name
            email: editForm.email,
            industry: editForm.industry
        } as any);

        if (updated) {
            setClients(clients.map(c => c.id === id ? updated : c));
            setEditingId(null);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in text-text-main">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Gestión de Clientes</h1>
                    <p className="text-text-muted mt-1">Administra la información de tus leads y clientes</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-surface border border-surfaceHighlight rounded-xl outline-none focus:border-primary w-full md:w-64"
                    />
                </div>
            </div>

            <div className="bg-surface rounded-2xl border border-surfaceHighlight overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surfaceHighlight/30 text-text-muted text-xs uppercase tracking-wider font-bold">
                            <th className="px-6 py-4">Cliente / Empresa</th>
                            <th className="px-6 py-4">Contacto</th>
                            <th className="px-6 py-4">Industria</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surfaceHighlight">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center animate-pulse text-text-muted">
                                    Cargando clientes...
                                </td>
                            </tr>
                        ) : filteredClients.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-20 text-center text-text-muted">
                                    No se encontraron clientes.
                                </td>
                            </tr>
                        ) : (
                            filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-surfaceHighlight/10 transition-colors">
                                    <td className="px-6 py-4">
                                        {editingId === client.id ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={editForm.company_name}
                                                    onChange={e => setEditForm({ ...editForm, company_name: e.target.value })}
                                                    className="w-full bg-surfaceHighlight border border-primary/30 rounded-lg px-2 py-1 text-sm outline-none"
                                                    placeholder="Empresa"
                                                />
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                    className="w-full bg-surfaceHighlight border border-transparent rounded-lg px-2 py-1 text-xs text-text-muted outline-none"
                                                    placeholder="Nombre Contacto"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-bold text-text-main">{client.company_name}</p>
                                                <p className="text-xs text-text-muted">{client.name}</p>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === client.id ? (
                                            <div className="flex items-center gap-2 bg-surfaceHighlight border border-primary/30 rounded-lg px-2 py-1">
                                                <Mail size={14} className="text-text-muted" />
                                                <input
                                                    type="email"
                                                    value={editForm.email || ''}
                                                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                    className="bg-transparent border-none text-sm outline-none w-full"
                                                    placeholder="correo@ejemplo.com"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail size={14} className="text-primary" />
                                                <span className={client.email ? 'text-text-main' : 'text-red-400 italic'}>
                                                    {client.email || 'Sin correo'}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingId === client.id ? (
                                            <input
                                                type="text"
                                                value={editForm.industry || ''}
                                                onChange={e => setEditForm({ ...editForm, industry: e.target.value })}
                                                className="w-full bg-surfaceHighlight border border-primary/30 rounded-lg px-2 py-1 text-sm outline-none"
                                                placeholder="Industria"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                                <Briefcase size={14} />
                                                {client.industry || 'N/A'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {editingId === client.id ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleSave(client.id)}
                                                    className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
                                                >
                                                    <Save size={18} />
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(client)}
                                                className="p-2 text-text-muted hover:text-primary transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
