import React from 'react';
import Link from 'next/link';
import { 
  HomeIcon, 
  SearchIcon, 
  LibraryIcon, 
  PlusCircleIcon, 
  HeartIcon 
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: HomeIcon, label: 'Home', href: '/' },
    { icon: SearchIcon, label: 'Discover', href: '/discover' },
    { icon: LibraryIcon, label: 'Library', href: '/library' },
    { icon: PlusCircleIcon, label: 'Create Playlist', href: '/playlists/new' },
    { icon: HeartIcon, label: 'Liked Songs', href: '/liked' },
  ];

  return (
    <div className="w-64 h-full bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">reso</h1>
      </div>
      
      <nav className="mt-6 flex-1">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium">US</span>
          </div>
          <div>
            <p className="font-medium">User Name</p>
            <p className="text-sm text-muted-foreground">View Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 