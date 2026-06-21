// Component handling the collapsible sidebar logic, hover effects, and active state.
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Settings, Wallet, Zap, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Portfolio', href: '/portfolio', icon: Zap },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Sidebar Container */}
      <aside className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} bg-gray-800 text-white flex flex-col border-r`}>
        
        {/* Logo/Title Area */}
        <div className={`p-4 flex items-center justify-between h-16 ${isCollapsed ? 'justify-center' : ''}`}>
          {!isCollapsed && <h1 className="text-2xl font-bold text-indigo-400">TrustLance</h1>}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded hover:bg-gray-700 transition"
            aria-label={isCollapsed ? "Expand Menu" : "Collapse Menu"}
          >
            {isCollapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer/Logout Area (Only visible when expanded) */}
        <div className={`p-4 border-t ${isCollapsed ? 'hidden' : 'block'}`}>
             <button className="flex items-center w-full text-left p-3 rounded-lg text-red-400 hover:bg-gray-700 transition">
                <LogOut className="w-5 h-5 mr-3" />
                Logout
            </button>
        </div>

      </aside>
    </>
  );
}