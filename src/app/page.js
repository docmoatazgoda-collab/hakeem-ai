'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Sparkles, 
  Stethoscope, 
  MessageCircle, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  BookOpen, 
  Phone, 
  Heart,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  const [sandboxTopic, setSandboxTopic] = useState('شرب المياه للكلى');
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxOutput, setSandboxOutput] = useState(null);

  const sandboxExamples = {
    'شرب المياه للكلى': {
      academic: "تعتبر المياه عاملاً أساسياً في الحفاظ على التوازن الأسموزي وتسهيل التصفية الكبيبية للسموم النيتروجينية ومنع ترسب بلورات الكالسيوم.",
      simplified: "بص يا بطل، الكلى عندك زي الفلتر اللي محتاج مية جارية طول اليوم عشان يغسل السموم وينضف نفسه. لو مفيش مية، الرواسب دي هتتراكم وتعمل حصوات وتعب شديد. بلاش تستنى لما تعطش لأن دي إشارة متأخرة جداً!"
    },
    'حقن البرد للأطفال': {
      academic: "يُحظر تماماً إعطاء المستحضرات المركبة المحتوية على مضادات حيوية وكورتيكوستيرويدات ومسكنات للأطفال لعلاج العدوى الفيروسية الحادة.",
      simplified: "يا أمهاتنا الجدعان.. مع دخول الشتا بلاش خالص 'حقنة البرد السحرية' أو 'مجموعة البرد' من الصيدلية! دي خلطة مضاد حيوي وكورتيزون ومسكن بتضر مناعة الطفل وممكن تعمل حساسية شديدة. البرد فيروس محتاج سوائل دافية وخافض حرارة آمن بس بالجرعة الصح."
    },
    'أعراض السكر الصامتة': {
      academic: "قد يظهر داء السكري من النوع الثاني أعراضاً تدريجية مثل فرط التبول الثانوي للبيلة السكرية، والعطش الشديد التعويضي، وبطء التئام الجروح.",
      simplified: "خلي بالك من الإشارات الصامتة اللي جسمك بيبعتها: لو بتدخل الحمام كتير بالليل، أو بتحس بعطش شديد مش طبيعي مهما شربت مية، أو لو فيه جرح بسيط وبياخد وقت طويل عشان يلم.. دي إشارات بتقولك زور دكتورك واعمل تحليل سكر صايم وفاطر عشان تطمن."
    }
  };

  const handleSandboxGenerate = () => {
    setSandboxLoading(true);
    setSandboxOutput(null);
    setTimeout(() => {
      setSandboxOutput(sandboxExamples[sandboxTopic]);
      setSandboxLoading(false);
    }, 1200);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', gap: '60px', paddingBottom: '60px' }}>
      
      {/* Floating Header */}
      <header className="header-glass" style={{ width: '100%' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, hsl(var(--accent-mint)) 0%, hsl(var(--accent-teal)) 100%)',
              padding: '8px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px hsl(var(--accent-mint) / 0.3)'
            }}>
              <Stethoscope size={24} color="#0b0f19" />
            </div>
            <span style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
              حكيم<span className="gradient-text">.آي</span>
            </span>
          </div>

          <nav style={{ display: 'none', gap: '30px' }} className="md-flex">
            <a href="#features" style={{ color: 'hsl(var(--text-secondary))', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}>المميزات</a>
            <a href="#sandbox" style={{ color: 'hsl(var(--text-secondary))', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}>جرب بنفسك</a>
            <a href="#pricing" style={{ color: 'hsl(var(--text-secondary))', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}>الأسعار</a>
          </nav>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/login" className="btn-secondary" style={{ padding: '8px 20px', fontSize: '14px', textDecoration: 'none' }}>
              دخول الأطباء
            </Link>
            <Link href="/login?signup=true" className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px', textDecoration: 'none' }}>
              ابدأ مجاناً
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', marginTop: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignSelf: 'center' }}>
            <span className="badge badge-mint animate-float">
              <Sparkles size={14} /> المنصة الأولى للأطباء المصريين
            </span>
          </div>
          
          <h1 style={{ fontSize: '42px', fontWeight: '800', lineHeight: '1.2' }}>
            بسط مفاهيم الطب لجمهورك.. <br />
            <span className="gradient-text">بأمان وسهولة بالعامية المصرية!</span>
          </h1>
          
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '18px', lineHeight: '1.6' }}>
            ساعد مرضاك ومتابعيك على وسائل التواصل الاجتماعي بفهم النصائح الطبية الصحيحة. اكتب موضوعك الطبي، ودع ذكاء &quot;حكيم.آي&quot; يصيغه بلغة قريبة لقلب وعقل الشارع المصري، مع الالتزام بأخلاقيات الطب وقوانين نقابة الأطباء.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px' }}>
            <Link href="/login?signup=true" className="btn-primary" style={{ fontSize: '16px', textDecoration: 'none' }}>
              ابدأ صياغة منشورك الأول <ArrowLeft size={18} style={{ marginRight: '8px' }} />
            </Link>
            <a href="#sandbox" className="btn-secondary" style={{ fontSize: '16px', textDecoration: 'none' }}>
              شاهد مثالاً تفاعلياً
            </a>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Section */}
      <section id="sandbox" className="container" style={{ scrollMarginTop: '100px' }}>
        <div className="glass-panel-glow" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '10px' }}>
              كيف يقوم حكيم بتبسيط المحتوى؟
            </h2>
            <p style={{ color: 'hsl(var(--text-muted))' }}>
              اختر موضوعاً طبياً أدناه واضغط &quot;تبسيط المحتوى&quot; لترى كيف تتحول المصطلحات الأكاديمية الصعبة إلى كلام بسيط وآمن ومفهوم للجميع.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            {Object.keys(sandboxExamples).map((topic) => (
              <button 
                key={topic}
                onClick={() => { setSandboxTopic(topic); setSandboxOutput(null); }}
                className={`btn-secondary ${sandboxTopic === topic ? 'glass-panel' : ''}`}
                style={{
                  padding: '10px 20px',
                  borderRadius: '30px',
                  borderColor: sandboxTopic === topic ? 'hsl(var(--accent-mint))' : 'hsl(var(--border-muted))',
                  background: sandboxTopic === topic ? 'hsl(var(--bg-tertiary))' : 'transparent',
                  color: sandboxTopic === topic ? 'hsl(var(--accent-mint))' : 'hsl(var(--text-secondary))',
                }}
              >
                {topic}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Academic Version */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span className="badge badge-rose" style={{ alignSelf: 'flex-start' }}>الصياغة الأكاديمية الجافة (المعقدة)</span>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '15px', lineHeight: '1.7', minHeight: '100px' }}>
                {sandboxExamples[sandboxTopic].academic}
              </p>
            </div>

            {/* Hakeem Simplified Version */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '3px solid hsl(var(--accent-mint))' }}>
              <span className="badge badge-mint" style={{ alignSelf: 'flex-start' }}>صياغة حكيم.آي بالعامية المصرية</span>
              {sandboxLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '100px', justifyContent: 'center', alignItems: 'center' }}>
                  <div className="animate-float" style={{ fontSize: '14px', color: 'hsl(var(--accent-mint))', fontWeight: '700' }}>
                    يقوم حكيم بالتبسيط والتدقيق الطبي...
                  </div>
                </div>
              ) : sandboxOutput ? (
                <p style={{ color: 'hsl(var(--text-primary))', fontSize: '15px', lineHeight: '1.7', minHeight: '100px' }}>
                  {sandboxOutput.simplified}
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '100px', justifyContent: 'center', alignItems: 'center' }}>
                  <button onClick={handleSandboxGenerate} className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                    اضغط لتبسيط المنشور
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="container" style={{ scrollMarginTop: '100px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>
            لماذا يثق الأطباء في <span className="gradient-text">حكيم.آي</span>؟
          </h2>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>
            صُمم خصيصاً ليجمع بين بلاغة الشارع المصري ودقة البحث العلمي الطبي.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: 'hsl(var(--accent-mint))' }}>
              <Shield size={36} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700' }}>درع الأمان الطبي (Safety Shield)</h3>
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '14px', lineHeight: '1.6' }}>
              نظام حماية يضمن خلو المنشور من التشخيصات الدوائية المباشرة، مع تضمين إخلاء مسؤولية تلقائي وتوجيه المريض للفحص السريري للامتثال لآداب مهنة الطب المصرية.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: 'hsl(var(--accent-teal))' }}>
              <MessageCircle size={36} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700' }}>توليد بالعامية المصرية المحببة</h3>
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '14px', lineHeight: '1.6' }}>
              يتحدث بلغة الشارع والعيادة المصرية. يبتعد عن الترجمات الآلية الباردة ويبسط المفاهيم بطرق وتشبيهات شعبية مألوفة تزيد تفاعل المرضى وتزيد ثقتهم.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ color: 'hsl(var(--accent-amber))' }}>
              <Sparkles size={36} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700' }}>مُحسن وقاموس المصطلحات الذكي</h3>
            <p style={{ color: 'hsl(var(--text-muted))', fontSize: '14px', lineHeight: '1.6' }}>
              محرر تفاعلي يقترح بدائل عامية للمصطلحات المعقدة التي تكتبها، بنقرة واحدة تستبدل &quot;الاحتشاء القلبي&quot; بـ &quot;جلطة الشريان التاجي/أزمة قلبية&quot; لسهولة فهمها.
            </p>
          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container" style={{ scrollMarginTop: '100px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '10px' }}>
            خطط اشتراك مرنة وعادلة
          </h2>
          <p style={{ color: 'hsl(var(--text-secondary))' }}>
            ابدأ مجاناً وجرب كافة الميزات، ثم اختر ما يناسب وتيرة عيادتك.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          
          {/* Free Plan */}
          <div className="glass-panel" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>خطة الطبيب الناشئ</h3>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '14px' }}>مثالية للأطباء الجدد لبدء التوعية الصحية.</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '36px', fontWeight: '800' }}>0</span>
              <span style={{ color: 'hsl(var(--text-muted))' }}>جنيه مصري / شهرياً</span>
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <CheckCircle size={16} color="hsl(var(--accent-mint))" /> 5 منشورات طبية مخصصة شهرياً
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <CheckCircle size={16} color="hsl(var(--accent-mint))" /> محسن العامية المصرية والمحرر الذكي
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <CheckCircle size={16} color="hsl(var(--accent-mint))" /> درع الأمان وتدقيق نقابة الأطباء
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <CheckCircle size={16} color="hsl(var(--accent-mint))" /> حفظ 3 مسودات في الأرشيف
              </li>
            </ul>

            <Link href="/login?signup=true" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', marginTop: '10px' }}>
              ابدأ الآن مجاناً
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="glass-panel-glow" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            <span className="badge badge-mint" style={{ position: 'absolute', top: '20px', left: '20px' }}>الأكثر طلباً</span>
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>باقة العيادة النشطة</h3>
              <p style={{ color: 'hsl(var(--text-muted))', fontSize: '14px' }}>للأطباء والمراكز الطبية لبناء تواجد قوي ومستمر.</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontSize: '36px', fontWeight: '800' }}>350</span>
              <span style={{ color: 'hsl(var(--text-muted))' }}>جنيه مصري / شهرياً</span>
            </div>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600' }}>
                <CheckCircle size={16} color="hsl(var(--accent-mint))" /> عدد منشورات غير محدود بالعامية
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <CheckCircle size={16} color="hsl(var(--accent-mint))" /> دمج متقدم لبيانات عيادتك وحجز المرضى
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <CheckCircle size={16} color="hsl(var(--accent-mint))" /> اقتراح هاشتاجات تريند وأفكار للصور المصاحبة
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <CheckCircle size={16} color="hsl(var(--accent-mint))" /> دعم كتابة نصوص فيديوهات (Reels / TikTok Scripts)
              </li>
            </ul>

            <Link href="/login?signup=true" className="btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', marginTop: '10px' }}>
              اشترك الآن وترقى للمحترفين
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="container" style={{ borderTop: '1px solid hsl(var(--border-muted))', paddingTop: '40px', marginTop: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: 'hsl(var(--text-muted))', fontSize: '14px' }}>
          حكيم.آي 2026 © جميع الحقوق محفوظة للأطباء. تم التطوير لدعم التوعية الصحية الآمنة والمبسطة في العالم العربي ومصر.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'hsl(var(--text-muted))' }}>
          صُنع بحب ودقة طبية <Heart size={12} color="hsl(var(--accent-rose))" style={{ fill: 'currentColor' }} /> للأطباء المصريين.
        </div>
      </footer>

      {/* CSS Helper for responsive MD screens */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .md-flex {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
