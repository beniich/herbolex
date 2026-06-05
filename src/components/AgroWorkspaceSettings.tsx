import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Settings, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight,
  Globe
} from 'lucide-react';

interface AgroWorkspaceSettingsProps {
  onAddLog: (level: 'info' | 'success' | 'warn' | 'error', message: string) => void;
}

export default function AgroWorkspaceSettings({ onAddLog }: AgroWorkspaceSettingsProps) {
  // Active setting category on the sidebar
  const [activeCategory, setActiveCategory] = useState<'workspace' | 'general' | 'team' | 'billing' | 'integrations'>('workspace');

  // Interactive team members state
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Jean Dupont', email: 'jean@agro.com', role: 'Admin' },
    { id: 2, name: 'Marie Curie', email: 'marie@agro.com', role: 'Farm Manager' },
    { id: 3, name: 'Pierre Martin', email: 'pierre@agro.com', role: 'Field Specialist' }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Field Specialist');

  // Custom roles input list
  const [roles, setRoles] = useState([
    { title: 'Admin', desc: 'Full access to all features and settings.' },
    { title: 'Farm Manager', desc: 'Can manage operations and team members.' },
    { title: 'Field Specialist', desc: 'Restricted access to data entry and reports.' }
  ]);

  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // General settings state
  const [timezone, setTimezone] = useState('Europe/Paris - CEST');
  const [dateFormat, setDateFormat] = useState('YYYY-MM-DD');
  const [multiTenant, setMultiTenant] = useState(true);

  // Invitation submit log
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const namePart = inviteEmail.split('@')[0];
    const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newMember = {
      id: Date.now(),
      name,
      email: inviteEmail.trim(),
      role: inviteRole
    };
    setTeamMembers(prev => [...prev, newMember]);
    onAddLog('success', `WORKSPACE: Invitation envoyée d'urgence à [${inviteEmail}] avec le rôle de [${inviteRole}].`);
    setInviteEmail('');
  };

  const handleDeleteMember = (id: number, email: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    onAddLog('warn', `WORKSPACE: Membre supprimé du système de sécurité: [${email}].`);
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleTitle.trim()) return;
    setRoles(prev => [...prev, { title: newRoleTitle.trim(), desc: newRoleDesc.trim() || 'Custom parameters' }]);
    onAddLog('success', `WORKSPACE: Nouveau rôle RBAC généré avec restrictions: "${newRoleTitle}"`);
    setNewRoleTitle('');
    setNewRoleDesc('');
    setIsAddingRole(false);
  };

  const handleSaveChanges = () => {
    onAddLog('success', 'WORKSPACE_CONFIG: Enregistrement matériel des seuils de conformité et de l\'architecture multi-tenant.');
    alert('Changes saved successfully!');
  };

  return (
    <div className="bg-[#fdfbf9] text-[#4a4a4a] p-6 rounded-[28px] border border-stone-200/60 font-sans shadow-lg select-none" id="workspace-settings-module">
      
      {/* Brand Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-orange-100 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#f26b4f] to-[#e65a3d] rounded-xl flex items-center justify-center text-white text-lg font-bold">
            ⚙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">AgroMaître <span className="text-xs font-normal text-gray-400">(Herboferme)</span></span>
              <span className="text-[9px] bg-orange-50 text-[#f26b4f] border border-orange-200 px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-tight">ORGANIZATION_RBAC</span>
            </div>
            <p className="text-xs text-gray-500 font-mono">Image 1: Workspace settings , Team Management & Roles</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-sans font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Active profile: Security Admin
          </span>
        </div>
      </header>

      {/* Main title */}
      <div className="mb-6">
        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest block mb-1">Home &gt; Settings &gt; Organization</span>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Workspace Organization Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left column (col-span-3): Settings sidebar */}
        <div className="md:col-span-3 space-y-1 bg-white p-3 border border-stone-100 rounded-2xl shadow-xs">
          {[
            { id: 'general' as const, label: 'General Settings', icon: '⚡' },
            { id: 'workspace' as const, label: 'Workspace Organization', icon: '🌾' },
            { id: 'team' as const, label: 'Team & Roles', icon: '👥' },
            { id: 'billing' as const, label: 'Billing & Plans', icon: '💳' },
            { id: 'integrations' as const, label: 'Integrations', icon: '🔌' }
          ].map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  onAddLog('info', `WORKSPACE: Navigation vers l'onglet "${cat.label}"`);
                }}
                className={`w-full text-left p-3 rounded-xl transition duration-200 text-sm font-medium cursor-pointer flex items-center gap-2.5 ${
                  isActive 
                    ? 'text-[#f26b4f] bg-[#fff5f2] border-l-4 border-[#f26b4f]' 
                    : 'text-gray-400 hover:bg-stone-50 hover:text-gray-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right column (col-span-9): Panels split */}
        <div className="md:col-span-9 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card 1: Team Management (col-span-7) */}
          <div className="lg:col-span-7 bg-white border border-stone-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="border-b border-stone-100 pb-3 mb-4">
                <h2 className="text-base font-bold text-gray-800">Team Management</h2>
                <p className="text-xs text-gray-400 mt-1">Invite Members & Manage Roles</p>
              </div>

              {/* Invite Form */}
              <form onSubmit={handleSendInvite} className="mb-6 flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Invite using email address..."
                  className="flex-grow px-4 py-2 border border-gray-200 focus:border-[#f26b4f] rounded-xl text-xs outline-none bg-stone-50/10 font-mono"
                  required
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="px-3 border border-gray-200 rounded-xl text-xs bg-stone-50/10 cursor-pointer text-gray-600 outline-none"
                >
                  <option value="Field Specialist">Specialist</option>
                  <option value="Farm Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#f26b4f] to-[#e65a3d] text-white rounded-xl text-xs font-bold transition hover:opacity-95 shrink-0 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>

              {/* Members table */}
              <div className="space-y-3">
                <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider px-2">
                  Name (Email) - Role
                </div>
                
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div 
                      key={member.id} 
                      className="p-3 bg-stone-50/50 rounded-xl border border-stone-100 text-xs flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold text-gray-800">{member.name}</span>{' '}
                        <span className="text-gray-400 font-mono">({member.email})</span>{' '}
                        <span className="text-gray-300 select-none">|</span>{' '}
                        <span className="text-[#f26b4f] font-semibold">{member.role}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            onAddLog('info', `WORKSPACE: Action d'édition sur le rôle de ${member.name}`);
                            alert(`Edit role action clicked for: ${member.name}`);
                          }}
                          className="p-1 hover:bg-stone-150 inline-block text-gray-400 hover:text-gray-700 rounded transition cursor-pointer"
                          type="button"
                          title="Edit Member"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(member.id, member.email)}
                          className="p-1 hover:bg-stone-150 inline-block text-gray-400 hover:text-red-600 rounded transition cursor-pointer"
                          type="button"
                          title="Delete Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 Stacked contents (col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Subsection 1: RBAC Roles list */}
            <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="border-b border-stone-100 pb-3 mb-4">
                  <h2 className="text-base font-bold text-gray-800">Roles & Permissions (RBAC)</h2>
                </div>

                <div className="space-y-3 mb-4">
                  {roles.map((r, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-bold text-gray-800 block">{r.title}</span>
                      <span className="text-gray-400 mt-0.5 block leading-relaxed">{r.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <AnimatePresence>
                  {isAddingRole && (
                    <motion.form 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      onSubmit={handleCreateRole} 
                      className="border-t border-stone-100 pt-3 mt-3 space-y-2 text-xs"
                    >
                      <input 
                        type="text" 
                        value={newRoleTitle} 
                        onChange={(e) => setNewRoleTitle(e.target.value)}
                        placeholder="Role title (e.g. Agronomist)..." 
                        className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg outline-none"
                        required
                        maxLength={20}
                      />
                      <input 
                        type="text" 
                        value={newRoleDesc} 
                        onChange={(e) => setNewRoleDesc(e.target.value)}
                        placeholder="Brief permissions description..." 
                        className="w-full px-2.5 py-1.5 border border-stone-200 rounded-lg outline-none"
                        maxLength={60}
                      />
                      <div className="flex gap-2 justify-end pt-1">
                        <button type="button" onClick={() => setIsAddingRole(false)} className="px-2 py-1 text-[10px] text-gray-400 hover:text-gray-600">Cancel</button>
                        <button type="submit" className="px-3 py-1 bg-[#f26b4f] text-white rounded text-[10px] font-bold">Save Role</button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {!isAddingRole && (
                  <button
                    onClick={() => setIsAddingRole(true)}
                    className="w-full py-2.5 border border-orange-200 hover:border-orange-300 text-[#f26b4f] hover:bg-orange-50/20 rounded-xl text-xs font-semibold transition text-center cursor-pointer"
                  >
                    Create Custom Role +
                  </button>
                )}
              </div>
            </div>

            {/* Subsection 2: General Configuration list */}
            <div className="bg-white border border-stone-100 rounded-2xl p-6 shadow-xs">
              <div className="border-b border-stone-100 pb-3 mb-4">
                <h2 className="text-base font-bold text-gray-800">General Configuration</h2>
              </div>

              <div className="space-y-4">
                {/* Timezone */}
                <div>
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">Timezone</label>
                  <select 
                    value={timezone} 
                    onChange={(e) => {
                      setTimezone(e.target.value);
                      onAddLog('success', `WORKSPACE: Fuseau horaire modifié: ${e.target.value}`);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-stone-50/10 cursor-pointer text-gray-700 outline-none font-mono"
                  >
                    <option value="Europe/Paris - CEST">Europe/Paris - CEST</option>
                    <option value="UTC / GMT">UTC / GMT</option>
                    <option value="America/New_York - EST">America/New_York - EST</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest block mb-1">Date Format</label>
                  <select 
                    value={dateFormat} 
                    onChange={(e) => {
                      setDateFormat(e.target.value);
                      onAddLog('success', `WORKSPACE: Format de date modifié: ${e.target.value}`);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs bg-stone-50/10 cursor-pointer text-gray-700 outline-none font-mono"
                  >
                    <option value="YYYY-MM-DD">YYYY-MM-DD (2026-06-05)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (05/06/2026)</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY (06/05/2026)</option>
                  </select>
                </div>

                {/* Multi-tenant Isolation Toggle */}
                <div className="flex justify-between items-center pt-2">
                  <div>
                    <span className="text-xs font-semibold text-gray-700 block">Enable Multi-tenant Isolation</span>
                    <span className="text-[10px] text-gray-400 hover:text-gray-500 font-mono block mt-0.5">Strict container data sandboxing</span>
                  </div>
                  <button 
                    onClick={() => {
                      setMultiTenant(!multiTenant);
                      onAddLog('warn', `WORKSPACE: Isolation multi-tenant déplacée vers: [${!multiTenant ? 'ACTIF' : 'INACTIF'}]`);
                    }}
                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {multiTenant ? (
                      <ToggleRight className="w-8 h-8 text-[#f26b4f]" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-300" />
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Save changes action row bar */}
      <footer className="mt-8 pt-4 border-t border-orange-100 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            onAddLog('warn', 'WORKSPACE: Annulation des modifications en suspens.');
            alert('Settings reset to pristine state!');
          }}
          className="px-5 py-2.5 border border-stone-200 hover:border-stone-300 bg-white text-gray-500 rounded-xl text-xs font-semibold hover:bg-stone-50 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveChanges}
          className="px-6 py-2.5 bg-gradient-to-r from-[#f26b4f] to-[#e65a3d] hover:brightness-105 text-white rounded-xl text-xs font-bold shadow-md hover:scale-[1.01] transition cursor-pointer"
        >
          Save Changes
        </button>
      </footer>

    </div>
  );
}
