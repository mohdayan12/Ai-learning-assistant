import React from "react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/60 dark:border-slate-800/60 transition-colors duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300">
          {title}
        </h1>
        {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm transition-colors duration-300">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center shrink-0">{children}</div>}
    </div>
  );
};

export default PageHeader;
