import React, { useState } from 'react'
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = ({ children }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }
  return (
    <div className='flex h-screen bg-neutral-50 dark:bg-slate-950 text-neutral-900 dark:text-slate-100 transition-colors duration-300'>
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className='flex-1 flex flex-col overflow-hidden relative'>
        {/* Ambient Dashboard Gradients */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

        <Header toggleSidebar={toggleSidebar} />
        <main className='flex-1 overflow-x-hidden overflow-y-auto p-6 z-10'>
          {children}
        </main>
      </div>

    </div>
  )
}

export default AppLayout
