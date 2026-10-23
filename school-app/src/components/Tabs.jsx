export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/15">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                isActive
                  ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-emerald-900 shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
          >
            <i className={`${tab.icon} text-xs`}></i>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}