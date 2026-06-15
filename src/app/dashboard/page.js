'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Sidebar from '@/components/Sidebar';
import { 
  Stethoscope, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Save, 
  Check, 
  AlertCircle, 
  AlertTriangle 
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  
  // Auth state
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Generator inputs
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [tone, setTone] = useState('friendly');
  const [audience, setAudience] = useState('general');
  const [useClinicInfo, setUseClinicInfo] = useState(true);

  // Generation result state
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [editorText, setEditorText] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftError, setDraftError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load user session and profile info
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      
      // Load profile info
      const { data: prof, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (prof) {
        setProfile(prof);
      } else {
        // Fallback for simulated profile
        setProfile({
          doctor_name: user.user_metadata?.doctor_name || 'د. محمد عبد الرحمن',
          specialty: user.user_metadata?.specialty || 'ممارس عام',
          clinic_address: 'القاهرة، مصر',
          phone_number: '01000000000',
          booking_link: '',
          disclaimer_template: 'هذا المنشور لغرض التثقيف الطبي فقط ولا يغني عن استشارة الطبيب المختص.'
        });
      }
      setLoadingUser(false);
    }
    checkUser();
  }, [router]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);
    setResult(null);
    setEditorText('');
    setSaved(false);
    setCopied(false);
    setErrorMessage(null);
    setDraftError(null);

    try {
      const clinicInfoPayload = {
        enabled: useClinicInfo,
        doctorName: profile?.doctor_name,
        specialty: profile?.specialty,
        phone: profile?.phone_number,
        address: profile?.clinic_address,
        bookingLink: profile?.booking_link,
        disclaimer: profile?.disclaimer_template
      };

      const sessionData = await supabase.auth.getSession();
      const token = sessionData.data.session?.access_token || '';

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic,
          platform,
          tone,
          audience,
          clinicInfo: clinicInfoPayload
        })
      });

      let apiErrorMsg = 'فشل الاتصال بمولد الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.';
      if (!response.ok) {
        try {
          const errData = await response.json();
          if (errData.error) {
            apiErrorMsg = errData.error;
          }
        } catch (e) {}
        throw new Error(apiErrorMsg);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      setEditorText(data.content);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'حدث خطأ أثناء التوليد.');
    } finally {
      setGenerating(false);
    }
  };

  // Replace term in the editor with simplified term
  const replaceTerm = (original, simplified) => {
    if (!editorText) return;
    // Safe global replace without RegExp escaping issues
    const newText = editorText.replaceAll(original, simplified);
    setEditorText(newText);
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(editorText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = editorText;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSaveDraft = async () => {
    if (!editorText || !user) return;
    setSavingDraft(true);
    setDraftError(null);
    setSaved(false);
    
    try {
      const { error } = await supabase.from('drafts').insert({
        user_id: user.id,
        topic,
        platform,
        tone,
        content: editorText,
        safety_checklist: result?.safetyShield || [],
        designer_prompt: result?.designerPrompt || ''
      }).select().single();

      if (error) throw error;
      setSaved(true);
    } catch (err) {
      console.error(err);
      setDraftError('فشل حفظ المسودة: ' + err.message);
    } finally {
      setSavingDraft(false);
    }
  };

  if (loadingUser && !user) {
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
        جاري تهيئة لوحة التحكم الطبية...
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800' }}>لوحة التوليد الطبي الذكي</h1>
            <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '14px', marginTop: '4px' }}>بسط موضوعك الطبي بضغطة زر بطريقة آمنة وشعبية</p>
          </div>
          {supabase.isSimulated && (
            <span className="badge badge-teal animate-pulse">الوضع المحاكي (لا يحتاج قواعد بيانات سحابية)</span>
          )}
        </div>

        {/* Main Grid: Inputs vs Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }} className="lg-grid-cols-workspace">
          
          {/* Left Column: Form Inputs */}
          <section className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'hsl(var(--accent-mint))' }}>
              <Sparkles size={18} />
              معايير توليد المحتوى
            </h2>

            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Medical Topic */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label">الموضوع أو النصيحة الطبية</label>
                <textarea
                  required
                  rows={4}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="مثال: أهمية التغذية لمرضى السكري، أو خطورة أدوية البرد المركبة على الأطفال، أو لماذا يشعر الفرد بالدوخة بعد القيام المفاجئ؟"
                  className="form-textarea"
                  style={{ resize: 'none', lineHeight: '1.6' }}
                />
              </div>

              {/* Platform Selector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="form-label">المنصة المستهدفة</label>
                  <select 
                    value={platform} 
                    onChange={(e) => setPlatform(e.target.value)} 
                    className="form-select"
                  >
                    <option value="facebook">منشور فيسبوك (مفصل)</option>
                    <option value="instagram">بوست إنستجرام (مع هاشتاجات)</option>
                    <option value="twitter">ثريد تويتر/X متصل</option>
                    <option value="tiktok">سيناريو فيديو قصير (Reels/TikTok)</option>
                  </select>
                </div>

                {/* Tone Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="form-label">نبرة الصياغة</label>
                  <select 
                    value={tone} 
                    onChange={(e) => setTone(e.target.value)} 
                    className="form-select"
                  >
                    <option value="friendly">نصيحة ودية وعائلية</option>
                    <option value="scientific">تبسيط علمي دقيق</option>
                    <option value="humorous">فكاهي عامي خفيف</option>
                    <option value="storytelling">أسلوب قصصي تفاعلي</option>
                  </select>
                </div>
              </div>

              {/* Target Audience */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label">الفئة المستهدفة</label>
                <select 
                  value={audience} 
                  onChange={(e) => setAudience(e.target.value)} 
                  className="form-select"
                >
                  <option value="general">الجمهور العام من المرضى</option>
                  <option value="mothers">الأمهات والآباء</option>
                  <option value="youth">الشباب والرياضيين</option>
                  <option value="elderly">كبار السن وذويهم</option>
                </select>
              </div>

              {/* Clinic Info Integration Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'hsl(var(--bg-secondary))',
                borderRadius: '12px',
                border: '1px solid hsl(var(--border-muted))'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>إدراج بيانات عيادتي وحجز المرضى</span>
                  <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))' }}>تلقائياً في تذييل المنشور</span>
                </div>
                <input
                  type="checkbox"
                  checked={useClinicInfo}
                  onChange={(e) => setUseClinicInfo(e.target.checked)}
                  style={{
                    width: '40px',
                    height: '20px',
                    accentColor: 'hsl(var(--accent-mint))',
                    cursor: 'pointer'
                  }}
                />
              </div>

              <button 
                type="submit" 
                disabled={generating} 
                className="btn-primary animate-pulse" 
                style={{ width: '100%', justifyContent: 'center', height: '50px', fontSize: '16px' }}
              >
                {generating ? 'جاري صياغة المحتوى الطبي...' : 'توليد المنشور الآمن بالعامية'}
              </button>
            </form>
          </section>

          {/* Right Column: Generation Output & Tools */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {errorMessage && (
              <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid hsl(var(--accent-rose))', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <AlertCircle color="hsl(var(--accent-rose))" />
                <span style={{ color: 'hsl(var(--accent-rose))', fontSize: '14px' }}>{errorMessage}</span>
              </div>
            )}

            {!generating && !result && (
              <div className="glass-panel" style={{
                padding: '60px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '16px',
                color: 'hsl(var(--text-muted))',
                minHeight: '400px'
              }}>
                <Stethoscope size={48} style={{ strokeWidth: 1 }} />
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'hsl(var(--text-secondary))' }}>بانتظار المدخلات الخاصة بك</h3>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>ادخل الموضوع الطبي في الجانب الأيمن واضغط صياغة لبدء التدفق.</p>
                </div>
              </div>
            )}

            {generating && (
              <div className="glass-panel" style={{
                padding: '60px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: '24px',
                minHeight: '400px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  border: '4px solid hsl(var(--bg-tertiary))',
                  borderTopColor: 'hsl(var(--accent-mint))',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'hsl(var(--accent-mint))' }}>جاري تبسيط المحتوى العلمي...</h3>
                  <p style={{ fontSize: '13px', color: 'hsl(var(--text-muted))' }}>نقوم بتحويل المصطلحات الطبية المعقدة ومطابقتها لضوابط السلامة الطبية.</p>
                </div>
              </div>
            )}

            {result && !generating && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Result Text Area */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-mint">النص النهائي المولد</span>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleCopy} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
                        {copied ? (
                          <>
                            <Check size={14} style={{ marginLeft: '4px' }} /> تم النسخ!
                          </>
                        ) : (
                          <>
                            <Copy size={14} style={{ marginLeft: '4px' }} /> نسخ
                          </>
                        )}
                      </button>

                      <button 
                        onClick={handleSaveDraft} 
                        disabled={savingDraft} 
                        className="btn-primary" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        {savingDraft ? (
                          'جاري الحفظ...'
                        ) : saved ? (
                          <>
                            <Check size={14} style={{ marginLeft: '4px' }} /> تم الحفظ!
                          </>
                        ) : (
                          <>
                            <Save size={14} style={{ marginLeft: '4px' }} /> حفظ كمسودة
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {draftError && (
                    <div style={{ color: 'hsl(var(--accent-rose))', fontSize: '12px', textAlign: 'left', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                      {draftError}
                    </div>
                  )}

                  <textarea
                    rows={12}
                    value={editorText}
                    onChange={(e) => setEditorText(e.target.value)}
                    className="form-input"
                    style={{
                      fontFamily: 'var(--font-arabic)',
                      lineHeight: '1.7',
                      fontSize: '15px',
                      background: 'rgba(0,0,0,0.2)',
                      borderColor: 'hsl(var(--border-muted))',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Smart Dialect Optimizer Tab */}
                {result.dialectOptimizations && result.dialectOptimizations.length > 0 && (
                  <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={16} color="hsl(var(--accent-teal))" />
                        محسن العامية المصرية (نقرة واحدة للاستبدال)
                      </h3>
                      <p style={{ color: 'hsl(var(--text-muted))', fontSize: '12px', marginTop: '2px' }}>قمنا باستبدال هذه المصطلحات الصعبة بكلام عامي بسيط. اضغط على الكلمة للتعديل التلقائي في المحرر.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {result.dialectOptimizations.map((item, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => replaceTerm(item.original, item.simplified)}
                          style={{
                            background: 'hsl(var(--bg-secondary))',
                            border: '1px solid hsl(var(--border-muted))',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          className="hover-card-accent"
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: 'hsl(var(--text-secondary))' }}>
                              الأكاديمي: <span style={{ textDecoration: 'line-through', color: 'hsl(var(--accent-rose))' }}>{item.original}</span>
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'hsl(var(--accent-mint))' }}>
                              العامي: {item.simplified}
                            </span>
                            <span style={{ fontSize: '11px', color: 'hsl(var(--text-muted))', marginTop: '2px' }}>
                              {item.explanation}
                            </span>
                          </div>
                          <span style={{
                            fontSize: '11px',
                            padding: '4px 8px',
                            background: 'hsl(var(--bg-tertiary))',
                            borderRadius: '6px',
                            color: 'hsl(var(--text-secondary))'
                          }}>تبديل سريع ⚡</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medical Safety Shield (Ethics Checker) */}
                {result.safetyShield && (
                  <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={16} color="hsl(var(--accent-mint))" />
                      درع الأمان الطبي والتحقق الأخلاقي
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {result.safetyShield.map((item, idx) => (
                        <div 
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            background: item.passed ? 'hsl(var(--accent-mint) / 0.05)' : 'hsl(var(--accent-amber) / 0.05)',
                            border: `1px solid ${item.passed ? 'hsl(var(--accent-mint) / 0.2)' : 'hsl(var(--accent-amber) / 0.2)'}`,
                            padding: '12px',
                            borderRadius: '10px'
                          }}
                        >
                          <div style={{
                            background: item.passed ? 'hsl(var(--accent-mint) / 0.15)' : 'hsl(var(--accent-amber) / 0.15)',
                            padding: '4px',
                            borderRadius: '50%',
                            color: item.passed ? 'hsl(var(--accent-mint))' : 'hsl(var(--accent-amber))',
                            display: 'flex',
                            marginTop: '2px'
                          }}>
                            {item.passed ? <Check size={14} /> : <AlertTriangle size={14} />}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: item.passed ? 'hsl(var(--accent-mint))' : 'hsl(var(--accent-amber))' }}>{item.rule}</span>
                            <span style={{ fontSize: '12px', color: 'hsl(var(--text-muted))' }}>{item.feedback}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Design Image Prompt for Canvas/Midjourney */}
                {result.designerPrompt && (
                  <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800' }}>مساعد التصميم (برومبت الصورة)</h3>
                    <p style={{ color: 'hsl(var(--text-muted))', fontSize: '12px' }}>استخدم هذا النص باللغة الإنجليزية في أدوات توليد الصور (Midjourney / Canva AI) لإنشاء صورة معبرة للبوست:</p>
                    <div style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid hsl(var(--border-muted))',
                      borderRadius: '8px',
                      padding: '14px',
                      fontSize: '13px',
                      color: 'hsl(var(--text-secondary))',
                      direction: 'ltr',
                      textAlign: 'left',
                      fontFamily: 'var(--font-english)',
                      lineHeight: '1.5'
                    }}>
                      {result.designerPrompt}
                    </div>
                  </div>
                )}

              </div>
            )}
          </section>

        </div>
      </main>

      {/* Embedded CSS for Workspace Grid Responsive & Keyframes */}
      <style jsx global>{`
        .hover-card-accent:hover {
          border-color: hsl(var(--accent-mint)) !important;
          background: hsl(var(--bg-tertiary)) !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          .md-grid-cols-layout {
            grid-template-columns: 280px 1fr !important;
          }
        }
        @media (min-width: 1024px) {
          .lg-grid-cols-workspace {
            grid-template-columns: 420px 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
