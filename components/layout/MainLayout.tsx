import React from 'react';
import Sidebar from './Sidebar';
import Player from './Player';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {children}
      </main>
      <Player />
    </div>
  );
};

export default MainLayout; 