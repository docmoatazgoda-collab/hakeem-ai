import "./globals.css";

export const metadata = {
  title: "حكيم.آي | صانع المحتوى الطبي الآمن بالعامية المصرية",
  description: "المنصة الأولى المخصصة للأطباء المصريين لتوليد منشورات ومحتوى طبي آمن وموثوق ومبسط لوسائل التواصل الاجتماعي بالعامية المصرية.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
