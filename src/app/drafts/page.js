'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Sidebar from '@/components/Sidebar';
import { 
  Search, 
  Copy, 
  Trash2, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  MessageCircle 
} from 'lucide-react';

export default function DraftsPage() {
  const router = useRouter();

  // Auth and Profile state
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Drafts state
  const [drafts, setDrafts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDraftId, setExpandedDraftId] = useState(null);
  const [copiedDraftId, setCopiedDraftId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Load Profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (prof) {
        setProfile(prof);
      } else {
        setProfile({
          doctor_name: user.user_metadata?.doctor_name || 'د. محمد عبد الرحمن',
          specialty: user.user_metadata?.specialty || 'ممارس عام'
        });
      }

      // Load Saved Drafts
      await loadDrafts(user.id);
      setLoading(false);
    }
    init();
  }, [router]);

  const loadDrafts = async (userId) => {
    const { data: list, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (list) {
      setDrafts(list);
    }
  };

  const confirmDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setDrafts(drafts.filter(d => d.id !== id));
      if (expandedDraftId === id) setExpandedDraftId(null);
      setConfirmDeleteId(null);
    } catch (err) {
      console.error('Error deleting draft:', err);
    }
  };

  const handleCopy = async (text, id) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedDraftId(id);
      setTimeout(() => setCopiedDraftId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const filteredDrafts = drafts.filter(draft => {
    const topicMatch = draft.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    const contentMatch = draft.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return topicMatch || contentMatch;
  });

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': 
        return (
          <svg width="14" height="14" fill="#1877f2" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'instagram': 
        return (
          <svg width="14" height="14" fill="none" stroke="#e1306c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        );
      case 'twitter': 
        return (
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      default: return <MessageCircle size={14} color="hsl(var(--accent-mint))" style={{ display: 'inline-block', verticalAlign: 'middle' }} />;
    }
  };

  const getPlatformLabel = (platform) => {
    switch (platform) {
      case 'facebook': return 'فيسبوك';
      case 'instagram': return 'إنستجرام';
      case 'twitter': return 'تويتر/X';
      case 'tiktok': return 'فيديو Reels/TikTok';
      default: return 'منشور عام';
    }
  };

  if (loading && !user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'hsl(var(--bg-primary))',
        color: 'hsl(var(--accent-mint))',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        جاري تحميل الأرشيف الطبي...
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', minHeight: '100vh', background: 'hsl(var(--bg-primary))' }} className="md-grid-cols-layout">
      
      {/* Side Navigation */}
      <Sidebar profile={profile} />

      {/* Main Workspace Area */}
      <main style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px', overflowY: 'auto' }}>
        
        {/* Header Title */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>المسودات المحفوظة للأطباء</h1>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '14px', marginTop: '4px' }}>استعرض منشوراتك الطبية السابقة وقم بنسخها أو إدارتها بسهولة</p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'hsl(var(--text-muted))' }}>
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="ابحث في المسودات بالكلمات المفتاحية أو العناوين..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingRight: '46px' }}
          />
        </div>

        {/* Drafts Listing */}
        {filteredDrafts.length === 0 ? (
          <div className="glass-panel" style={{
            padding: '60px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '16px',
            color: 'hsl(var(--text-muted))',
            minHeight: '300px'
          }}>
            <BookOpen size={48} style={{ strokeWidth: 1 }} />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'hsl(var(--text-secondary))' }}>
                {searchQuery ? 'لا توجد نتائج بحث مطابقة' : 'لا توجد مسودات محفوظة حتى الآن'}
              </h3>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>
                {searchQuery ? 'جرب البحث بكلمات أخرى.' : 'ابدأ بصياغة المنشورات وحفظها من لوحة التوليد لتظهر هنا.'}
              </p>
            </div>
            {!searchQuery && (
              <Link href="/dashboard" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px', textDecoration: 'none', marginTop: '10px' }}>
                اذهب لتوليد منشورك الأول
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredDrafts.map((draft) => {
              const isExpanded = expandedDraftId === draft.id;
              
              return (
                <div 
                  key={draft.id}
                  className="glass-panel animate-fade-in"
                  style={{
                    borderRight: isExpanded ? '4px solid hsl(var(--accent-mint))' : '1px solid hsl(var(--border-muted))',
                    padding: '24px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div 
                    onClick={() => setExpandedDraftId(isExpanded ? null : draft.id)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{draft.topic}</h3>
                        <span className="badge badge-mint" style={{ padding: '2px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {getPlatformIcon(draft.platform)}
                          {getPlatformLabel(draft.platform)}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'hsl(var(--text-muted))' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} />
                          {new Date(draft.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {/* Expanded Content Details */}
                  {isExpanded && (
                    <div className="animate-fade-in" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid hsl(var(--border-muted))', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* Rich Content Editor style view */}
                      <div style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid hsl(var(--border-muted))',
                        borderRadius: '10px',
                        padding: '20px',
                        lineHeight: '1.8',
                        fontSize: '15px',
                        whiteSpace: 'pre-wrap',
                        color: 'hsl(var(--text-primary))'
                      }}>
                        {draft.content}
                      </div>

                      {/* Designer Prompt Helper */}
                      {draft.designer_prompt && (
                        <div style={{
                          background: 'hsl(var(--bg-secondary))',
                          border: '1px solid hsl(var(--border-muted))',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: 'hsl(var(--accent-teal))' }}>برومبت الصورة المساعد (Prompt):</span>
                          <span style={{ fontSize: '12px', fontFamily: 'var(--font-english)', direction: 'ltr', textAlign: 'left', color: 'hsl(var(--text-muted))' }}>
                            {draft.designer_prompt}
                          </span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-end', alignItems: 'center' }}>
                        {confirmDeleteId === draft.id ? (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: 'hsl(var(--accent-rose))', fontWeight: 'bold' }}>هل أنت متأكد؟</span>
                            <button 
                              onClick={() => confirmDelete(draft.id)}
                              className="btn-primary" 
                              style={{ padding: '6px 12px', fontSize: '12px', background: 'hsl(var(--accent-rose))', borderColor: 'hsl(var(--accent-rose))', color: '#fff' }}
                            >
                              نعم
                            </button>
                            <button 
                              onClick={() => setConfirmDeleteId(null)}
                              className="btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleCopy(draft.content, draft.id)}
                              className="btn-primary" 
                              style={{ padding: '8px 16px', fontSize: '13px' }}
                            >
                              {copiedDraftId === draft.id ? (
                                <>
                                  <Check size={14} style={{ marginLeft: '4px' }} /> تم النسخ!
                                </>
                              ) : (
                                <>
                                  <Copy size={14} style={{ marginLeft: '4px' }} /> نسخ المنشور
                                </>
                              )}
                            </button>

                            <button 
                              onClick={() => setConfirmDeleteId(draft.id)}
                              className="btn-secondary" 
                              style={{ 
                                padding: '8px 16px', 
                                fontSize: '13px', 
                                borderColor: 'hsl(var(--accent-rose) / 0.3)', 
                                color: 'hsl(var(--accent-rose))' 
                              }}
                            >
                              <Trash2 size={14} style={{ marginLeft: '4px' }} /> حذف
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Embedded CSS Responsive helper */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .md-grid-cols-layout {
            grid-template-columns: 280px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
