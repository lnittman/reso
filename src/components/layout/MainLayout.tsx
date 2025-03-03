"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { Player } from '../player/Player';
import { List } from '@phosphor-icons/react';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

function MobileHeader() {
  const { toggleSidebar } = useUIStore();
  
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b z-20 px-4 flex items-center">
      <button 
        className="text-foreground p-2 rounded-md"
        onClick={toggleSidebar}
        aria-label="Menu"
      >
        {React.createElement(List, { size: 24, weight: "duotone" })}
      </button>
      <h1 className="ml-2 text-xl font-bold">reso</h1>
    </header>
  );
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isSidebarOpen } = useUIStore();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      {/* Mobile overlay when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => useUIStore.getState().toggleSidebar()}
        />
      )}
      
      <MobileHeader />
      
      <main className="flex-1 lg:pl-64 pt-14 lg:pt-0 pb-16">
        <div className="container max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
      
      <Player />
    </div>
  );
} 