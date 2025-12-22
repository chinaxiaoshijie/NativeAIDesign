import React, { useState, useRef, useEffect } from 'react';
import { StrategicStep, PhaseStatus, ProductOptimization, AppConfig, StrategicPlan } from './types';
import PhaseCard from './components/PhaseCard';
import { generateStrategicPlan } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'products' | 'advisor' | 'config'>('config');
  const [loading, setLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  // 核心配置状态
  const [config, setConfig] = useState<AppConfig>({
    team: {
      leader: 1,
      dfx: 1,
      pcbDevs: { arch: 1, backend: 2, terminal: 1 },
      studyDevs: { arch: 1, backend: 1, terminal: 1 },
      sharedFrontend: 1,
      firmwareOs: 1,
      coreBackend: 3,
      test: 3
    },
    pcb: {
      schools: 200,
      labs: 600,
      units: 14400,
      status: "已交付运营，推动市/区级大平台"
    },
    study: {
      schools: 3,
      units: 300,
      status: "初高中自习场景落地，内容丰富度待提升"
    },
    constraints: "前端单点瓶颈，业务架构师售前压力极大，万级设备运维负载重"
  });

  // AI 生成的战略结果
  const [plan, setPlan] = useState<StrategicPlan | null>(null);

  const handleUpdateConfig = (path: string, value: any) => {
    const keys = path.split('.');
    setConfig(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let current = next;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await generateStrategicPlan(config);
      setPlan(result);
      setActiveTab('roadmap');
    } catch (err) {
      alert("AI 生成失败，请检查网络或配置项。");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const h2p = (window as any).html2pdf;
    if (!h2p || !pdfContentRef.current) return;
    setIsExporting(true);
    try {
      const element = pdfContentRef.current;
      element.style.display = 'block';
      await h2p().set({
        margin: 10,
        filename: `AI-Native-Custom-Strategy.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(element).save();
      element.style.display = 'none';
    } catch (err) {
      console.error(err);
    } finally { setIsExporting(false); }
  };

  // Fix: Explicitly cast nested object reduction result to number to avoid 'unknown' type error on line 91
  const totalDevs = Object.values(config.team).reduce((acc: number, val: any): number => {
    if (typeof val === 'number') return acc + val;
    if (val && typeof val === 'object') {
      const subTotal = Object.values(val).reduce((a: number, b: any): number => a + (Number(b) || 0), 0);
      return acc + (subTotal as number);
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      <header className="bg-white/95 border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">AI-NATIVE ENGINE <span className="text-blue-600">v6.0</span></h1>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Strategic Quality Assurance</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              {(['config', 'roadmap', 'products', 'advisor'] as const).map(tab => (
                <button 
                  key={tab} 
                  onClick={() => (tab !== 'config' && !plan) ? alert('请先生成战略！') : setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'} ${(tab !== 'config' && !plan) ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {tab === 'config' ? '配置中心' : tab === 'roadmap' ? '转型路线' : tab === 'products' ? '业务看板' : '诊断意见'}
                </button>
              ))}
            </nav>
            <button 
              onClick={runAnalysis} 
              disabled={loading}
              className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-sm font-black shadow-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'AI 战略生成中...' : '重新生成全链路战略'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 输入预览看板 */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">当前配置规模</p>
            <h3 className="text-3xl font-black">{totalDevs} 人 <span className="text-blue-400 text-sm">开发部</span></h3>
            <p className="text-[10px] text-slate-500 mt-2 font-bold truncate">DFX: {config.team.dfx} | 测试: {config.team.test} | 前端: {config.team.sharedFrontend}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-2">理化生</p>
            <h3 className="text-2xl font-black text-slate-800">{config.pcb.units} <span className="text-xs text-slate-400">终端</span></h3>
            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase truncate">{config.pcb.schools} 所校 / {config.pcb.labs} 实验室</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">自习室</p>
            <h3 className="text-2xl font-black text-slate-800">{config.study.units} <span className="text-xs text-slate-400">终端</span></h3>
            <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase truncate">{config.study.schools} 所校</p>
          </div>
          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-center gap-4">
             <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             </div>
             <div>
               <p className="text-red-900 text-[10px] font-black uppercase">主要约束</p>
               <p className="text-[11px] text-red-700 font-bold line-clamp-2">{config.constraints}</p>
             </div>
          </div>
        </section>

        {activeTab === 'config' && (
          <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            {/* 团队配置编辑器 */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                   <span className="w-2 h-8 bg-blue-600 rounded-full"></span> 团队编制设定
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <label className="block">
                      <span className="text-sm font-black text-slate-700 uppercase tracking-widest mb-3 block">部门 Leader</span>
                      <input type="number" value={config.team.leader} onChange={e => handleUpdateConfig('team.leader', +e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-black focus:border-blue-500 focus:ring-0 outline-none transition-all" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-black text-slate-700 uppercase tracking-widest mb-3 block">独立 DFX 架构师</span>
                      <input type="number" value={config.team.dfx} onChange={e => handleUpdateConfig('team.dfx', +e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-black focus:border-blue-500 focus:ring-0 outline-none transition-all" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-black text-red-600 uppercase tracking-widest mb-3 block italic">测试团队 (QA)</span>
                      <input type="number" value={config.team.test} onChange={e => handleUpdateConfig('team.test', +e.target.value)} className="w-full bg-red-50 border-2 border-red-100 p-4 rounded-2xl font-black focus:border-red-500 focus:ring-0 outline-none transition-all" />
                    </label>
                    <div className="p-6 bg-blue-50/50 rounded-3xl space-y-4">
                       <p className="text-[10px] font-black text-blue-600 uppercase">理化生小组线</p>
                       <div className="grid grid-cols-3 gap-4">
                         <label className="text-[10px] font-bold text-slate-500">架构/PM<input type="number" value={config.team.pcbDevs.arch} onChange={e => handleUpdateConfig('team.pcbDevs.arch', +e.target.value)} className="w-full mt-1 bg-white p-2 rounded-xl border border-blue-100" /></label>
                         <label className="text-[10px] font-bold text-slate-500">后端<input type="number" value={config.team.pcbDevs.backend} onChange={e => handleUpdateConfig('team.pcbDevs.backend', +e.target.value)} className="w-full mt-1 bg-white p-2 rounded-xl border border-blue-100" /></label>
                         <label className="text-[10px] font-bold text-slate-500">终端<input type="number" value={config.team.pcbDevs.terminal} onChange={e => handleUpdateConfig('team.pcbDevs.terminal', +e.target.value)} className="w-full mt-1 bg-white p-2 rounded-xl border border-blue-100" /></label>
                       </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="p-6 bg-emerald-50/50 rounded-3xl space-y-4">
                       <p className="text-[10px] font-black text-emerald-600 uppercase">AI 自习室小组线</p>
                       <div className="grid grid-cols-3 gap-4">
                         <label className="text-[10px] font-bold text-slate-500">架构/PM<input type="number" value={config.team.studyDevs.arch} onChange={e => handleUpdateConfig('team.studyDevs.arch', +e.target.value)} className="w-full mt-1 bg-white p-2 rounded-xl border border-emerald-100" /></label>
                         <label className="text-[10px] font-bold text-slate-500">后端<input type="number" value={config.team.studyDevs.backend} onChange={e => handleUpdateConfig('team.studyDevs.backend', +e.target.value)} className="w-full mt-1 bg-white p-2 rounded-xl border border-emerald-100" /></label>
                         <label className="text-[10px] font-bold text-slate-500">终端<input type="number" value={config.team.studyDevs.terminal} onChange={e => handleUpdateConfig('team.studyDevs.terminal', +e.target.value)} className="w-full mt-1 bg-white p-2 rounded-xl border border-emerald-100" /></label>
                       </div>
                    </div>
                    <label className="block">
                      <span className="text-sm font-black text-slate-700 uppercase tracking-widest mb-3 block">共享前端 (核心瓶颈)</span>
                      <input type="number" value={config.team.sharedFrontend} onChange={e => handleUpdateConfig('team.sharedFrontend', +e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-black focus:border-blue-500 focus:ring-0 outline-none transition-all" />
                    </label>
                    <label className="block">
                      <span className="text-sm font-black text-slate-700 uppercase tracking-widest mb-3 block">固件 OS 开发者</span>
                      <input type="number" value={config.team.firmwareOs} onChange={e => handleUpdateConfig('team.firmwareOs', +e.target.value)} className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-black focus:border-blue-500 focus:ring-0 outline-none transition-all" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                   <span className="w-2 h-8 bg-slate-900 rounded-full"></span> 核心痛点与外部限制
                </h3>
                <textarea 
                  value={config.constraints} 
                  onChange={e => handleUpdateConfig('constraints', e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-3xl font-bold text-slate-700 focus:border-slate-900 outline-none h-32 transition-all"
                  placeholder="描述当前团队遇到的最大阻力..."
                />
              </div>
            </div>

            {/* 业务细节编辑器 */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-blue-600">理化生业务</h3>
                <div className="space-y-4">
                  <label className="block text-xs font-black text-slate-400">学校总数<input type="number" value={config.pcb.schools} onChange={e => handleUpdateConfig('pcb.schools', +e.target.value)} className="w-full mt-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-black" /></label>
                  <label className="block text-xs font-black text-slate-400">实验室总数<input type="number" value={config.pcb.labs} onChange={e => handleUpdateConfig('pcb.labs', +e.target.value)} className="w-full mt-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-black" /></label>
                  <label className="block text-xs font-black text-slate-400">终端总数<input type="number" value={config.pcb.units} onChange={e => handleUpdateConfig('pcb.units', +e.target.value)} className="w-full mt-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-black" /></label>
                  <label className="block text-xs font-black text-slate-400">当前核心目标<textarea value={config.pcb.status} onChange={e => handleUpdateConfig('pcb.status', e.target.value)} className="w-full mt-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold h-24" /></label>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-emerald-600">AI 自习室业务</h3>
                <div className="space-y-4">
                  <label className="block text-xs font-black text-slate-400">学校总数<input type="number" value={config.study.schools} onChange={e => handleUpdateConfig('study.schools', +e.target.value)} className="w-full mt-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-black" /></label>
                  <label className="block text-xs font-black text-slate-400">终端总数<input type="number" value={config.study.units} onChange={e => handleUpdateConfig('study.units', +e.target.value)} className="w-full mt-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-black" /></label>
                  <label className="block text-xs font-black text-slate-400">当前核心目标<textarea value={config.study.status} onChange={e => handleUpdateConfig('study.status', e.target.value)} className="w-full mt-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold h-24" /></label>
                </div>
              </div>
            </div>
          </div>
        )}

        {plan && (
          <div className="animate-fade-in">
            {activeTab === 'roadmap' && (
              <div className="max-w-5xl">
                {plan.roadmap.map((step, index) => (
                  <PhaseCard key={step.id} step={step} index={index} />
                ))}
              </div>
            )}

            {activeTab === 'products' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {plan.products.map((product, idx) => (
                  <div key={idx} className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col group transition-all">
                    <div className="p-12 bg-slate-900 relative">
                      <div className="absolute top-8 right-8 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-tighter">
                        {idx === 0 ? 'PCB SCALE' : 'CONTENT SCALE'}
                      </div>
                      <h3 className="text-4xl font-black text-white">{product.productName}</h3>
                      <p className="text-slate-400 text-xs mt-4 font-mono font-bold tracking-widest uppercase italic">Tech: {product.currentTech}</p>
                    </div>
                    <div className="p-12 space-y-10 flex-grow">
                      <div>
                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-4">AI-Native 愿景目标</label>
                        <p className="text-2xl font-black text-slate-800 leading-tight italic">"{product.aiNativeTarget}"</p>
                      </div>
                      <div className="space-y-4">
                        {product.keyMoves.map((move, i) => (
                          <div key={i} className="flex gap-6 items-center bg-slate-50 p-6 rounded-[1.5rem] border border-transparent hover:border-slate-200 transition-all">
                            <span className="shrink-0 w-10 h-10 bg-white border-4 border-slate-900 text-slate-900 rounded-2xl flex items-center justify-center text-sm font-black">{i+1}</span>
                            <p className="text-sm text-slate-700 font-black leading-snug">{move}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'advisor' && (
              <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-slate-200">
                  <div className="p-16 border-b border-slate-50 bg-slate-50/40">
                    <h2 className="text-5xl font-black text-slate-900 leading-[1.1]">定制化 CTO <br/><span className="text-blue-600">会诊意见报告</span></h2>
                  </div>
                  <div className="p-16 min-h-[600px] bg-white">
                    <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap leading-[2.3] font-bold text-xl antialiased selection:bg-blue-100">
                      {plan.advice}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- PDF 容器 (隐藏) --- */}
      <div ref={pdfContentRef} style={{ display: 'none', width: '800px', padding: '60px', backgroundColor: '#fff' }}>
        <div style={{ borderBottom: '10px solid #0f172a', paddingBottom: '30px', marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: '0' }}>AI-Native 定制质量战略报告</h1>
            <p style={{ color: '#64748b', margin: '15px 0 0 0', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '8px', fontSize: '12px' }}>Personalized Strategic Roadmap v6.0</p>
          </div>
        </div>
        {plan && (
          <div>
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '900', borderLeft: '10px solid #2563eb', paddingLeft: '20px', marginBottom: '20px' }}>核心诊断意见</h2>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '2.0', color: '#1e293b' }}>{plan.advice}</div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.2, 1, 0.2, 1) forwards; }
      `}} />
    </div>
  );
};

export default App;