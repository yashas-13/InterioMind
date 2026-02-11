
import React from 'react';

const FeatureCard = ({ icon, title, items }: { icon: string, title: string, items: string[] }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-500">
    <div className="text-4xl mb-6">{icon}</div>
    <h4 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">{title}</h4>
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
          <span className="text-primary-500 mt-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
          </span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const PlanCard = ({ name, subtitle, features, highlight = false }: { name: string, subtitle: string, features: string[], highlight?: boolean }) => (
  <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col h-full ${highlight ? 'bg-primary-600 border-primary-600 text-white shadow-2xl scale-105 z-10' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white'}`}>
    <div className="mb-6">
      <h4 className={`text-2xl font-black uppercase tracking-tighter ${highlight ? 'text-white' : 'text-primary-600'}`}>{name}</h4>
      <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${highlight ? 'text-primary-100' : 'text-gray-400'}`}>{subtitle}</p>
    </div>
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-sm font-medium">
          <svg className={`w-5 h-5 ${highlight ? 'text-primary-200' : 'text-primary-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          {f}
        </li>
      ))}
    </ul>
    <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${highlight ? 'bg-white text-primary-600 hover:bg-gray-100 shadow-xl' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20'}`}>
      Select {name}
    </button>
  </div>
);

export const ProblemSolution: React.FC = () => {
  return (
    <div className="w-full space-y-32 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* 1. Problem Section */}
      <section className="space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 dark:border-red-900/30">
            The Industry Challenge
          </span>
          <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            WHY TRADITIONAL DESIGN <span className="text-primary-600">STRUGGLES.</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Manual workflows lead to lost time, lower profits, and stressed teams. We've identified the core friction points in the professional interior designer's journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Requirement Drift", desc: "Unclear client requirements leading to misaligned initial drafts and confusion." },
            { title: "Revision Fatigue", desc: "Too many design revisions that drain creative spirit and studio profitability." },
            { title: "Costing Lag", desc: "Time-consuming manual costing and quotations slow down the approval process." },
            { title: "Budget Friction", desc: "Budget disputes and project delays caused by late-stage pricing surprises." },
            { title: "Coordination Gaps", desc: "Too much manual coordination between vendors, clients, and design teams." },
            { title: "Scaling Barrier", desc: "Difficulty growing beyond a few projects without systemic operational collapse." }
          ].map((p, i) => (
            <div key={i} className="p-8 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 flex flex-col gap-4 group hover:border-red-200 dark:hover:border-red-900 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h5 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">{p.title}</h5>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Platform Features Breakdown */}
      <section className="space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary-100 dark:border-primary-900/30">
            Platform Capabilities
          </span>
          <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            THE AI-DRIVEN <span className="text-primary-600">SOLUTION.</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
            Your smart digital assistant supporting the journey from inquiry to final delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon="🧠" 
            title="Smart Understanding" 
            items={["Captures client needs clearly", "Identifies style and budget preferences", "Structured project briefs automatically"]} 
          />
          <FeatureCard 
            icon="🎨" 
            title="Faster Design" 
            items={["Suggests design styles and themes", "Generates visual mood boards", "Reduces revision and approval delays"]} 
          />
          <FeatureCard 
            icon="💰" 
            title="Clear Costing" 
            items={["Prepares accurate cost estimates", "Generates professional quotations", "Avoids pricing confusion and disputes"]} 
          />
          <FeatureCard 
            icon="📋" 
            title="Project Tracking" 
            items={["Organizes projects into clear stages", "Tracks progress in one dashboard", "Keeps teams and clients aligned"]} 
          />
          <FeatureCard 
            icon="🤝" 
            title="Client Experience" 
            items={["Branded client portal for designs", "Digital design approvals", "Fewer calls and misunderstandings"]} 
          />
          <div className="bg-primary-600 p-8 rounded-[2.5rem] text-white flex flex-col justify-center items-center text-center shadow-2xl shadow-primary-500/30">
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Key Benefits</h4>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] space-y-2">
              <p>⏱️ Save 50–70% design time</p>
              <p>💼 Look more professional</p>
              <p>📉 Reduce rework and disputes</p>
              <p>📈 Increase profit margins</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pricing Section */}
      <section className="space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
            PRICING <span className="text-primary-600">PLANS.</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">
            Tailored solutions for independent designers and global firms alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          <PlanCard 
            name="Starter" 
            subtitle="Solo Designers" 
            features={["Smart Inquiries", "Mood Boards", "Basic Costing", "Client Approvals"]} 
          />
          <PlanCard 
            name="Professional" 
            subtitle="For Studios" 
            features={["3D Design Views", "Automatic Quotations", "Project Stage Tracking", "Branded Client Portal"]} 
            highlight 
          />
          <PlanCard 
            name="Studio+" 
            subtitle="Growing Firms" 
            features={["Profit Tracking", "Design Change Tracking", "Vendor Coordination", "Automated Reminders"]} 
          />
          <PlanCard 
            name="Enterprise" 
            subtitle="Large Firms" 
            features={["Virtual Walkthroughs", "Client Chat Assistant", "White-label Branding", "Custom Workflows"]} 
          />
        </div>
      </section>

      {/* 4. Audience Target */}
      <section className="bg-gray-50 dark:bg-gray-900/50 rounded-[4rem] p-12 sm:p-20 text-center border border-gray-100 dark:border-gray-700">
         <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-12">Who It’s For</h3>
         <div className="flex flex-wrap justify-center gap-12">
            {[
              "Freelance Designers",
              "Mid-size Design Studios",
              "Growing Interior Firms",
              "Enterprise Design Brands"
            ].map((target, idx) => (
              <div key={idx} className="flex flex-col items-center">
                 <div className="w-2 h-2 rounded-full bg-primary-500 mb-4" />
                 <p className="text-xs font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest">{target}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Result Section */}
      <div className="text-center max-w-4xl mx-auto space-y-12">
         <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
         <h2 className="text-4xl sm:text-6xl font-black text-primary-600 leading-none tracking-tighter uppercase italic">
           More Projects. <br className="sm:hidden" />
           Happier Clients. <br className="sm:hidden" />
           Higher Profits. <br className="sm:hidden" />
           Less Stress.
         </h2>
         <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Interior AI Pro • Built specifically for interior designers</p>
      </div>
    </div>
  );
};
