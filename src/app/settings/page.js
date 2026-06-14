'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Sidebar from '@/components/Sidebar';
import { 
  User, 
  Award, 
  MapPin, 
  Phone, 
  Link2, 
  Save, 
  Check 
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  // User and Auth State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Profile Form Fields
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bookingLink, setBookingLink] = useState('');
  const [disclaimerTemplate, setDisclaimerTemplate] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Fetch Profile Data
      const { data: prof, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (prof) {
        setDoctorName(prof.doctor_name || '');
        setSpecialty(prof.specialty || '');
        setClinicAddress(prof.clinic_address || '');
        setPhoneNumber(prof.phone_number || '');
        setBookingLink(prof.booking_link || '');
        setDisclaimerTemplate(prof.disclaimer_template || '');
      } else {
        // Mock default for simulated profiles
        setDoctorName(user.user_metadata?.doctor_name || 'د. محمد عبد الرحمن');
        setSpecialty(user.user_metadata?.specialty || 'ممارس عام');
        setClinicAddress('شارع القصر العيني، القاهرة');
        setPhoneNumber('01012345678');
        setBookingLink('https://vezeeta.com');
        setDisclaimerTemplate('هذا المنشور لغرض التثقيف الطبي فقط ولا يغني عن استشارة الطبيب المختص.');
      }
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setErrorMsg(null);
    try {
      // Validate Booking Link (URL) if provided
      if (bookingLink) {
        try {
          new URL(bookingLink);
        } catch (err) {
          throw new Error('يرجى إدخال رابط حجز صالح يبدأ بـ http:// أو https://');
        }
      }

      // Validate Phone number format (basic digits and allowed symbols)
      if (phoneNumber && !/^[0-9+\s-]{8,15}$/.test(phoneNumber)) {
        throw new Error('يرجى إدخال رقم هاتف صالح (يتكون من 8 إلى 15 رقماً)');
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          doctor_name: doctorName,
          specialty,
          clinic_address: clinicAddress,
          phone_number: phoneNumber,
          booking_link: bookingLink,
          disclaimer_template: disclaimerTemplate,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
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
        جاري تحميل إعدادات العيادة...
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', minHeight: '100vh', background: 'hsl(var(--bg-primary))' }} className="md-grid-cols-layout">
      
      {/* Side Navigation */}
      <Sidebar profile={{ doctor_name: doctorName, specialty }} />

      {/* Main Workspace Area */}
      <main style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '30px', overflowY: 'auto' }}>
        
        {/* Header Title */}
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800' }}>إعدادات الطبيب والعيادة</h1>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '14px', marginTop: '4px' }}>قم بتحديث بيانات الاتصال وإخلاء المسؤولية لدمجها تلقائياً في منشوراتك الطبية</p>
        </div>

        {/* Settings Form Container */}
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '720px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <h2 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid hsl(var(--border-muted))', paddingBottom: '12px' }}>
              البيانات الشخصية والمهنية
            </h2>

            {/* Doctor Name and Specialty (Row) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label">اسم الطبيب (سيظهر في المنشور)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'hsl(var(--text-muted))' }}>
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="form-input"
                    style={{ paddingRight: '44px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label">التخصص والدرجة العلمية</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'hsl(var(--text-muted))' }}>
                    <Award size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="form-input"
                    style={{ paddingRight: '44px' }}
                  />
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid hsl(var(--border-muted))', paddingBottom: '12px', marginTop: '10px' }}>
              بيانات الاتصال بالعيادة والحجز
            </h2>

            {/* Clinic Address */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="form-label">عنوان العيادة</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'hsl(var(--text-muted))' }}>
                  <MapPin size={16} />
                </span>
                <input
                  type="text"
                  placeholder="مثال: 45 شارع القصر العيني، الدور الثالث، القاهرة"
                  value={clinicAddress}
                  onChange={(e) => setClinicAddress(e.target.value)}
                  className="form-input"
                  style={{ paddingRight: '44px' }}
                />
              </div>
            </div>

            {/* Phone and Booking Link */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label">أرقام هواتف الحجز</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'hsl(var(--text-muted))' }}>
                    <Phone size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="مثال: 01001234567 / 022543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="form-input"
                    style={{ paddingRight: '44px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="form-label">رابط الحجز المباشر (مثل فيزيتا)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', right: '16px', top: '16px', color: 'hsl(var(--text-muted))' }}>
                    <Link2 size={16} />
                  </span>
                  <input
                    type="url"
                    placeholder="https://vezeeta.com/dr/doctor-profile"
                    value={bookingLink}
                    onChange={(e) => setBookingLink(e.target.value)}
                    className="form-input"
                    style={{ paddingRight: '44px' }}
                  />
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid hsl(var(--border-muted))', paddingBottom: '12px', marginTop: '10px' }}>
              إخلاء المسؤولية الطبي الافتراضي
            </h2>

            {/* Disclaimer Template */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="form-label">صيغة إخلاء المسؤولية</label>
              <textarea
                rows={3}
                value={disclaimerTemplate}
                onChange={(e) => setDisclaimerTemplate(e.target.value)}
                placeholder="مثال: المعلومات الواردة في هذا المنشور لأغراض التوعية العامة فقط. يرجى استشارة الطبيب لتشخيص حالتك بدقة."
                className="form-textarea"
                style={{ resize: 'none', lineHeight: '1.6' }}
              />
            </div>

             {errorMsg && (
              <div style={{ color: 'hsl(var(--accent-rose))', fontSize: '13px', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={saving} 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', height: '50px', fontSize: '16px', marginTop: '10px' }}
            >
              {saving ? 'جاري حفظ البيانات...' : (
                <>
                  <Save size={18} style={{ marginLeft: '8px' }} /> حفظ التغييرات والبيانات
                </>
              )}
            </button>
          </form>
        </div>

      </main>

      {/* Floating Success Toast notification */}
      {showToast && (
        <div className="toast toast-success animate-fade-in">
          <Check size={20} color="hsl(var(--accent-mint))" />
          <span style={{ fontSize: '14px', fontWeight: '700' }}>تم حفظ بيانات الملف الشخصي والعيادة بنجاح!</span>
        </div>
      )}

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
