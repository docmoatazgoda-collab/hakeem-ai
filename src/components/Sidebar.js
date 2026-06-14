'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Stethoscope, Sparkles, BookOpen, Settings, LogOut } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Sidebar({ profile }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const navItems = [
    {
      href: '/dashboard',
      label: 'مولد المحتوى',
      icon: Sparkles
    },
    {
      href: '/drafts',
      label: 'الأرشيف والمسودات',
      icon: BookOpen
    },
    {
      href: '/settings',
      label: 'إعدادات العيادة',
      icon: Settings
    }
  ];

  return (
    <aside className="glass-panel" style={{
      borderLeft: '1px solid hsl(var(--border-muted))',
      padding: '30px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: 0,
      height: '100%'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, hsl(var(--accent-mint)) 0%, hsl(var(--accent-teal)) 100%)',
            padding: '6px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Stethoscope size={20} color="#0b0f19" />
          </div>
          <span style={{ fontSize: '20px', fontWeight: '800' }}>
            حكيم<span className="gradient-text">.آي</span>
          </span>
        </Link>

        {/* Doctor Profile Info */}
        {profile && (
          <div style={{
            background: 'hsl(var(--bg-secondary))',
            border: '1px solid hsl(var(--border-muted))',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: 'hsl(var(--text-primary))' }}>{profile.doctor_name}</span>
            <span style={{ fontSize: '12px', color: 'hsl(var(--text-muted))' }}>{profile.specialty}</span>
          </div>
        )}

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className="btn-secondary" 
                style={{
                  justifyContent: 'flex-start',
                  background: isActive ? 'hsl(var(--bg-tertiary))' : 'transparent',
                  borderColor: isActive ? 'hsl(var(--accent-mint) / 0.3)' : 'transparent',
                  color: isActive ? 'hsl(var(--accent-mint))' : 'hsl(var(--text-secondary))',
                  fontWeight: isActive ? '700' : '500',
                  padding: '10px 16px',
                  border: isActive ? '1px solid' : 'none'
                }}
              >
                <Icon size={18} style={{ marginLeft: '10px' }} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <button 
        onClick={handleLogout} 
        className="btn-secondary" 
        style={{
          justifyContent: 'center',
          borderColor: 'hsl(var(--accent-rose) / 0.2)',
          color: 'hsl(var(--accent-rose))',
          background: 'transparent'
        }}
      >
        <LogOut size={16} style={{ marginLeft: '8px' }} />
        تسجيل خروج
      </button>
    </aside>
  );
}
