'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabaseClient';
import { Stethoscope, Key, Mail, User, ShieldAlert, Award } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialIsSignUp = searchParams.get('signup') === 'true';
  const initialIsSimulated = supabase.isSimulated || false;

  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSimulated, setIsSimulated] = useState(initialIsSimulated);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        // Sign Up Flow
        if (!doctorName || !specialty) {
          throw new Error('يرجى ملء الاسم والتخصص الطبي.');
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              doctor_name: doctorName,
              specialty: specialty
            }
          }
        });

        if (error) throw error;
        
        setSuccessMsg('تم تسجيل الحساب بنجاح! جاري تحويلك للوحة التحكم...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);

      } else {
        // Login Flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        setSuccessMsg('تم الدخول بنجاح! جاري تحويلك...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ غير متوقع. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      position: 'relative',
      background: 'radial-gradient(circle at top left, hsl(var(--bg-secondary)) 0%, hsl(var(--bg-primary)) 100%)'
    }}>
      {/* simulated mode banner */}
      {isSimulated && (
        <div style={{
          position: 'absolute',
          top: '20px',
          padding: '10px 20px',
          background: 'hsl(var(--accent-teal) / 0.12)',
          border: '1px solid hsl(var(--accent-teal) / 0.3)',
          borderRadius: '30px',
          color: 'hsl(var(--accent-teal))',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '90%',
          textAlign: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          <ShieldAlert size={16} />
          <span>وضع التجربة المسرّع نشط. يمكنك التسجيل والدخول بأي بريد إلكتروني بدون تفعيل بريد حقيقي.</span>
        </div>
      )}

      {/* Header Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
        <div style={{
          background: 'linear-gradient(135deg, hsl(var(--accent-mint)) 0%, hsl(var(--accent-teal)) 100%)',
          padding: '8px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 0 15px hsl(var(--accent-mint) / 0.3)'
        }}>
          <Stethoscope size={24} color="#0b0f19" />
        </div>
        <span style={{ fontSize: '24px', fontWeight: '800' }}>
          حكيم<span className="gradient-text">.آي</span>
        </span>
      </div>

      {/* Form Container */}
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800' }}>
            {isSignUp ? 'إنشاء حساب طبيب جديد' : 'تسجيل دخول الأطباء'}
          </h2>
          <p style={{ color: 'hsl(var(--text-muted))', fontSize: '14px', marginTop: '6px' }}>
            {isSignUp ? 'ابدأ توليد المحتوى الطبي بالعامية في ثوانٍ' : 'مرحباً بعودتك دكتورنا العزيز'}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'hsl(var(--accent-rose) / 0.1)',
            border: '1px solid hsl(var(--accent-rose) / 0.3)',
            borderRadius: '10px',
            color: 'hsl(var(--accent-rose))',
            padding: '12px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'hsl(var(--accent-mint) / 0.1)',
            border: '1px solid hsl(var(--accent-mint) / 0.3)',
            borderRadius: '10px',
            color: 'hsl(var(--accent-mint))',
            padding: '12px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {isSignUp && (
            <>
              {/* Doctor Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label">الاسم بالكامل (سيظهر في التوقيع)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'hsl(var(--text-muted))' }}>
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="د. محمد عبد الرحمن"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="form-input"
                    style={{ paddingRight: '46px' }}
                  />
                </div>
              </div>

              {/* Specialty */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label">التخصص الطبي</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'hsl(var(--text-muted))' }}>
                    <Award size={18} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="أخصائي أمراض الصدر والحساسية"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="form-input"
                    style={{ paddingRight: '46px' }}
                  />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="form-label">البريد الإلكتروني</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'hsl(var(--text-muted))' }}>
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                placeholder="dr.name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingRight: '46px' }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="form-label">كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'hsl(var(--text-muted))' }}>
                <Key size={18} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingRight: '46px' }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            {loading ? 'انتظر قليلاً...' : isSignUp ? 'تسجيل الطبيب' : 'دخول'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button 
            type="button" 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMsg(null);
              setSuccessMsg(null);
            }} 
            style={{ background: 'none', border: 'none', color: 'hsl(var(--accent-mint))', cursor: 'pointer', fontFamily: 'var(--font-arabic)', fontSize: '14px', fontWeight: '700' }}
          >
            {isSignUp ? 'لديك حساب بالفعل؟ سجل دخولك' : 'لا تملك حساباً؟ أنشئ حسابك الآن'}
          </button>
        </div>
      </div>

      {/* Back to Home Link */}
      <Link href="/" style={{ color: 'hsl(var(--text-muted))', textDecoration: 'none', fontSize: '13px', marginTop: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        العودة للرئيسية
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'hsl(var(--accent-mint))', fontWeight: 'bold' }}>جاري التحميل...</div>}>
      <LoginContent />
    </Suspense>
  );
}
