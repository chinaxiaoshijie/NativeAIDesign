
import React, { useState } from 'react';
import { StrategicStep, PhaseStatus, ProductOptimization } from './types';
import PhaseCard from './components/PhaseCard';
import { getTransformationAdvice } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'products' | 'advisor'>('roadmap');
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAdvice, setLoadingAdvice] = useState<boolean>(false);

  // 团队分布统计
  const teamStats = {
    total: 50,
    rd: 20,
    groups: [
      { name: '理化生组', detail: '1架构/2后台/1前端/1终端' },
      { name: '自习室组', detail: '1架构/1后台/1终端(共用前端)' },
      { name: '固件OS', detail: '1开发' },
      { name: '测试组', detail: '3人' }
    ]
  };

  const roadmap: StrategicStep[] = [
    {
      id: 'p1',
      title: '组织认知升级与基础建设期',
      duration: '第1-2个月',
      goal: '消除AI恐惧，建立内部AI协作环境，解决前端人力瓶颈。',
      status: PhaseStatus.IN_PROGRESS,
      actions: [
        '引入Cursor/Copilot，重点提升"共用前端"的跨项目交付效率',
        '建立私有知识库，索引OS接口文档与理化生评分业务逻辑',
        '架构师牵头：梳理理化生与自习室的Agent共性底层',
        '测试组引入自动化AI测试脚本生成，缓解3人支撑2个大产品的压力'
      ]
    },
    {
      id: 'p2',
      title: '研发流程重塑与多端对齐',
      duration: '第3-5个月',
      goal: '利用AI实现多端（安卓/平板/Web）逻辑的一致性生成。',
      status: PhaseStatus.PLANNED,
      actions: [
        '推行"端侧AI优先"：OS开发配合终端开发实现算力下沉',
        '使用AI将复杂的理化生评分算法文档直接转化为后端接口代码',
        '前端引入Low-code AI工具，支持一套UI快速适配理化生与自习室',
        '建立自动化的视觉模型重训练Pipeline，缩短理化生评分迭代周期'
      ]
    },
    {
      id: 'p3',
      title: '产品全面Agent化与多模态集成',
      duration: '第6-9个月',
      goal: '理化生与自习室功能深度融合，形成“教-学-考”AI闭环。',
      status: PhaseStatus.PLANNED,
      actions: [
        '理化生系统：升级为“AI实时督考”，减少后端同步打分延迟',
        'AI自习室：集成多模态Agent，利用前端采集的手写/语音进行交互',
        '构建跨产品的统一“学生能力数字镜像”Agent',
        '实现OS层级的AI资源调度，确保平板运行大模型时不发热不掉帧'
      ]
    }
  ];

  const products: ProductOptimization[] = [
    {
      productName: '理化生智慧实验系统',
      currentTech: '离线视觉评分 + 安卓端回传',
      aiNativeTarget: '边缘侧实时多模态交互考场',
      keyMoves: ['底层OS配合模型裁剪实现0延时评分', '架构层实现多摄像头数据流并发处理', 'AI自动生成实验纠错语音指导']
    },
    {
      productName: 'AI自习系统',
      currentTech: 'Agent + 三方大模型 API',
      aiNativeTarget: '具备长期记忆的个性化私教',
      keyMoves: ['利用共享前端实现极致交互体验', '结合理化生考试数据进行针对性薄弱点补强', '自研轻量化RAG解决知识点更新滞后问题']
    }
  ];

  const handleFetchAdvice = async () => {
    setLoadingAdvice(true);
    const context = `
      公司规模：50人，研发20人。
      人力分布：
      - 理化生组：1架构、2后台、1前端、1终端。
      - AI自习室组：1架构、1后台、1终端、共用前端。
      - 固件OS：1人。
      - 测试：3人。
      痛点：前端人力高度共享，理化生业务逻辑复杂，OS底层与上层应用需深度协同。
      目标：转型为AI-Native公司，提升交付效率与产品竞争力。
    `;
    const advice = await getTransformationAdvice(context);
    setAiAdvice(advice);
    setLoadingAdvice(false);
  };

  const handlePrint = () => {
    // 触发打印对话框。用户在对话框中选择“另存为PDF”即可。
    // 我们已通过 CSS 确保打印出的内容按 roadmap -> products -> advice 的顺序排列。
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 浏览器显示的 Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">AI-Native 转型战略地图</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => setActiveTab('roadmap')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'roadmap' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                转型路线图
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                产品进化论
              </button>
              <button 
                onClick={() => setActiveTab('advisor')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'advisor' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                专家咨询
              </button>
            </nav>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-black transition-all shadow-md active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              保存为 PDF
            </button>
          </div>
        </div>
      </header>

      {/* 浏览器显示的统计面板 */}
      <main className="max-w-6xl mx-auto px-4 py-8 no-print">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg">
            <p className="text-indigo-100 text-xs font-medium mb-1 uppercase">总人数</p>
            <h2 className="text-2xl font-bold">50 人</h2>
            <div className="mt-2 text-[10px] text-indigo-200">全公司规模</div>
          </div>
          {teamStats.groups.map((group, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
              <p className="text-slate-500 text-xs font-medium mb-1">{group.name}</p>
              <h2 className="text-sm font-bold text-slate-800 leading-tight">{group.detail}</h2>
            </div>
          ))}
        </section>

        {activeTab === 'roadmap' && (
          <section className="animate-fade-in max-w-4xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">分步推进方案</h2>
              <p className="text-slate-500 mt-1">针对 20 人研发团队定制的“人力杠杆”AI转型策略</p>
            </div>
            <div>
              {roadmap.map((step, index) => (
                <PhaseCard key={step.id} step={step} index={index} />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'products' && (
          <section className="animate-fade-in space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {products.map((product, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col">
                  <div className="p-6 bg-slate-50 border-b border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900">{product.productName}</h3>
                    <p className="text-xs text-slate-500 mt-1">{product.currentTech}</p>
                  </div>
                  <div className="p-6 flex-grow">
                    <div className="mb-6">
                      <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">AI原生目标</p>
                      <p className="text-lg font-bold text-slate-800">{product.aiNativeTarget}</p>
                    </div>
                    <div className="space-y-3">
                      {product.keyMoves.map((move, i) => (
                        <div key={i} className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl">
                          <span className="shrink-0 w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                            {i + 1}
                          </span>
                          <span className="text-sm text-slate-600 leading-tight">{move}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'advisor' && (
          <section className="animate-fade-in max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Gemini 专家建议</h2>
                  <p className="text-slate-500 text-sm mt-1 italic">已录入人力分布与产品架构信息</p>
                </div>
                <button 
                  onClick={handleFetchAdvice}
                  disabled={loadingAdvice}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingAdvice ? '专家构思中...' : '重新诊断建议'}
                </button>
              </div>
              <div className="p-8 min-h-[400px]">
                {!aiAdvice && !loadingAdvice ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 text-slate-300">
                    <p className="text-center">点击按钮生成针对“共享前端”和“OS底层”的定制化建议</p>
                  </div>
                ) : (
                  <div className="prose prose-indigo max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {aiAdvice}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* --- 专门用于打印导出的视图：在屏幕上隐藏，在打印时按顺序显示 --- */}
      <div className="print-only bg-white p-12">
        <header className="border-b-4 border-indigo-600 pb-6 mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900">AI-Native 转型战略报告</h1>
            <p className="text-slate-500 mt-2">受众：研发管理团队 | 机密</p>
          </div>
          <div className="text-right text-slate-400 text-sm">
            生成日期: {new Date().toLocaleDateString('zh-CN')}
          </div>
        </header>

        {/* 顺序 1: 路线图 */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-indigo-700 mb-8 pb-2 border-b">1. 转型阶段与路线图 (Roadmap)</h2>
          <div className="space-y-8">
            {roadmap.map((step, idx) => (
              <div key={step.id} className="border border-slate-200 rounded-xl p-6 bg-slate-50 break-inside-avoid">
                <div className="flex justify-between mb-4">
                  <h3 className="text-xl font-bold">阶段 {idx + 1}: {step.title}</h3>
                  <span className="text-slate-500 font-mono">{step.duration}</span>
                </div>
                <div className="mb-4">
                  <span className="text-xs font-bold text-indigo-500 uppercase">目标:</span>
                  <p className="text-slate-700 font-medium">{step.goal}</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {step.actions.map((act, i) => (
                    <div key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-indigo-400 font-bold">•</span> {act}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 顺序 2: 产品进化 */}
        <section className="mb-20 page-break-before">
          <h2 className="text-2xl font-bold text-indigo-700 mb-8 pb-2 border-b">2. 产品 AI-Native 进化路线</h2>
          <div className="grid grid-cols-1 gap-10">
            {products.map((product, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-8 break-inside-avoid">
                <h3 className="text-2xl font-bold mb-4">{product.productName}</h3>
                <div className="flex gap-10 mb-6">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">当前现状</p>
                    <p className="text-slate-600 text-sm">{product.currentTech}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-indigo-500 uppercase mb-1">原生目标</p>
                    <p className="text-indigo-900 font-bold">{product.aiNativeTarget}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-700">核心动作：</p>
                  {product.keyMoves.map((m, i) => (
                    <p key={i} className="text-sm text-slate-600 bg-white p-2 border border-slate-100 rounded">• {m}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 顺序 3: 专家建议 */}
        {aiAdvice && (
          <section className="page-break-before">
            <h2 className="text-2xl font-bold text-indigo-700 mb-8 pb-2 border-b">3. Gemini 专家深度咨询报告</h2>
            <div className="bg-slate-50 p-10 rounded-2xl border border-slate-200 prose prose-indigo max-w-none">
              <div className="whitespace-pre-wrap font-serif text-slate-800 leading-relaxed">
                {aiAdvice}
              </div>
            </div>
          </section>
        )}

        <footer className="mt-20 pt-10 border-t text-center text-slate-300 text-xs italic">
          AI-Native 转型加速器系统生成 · 助力教育科技研发升级
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        /* 默认隐藏打印部分 */
        .print-only {
          display: none;
        }

        /* 打印模式下的全局样式调整 */
        @media print {
          body {
            background-color: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          .page-break-before {
            page-break-before: always;
          }
          .break-inside-avoid {
            break-inside: avoid;
          }
          @page {
            margin: 1.5cm;
            size: A4;
          }
        }
      `}} />
    </div>
  );
};

export default App;
