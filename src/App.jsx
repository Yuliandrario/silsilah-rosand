import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Info,
  User,
  UserCheck,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Heart,
  Dna
} from 'lucide-react';

/**
 * PANDUAN INTEGRASI DATA:
 * 1. Gunakan Google Sheets untuk mencatat data keluarga.
 * 2. Hubungkan Google Sheets tersebut ke Sheety (https://sheety.co).
 * 3. Masukkan URL API dari Sheety ke variabel SHEETY_PROJECT_API di bawah.
 */

const SHEETY_PROJECT_API = "https://api.sheety.co/4902cc2b98c00383020342ec4d95e426/databaseSilsilahRosandFamily/silsilah"; 

const INITIAL_DATA = [
  {
    id: "1",
    name: "Rosandf Senior (Contoh Mode)",
    gender: "Male",
    birthDate: "12 Mei 1945",
    birthPlace: "Jakarta",
    occupation: "Pensiunan Guru",
    bio: "Pendiri keluarga besar Rosandf. Data ini muncul sebagai placeholder sebelum Anda menghubungkan API Sheety.",
    generation: 1,
    parentId: null,
    children: ["2", "3"]
  }
];

export default function App() {
  const [familyData, setFamilyData] = useState(INITIAL_DATA);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set(["1"]));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!SHEETY_PROJECT_API) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(SHEETY_PROJECT_API);
      const result = await response.json();
      const sheetName = Object.keys(result)[0];
      const data = result[sheetName];

      if (data && Array.isArray(data)) {
        const formattedData = data.map(item => ({
          ...item,
          children: typeof item.children === 'string' ? item.children.split(',').map(c => c.trim()) : (item.children || [])
        }));
        setFamilyData(formattedData);
        if (formattedData.length > 0) setExpandedNodes(new Set([formattedData[0].id.toString()]));
      }
    } catch (err) {
      setError("Gagal memuat data. Periksa koneksi atau URL API Sheety Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMembers = useMemo(() => {
    return familyData.filter(m => 
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.occupation?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [familyData, searchTerm]);

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedNodes);
    const idStr = id.toString();
    if (newExpanded.has(idStr)) newExpanded.delete(idStr);
    else newExpanded.add(idStr);
    setExpandedNodes(newExpanded);
  };

  const getChildren = (parentId) => familyData.filter(m => m.parentId?.toString() === parentId?.toString());
  const getParent = (parentId) => familyData.find(m => m.id?.toString() === parentId?.toString());

  const MemberCard = ({ member, depth = 0 }) => {
    const childrenNodes = getChildren(member.id);
    const hasChildren = childrenNodes.length > 0;
    const isExpanded = expandedNodes.has(member.id.toString());
    const isSelected = selectedMember?.id === member.id;

    return (
      <div className="flex flex-col">
        <div 
          style={{ marginLeft: `${depth * 12}px` }}
          className={`group flex items-center p-3 mb-2 rounded-2xl transition-all duration-200 cursor-pointer border
            ${isSelected 
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1' 
              : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-md text-gray-800'}`}
          onClick={() => setSelectedMember(member)}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(member.id);
            }}
            className={`mr-2 p-1.5 rounded-lg transition-colors ${isSelected ? 'hover:bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-400'}`}
          >
            {hasChildren ? (
              <ChevronRight size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
            ) : (
              <div className="w-[18px]" />
            )}
          </button>
          
          <div className={`w-11 h-11 rounded-full flex items-center justify-center mr-3 shadow-inner
            ${isSelected 
                ? 'bg-white/20' 
                : (member.gender === 'Male' ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500')}`}>
            <User size={22} fill={isSelected ? "currentColor" : "none"} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-sm md:text-base truncate ${isSelected ? 'text-white' : 'text-gray-800'}`}>
              {member.name}
            </h3>
            <p className={`text-xs flex items-center gap-1.5 mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
              <Briefcase size={12} /> {member.occupation || 'N/A'}
            </p>
          </div>

          <div className={`ml-2 text-[10px] font-bold px-2 py-1 rounded-full border ${isSelected ? 'bg-white/20 border-white/30 text-white' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
            G{member.generation}
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="border-l-2 border-blue-100 ml-6 pl-2 mt-[-4px] mb-2 space-y-1">
            {childrenNodes.map(child => (
              <MemberCard key={child.id} member={child} depth={0} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        
        {/* Header Bagian Atas */}
        <header className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-200/60 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 shrink-0">
               <Dna className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
                Rosandf <span className="text-blue-600">Family</span>
              </h1>
              <div className="flex items-center gap-3 mt-1.5">
                 <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <Users size={14} /> {familyData.length} Anggota
                 </span>
                 <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase">
                   Data Live
                 </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Cari keluarga..."
                className="pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl w-full md:w-72 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={fetchData}
              disabled={isLoading}
              className="p-3.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              title="Perbarui Data"
            >
              <RefreshCw size={20} className={isLoading ? "animate-spin text-blue-500" : ""} />
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 animate-in fade-in zoom-in duration-300">
            <div className="p-2 bg-red-100 rounded-xl"><AlertCircle size={20} /></div>
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Area Konten Utama - Pohon */}
          <main className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-6 md:p-8 min-h-[60vh]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-extrabold flex items-center gap-3 text-slate-800">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                  Pohon Keluarga
                </h2>
                {SHEETY_PROJECT_API && (
                  <a 
                    href={SHEETY_PROJECT_API.replace('/api/', '/')} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    Edit Data <ExternalLink size={14} />
                  </a>
                )}
              </div>
              
              {isLoading ? (
                 <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                   <div className="relative w-20 h-20 mb-6">
                      <RefreshCw size={80} className="animate-spin opacity-5 absolute inset-0" />
                      <Users size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
                   </div>
                   <p className="font-bold text-slate-500">Menghubungkan Database...</p>
                 </div>
              ) : searchTerm ? (
                <div className="grid grid-cols-1 gap-1">
                  {filteredMembers.map(m => (
                    <MemberCard key={m.id} member={m} />
                  ))}
                  {filteredMembers.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                       <Search size={48} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Anggota tidak ditemukan</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {familyData.filter(m => !m.parentId || m.parentId === "" || m.parentId === "null").map(root => (
                    <MemberCard key={root.id} member={root} />
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Sidebar Detail Anggota */}
          <aside className="lg:col-span-5 space-y-8 sticky top-8">
            {selectedMember ? (
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
                <div className={`h-32 relative flex items-center justify-center ${selectedMember.gender === 'Male' ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-pink-400 to-pink-600'}`}>
                   <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 overflow-hidden pointer-events-none">
                     {[...Array(20)].map((_, i) => <Heart key={i} size={24} />)}
                   </div>
                   <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center border-8 border-white shadow-2xl translate-y-12">
                      <User size={48} className={selectedMember.gender === 'Male' ? 'text-blue-600' : 'text-pink-500'} fill="currentColor" />
                   </div>
                </div>
                
                <div className="pt-16 p-8">
                  <div className="text-center mb-10">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{selectedMember.name}</h3>
                    <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Generasi ke-{selectedMember.generation}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80">
                      <div className="flex items-center gap-2 text-slate-400 mb-1.5 uppercase text-[9px] font-bold tracking-widest">
                        <Calendar size={12} /> Tanggal Lahir
                      </div>
                      <p className="text-sm font-bold text-slate-700">{selectedMember.birthDate || '-'}</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80">
                      <div className="flex items-center gap-2 text-slate-400 mb-1.5 uppercase text-[9px] font-bold tracking-widest">
                        <MapPin size={12} /> Tempat Lahir
                      </div>
                      <p className="text-sm font-bold text-slate-700">{selectedMember.birthPlace || '-'}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-slate-400 mb-2 uppercase text-[9px] font-bold tracking-widest px-1">
                      <Info size={12} /> Biografi Singkat
                    </div>
                    <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100/50 relative">
                       <p className="text-sm text-slate-600 italic leading-relaxed">
                         "{selectedMember.bio || 'Kisah perjalanan hidup belum ditambahkan untuk anggota ini.'}"
                       </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {selectedMember.parentId && (
                      <button 
                        onClick={() => {
                          const parent = getParent(selectedMember.parentId);
                          if(parent) setSelectedMember(parent);
                        }}
                        className="flex items-center justify-center gap-2 py-4 px-3 text-[10px] font-black bg-slate-800 hover:bg-slate-900 text-white rounded-2xl transition-all shadow-lg shadow-slate-200 active:scale-95 uppercase tracking-wider"
                      >
                        <UserCheck size={16} /> Orang Tua
                      </button>
                    )}
                    <div className={`flex items-center justify-center gap-2 py-4 px-3 text-[10px] font-black rounded-2xl border-2 uppercase tracking-wider
                      ${selectedMember.gender === 'Male' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>
                      <Users size={16} /> {getChildren(selectedMember.id).length} Anak
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                  <User size={36} className="text-slate-200" />
                </div>
                <h3 className="text-lg font-black text-slate-400 uppercase tracking-tighter">Profil Keluarga</h3>
                <p className="text-sm text-slate-400 max-w-[240px] mt-2 leading-relaxed font-medium">
                  Pilih salah satu nama untuk melihat detail informasi keluarga.
                </p>
              </div>
            )}

            {/* Statistik Ringkas */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-300">
               <h4 className="font-bold text-white/50 mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                 <ArrowRight size={14} className="text-blue-500" /> Ringkasan
               </h4>
               <div className="grid grid-cols-2 gap-6 relative z-10">
                  <div>
                    <p className="text-4xl font-black text-white">{familyData.length}</p>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Total Anggota</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-blue-500">
                      {familyData.length > 0 ? Math.max(...familyData.map(m => parseInt(m.generation) || 1)) : 0}
                    </p>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Generasi</p>
                  </div>
               </div>
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-10 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
            © 2024 Rosandf Big Family Directory
          </p>
        </footer>
      </div>
    </div>
  );
}
