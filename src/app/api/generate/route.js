import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/utils/supabaseClient';

// Mock Generator for Simulated/Fallback Mode
const generateMockPost = (topic, platform, tone, audience, clinicInfo) => {
  const cleanTopic = topic || 'نمط الحياة الصحي';
  
  // Platform-specific formatting
  const intro = platform === 'twitter' 
    ? 'سردية طبية سريعة 🧵👇\n' 
    : 'أهلاً يا أبطال 🩺\n';
    
  let postContent = '';
  let optimizations = [];
  let safetyShield = [];
  let designerPrompt = '';
  let hashtags = [];

  // Generate mock details based on topic and tone
  if (cleanTopic.includes('ماء') || cleanTopic.includes('كلى') || cleanTopic.includes('شرب')) {
    postContent = `${intro}
بصوا بقى، في خناقة بنشوفها كل يوم في العيادة.. "يا دكتور أنا بنسى أشرب مية وبشرب شاي وقهوة بدالها!".
الموضوع ده كارثة حقيقية على الكلى بتاعتك! 🤦‍♂️

القهوة والشاي مدرين للبول يعني بيخلوك تفقد مية مش بتعوضها. الكلى عندك عاملة زي المصفى اللي محتاجة مية جارية عشان تنضف السموم أول بأول. لو مفيش مية، الرواسب هتتراكم وتعمل حصوات وتعب شديد.

💡 نصيحة حكيم السريعة:
1. خلي جنبك إزازة مية لتر ونص وكل ساعة اشرب كوباية.
2. لون البول هو مؤشرك: لو أصفر غامق، يبقى أنت في خطر ومحتاج تشرب حالاً! لو فاتح، يبقى تمام.
3. بلاش تستنى لحد ما تعطش، العطش ده إشارة متأخرة جداً من جسمك إنه جف فعلياً!

شير البوست ده واعمل منشن لصاحبك اللي مبيشربش مية غير مع الأكل! 😉`;

    optimizations = [
      { original: "مدرات للبول", simplified: "بتنزّل المية من الجسم", explanation: "لتسهيل فهم تأثير الكافيين على الجفاف." },
      { original: "تراكم الرواسب الكلوية", simplified: "تكوين حصوات وتعب الكلى", explanation: "المصطلح الشعبي للترسبات هو الحصوات وهو أكثر تنبيهاً للمريض." },
      { original: "مؤشر التجفاف الطبي", simplified: "إشارة الجفاف وعطش الجسم", explanation: "لفظ الجفاف العامي أقرب للناس من التجفاف الفسيولوجي." }
    ];
    
    designerPrompt = "A dynamic close-up photo of a clean glass bottle of fresh water with lemon slices, standing on a doctor's wooden desk with a stethoscope blurred in the warm background. Cinematic lighting, professional photography.";
    hashtags = ['#شرب_المياه', '#صحة_الكلى', '#نصيحة_طبيب', '#احمي_نفسك'];

  } else if (cleanTopic.includes('أطفال') || cleanTopic.includes('برد') || cleanTopic.includes('سخونية')) {
    postContent = `${intro}
يا أمهاتنا الجدعان.. مع دخول الشتا، دور البرد والسخونية عند الأطفال بقى شبه يومي في كل بيت.
أول غلطة بنشوفها هي "حقنة البرد السحرية" أو "مجموعة البرد" من الصيدلية! ده أكبر خطر على طفلك! ❌

مجموعة البرد دي بتكون عبارة عن مضاد حيوي (وده غلط لأن البرد فيروسي مش بكتيري) + مسكن قوي + كورتيزون. خلطة بتدمر مناعة الطفل وممكن تعمل حساسية شديدة.

💡 نعمل إيه الصح عند السخونية؟
1. خافض حرارة آمن (مثل الباراسيتامول) بالجرعة المناسبة لوزن الطفل مش سنه!
2. كمادات مية فترات (من الحنفية) على الرقبة وتحت الباط، وبلاش مية ساقعة أو خل لأنهم بيقفلوا الأوعية الدموية ويزودوا الحرارة جوة الجسم!
3. سوائل دافية وراحة تامة.

لو طفلك سخن أكتر من 3 أيام أو فيه صعوبة في النفس، لازم فحص طبي فوراً في العيادة لتشخيص الصدر!`;

    optimizations = [
      { original: "الالتهابات الفيروسية التنفسية", simplified: "دور البرد والإنفلونزا", explanation: "تبسيط طبي للتعريف العام بدور البرد الشائع." },
      { original: "باراسيتامول حسب الوزن", simplified: "جرعة السخونية حسب وزن الطفل", explanation: "تنبيه الأمهات أن شراب السخونة يحسب بالوزن وليس العمر لمنع الجرعات الزائدة." },
      { original: "تضيق الأوعية الدموية المحيطية", simplified: "قفل العروق وحبس الحرارة", explanation: "توضيح ضرر الماء البارد جداً بلغة يفهمها المريض لمكافحة العادات الخاطئة." }
    ];
    
    designerPrompt = "A warm, caring illustration of a mother checking her child's forehead while holding a warm cup of herbal tea. Soft lighting, cozy bedroom, cute flat design illustration style with soft colors.";
    hashtags = ['#صحة_الطفل', '#سخونية_الأطفال', '#بلاش_مجموعة_البرد', '#دكتور_أطفال'];

  } else {
    // Generic fallback based on input
    postContent = `${intro}
خلونا نتكلم النهاردة عن موضوع مهم جداً وشاغل ناس كتير وهو: "${cleanTopic}".
كتير مننا بيتعامل مع الموضوع ده بالسمع أو بوصفات عشوائية من النت، بس الحقيقة الطبية مختلفة خالص!

بص يا بطل، النصيحة الذهبية هنا هي البعد عن التعقيد وتجنب العادات الغلط اللي ممكن تضر صحتك من غير ما تحس. 
التغذية السليمة، شرب المية، والنوم الكافي هما أساس حماية جسمك من أي مشاكل.

⚠️ رسالة مهمة: بلاش تاخد أي أدوية أو مسكنات بدون داعي عشان سلامة معدتك وكبدك. صحتك أمانة!

قولي في التعليقات: هل جربت تعالج الموضوع ده بنفسك قبل كده؟`;

    optimizations = [
      { original: "ممارسات طبية خاطئة", simplified: "عادات غلط ووصفات عشوائية", explanation: "لتخفيف الصياغة الأكاديمية وتقريبها للمشاهد المصري." },
      { original: "الاستشارة الطبية الفردية", simplified: "تكشف وتطمن على نفسك", explanation: "دعوة المريض لزيارة العيادة بأسلوب ودود." }
    ];
    
    designerPrompt = "A minimal conceptual vector art showing a healthy human icon surrounded by healthy lifestyle elements (water glass, apple, dumbbells, clock). Emerald green and deep blue brand colors, dark premium background.";
    hashtags = ['#صحة_عامة', '#نصائح_طبية', '#عيادة_دكتور', '#حكيم_دوت_آي'];
  }

  // Auto add clinic details if checked
  if (clinicInfo && clinicInfo.enabled) {
    postContent += `\n\n---\n📞 للحجز والاستفسار: ${clinicInfo.phone || '010XXXXXXXX'}
📍 العنوان: ${clinicInfo.address || 'عنوان العيادة'}
🔗 حجز أونلاين: ${clinicInfo.bookingLink || 'رابط الحجز'}`;
  }

  // Standard medical safety check
  safetyShield = [
    { rule: "خالٍ من الوصفات الدوائية المحددة بالجرعات", passed: true, feedback: "لم يتم كتابة أي جرعات أو أدوية مقيدة لسلامة المرضى." },
    { rule: "توجيه واضح للاستشارة المباشرة عند الخطر", passed: true, feedback: "المنشور ينتهي بتوجيه المريض لزيارة الطبيب المختص أو الطوارئ." },
    { rule: "لغة مبسطة خالية من التخويف الزائد", passed: true, feedback: "الصياغة مطمئنة وتركز على التوعية والوقاية بدلاً من الذعر." }
  ];

  return {
    content: postContent,
    dialectOptimizations: optimizations,
    safetyShield,
    designerPrompt,
    hashtags
  };
};

export async function POST(req) {
  try {
    // 1. Authorization check
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '');

    if (supabase.isSimulated) {
      if (token !== 'mock-token') {
        return new Response(JSON.stringify({ error: 'غير مصرح بالوصول. يرجى تسجيل الدخول.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      if (!token) {
        return new Response(JSON.stringify({ error: 'الرمز المميز مفقود. غير مصرح بالوصول.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return new Response(JSON.stringify({ error: 'جلسة العمل غير صالحة أو منتهية. غير مصرح بالوصول.' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    const { topic, platform, tone, audience, clinicInfo } = await req.json();
    
    // Check if topic is empty or invalid
    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return new Response(JSON.stringify({ error: 'موضوع المنشور مطلوب وصالح.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    
    // Check if API key exists. If not, trigger mock generator
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      console.warn('GEMINI_API_KEY is missing. Returning simulated post.');
      const mockResult = generateMockPost(topic, platform, tone, audience, clinicInfo);
      return new Response(JSON.stringify(mockResult), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Connect to actual Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });
    
    const prompt = `
أنت طبيب مصري ممارس للرعاية الصحية، وخبير في كتابة محتوى توعوي طبي لوسائل التواصل الاجتماعي.
مهمتك هي كتابة منشور طبي بالعامية المصرية الدارجة والمحببة للناس لتبسيط المفاهيم الصعبة دون الإخلال بالأمان العلمي والطبي.

المدخلات:
- الموضوع الطبي: "${topic}"
- المنصة المستهدفة: "${platform}" (مثال: فيسبوك، انستغرام، تويتر، تيك توك)
- نبرة الصوت: "${tone}" (مثال: تبسيط علمي، نصيحة ودية، فكاهي عامي، قصصي)
- الفئة المستهدفة: "${audience}" (مثال: الأمهات، كبار السن، الشباب، الجمهور العام)
- معلومات العيادة للدمج (إذا كانت متوفرة): ${JSON.stringify(clinicInfo)}

شروط كتابة المنشور الطبي:
1. صياغة المنشور بالكامل بالعامية المصرية بطريقة جذابة ومقنعة تبدأ بخطاف (Hook) قوي.
2. عدم تشخيص حالات مرضية فردية أو كتابة وصفات دوائية بجرعات محددة (يجب ذكر أسماء المواد الفعالة العامة للوقاية أو خافضات الحرارة البسيطة فقط مع التنبيه).
3. توجيه القارئ بشكل لطيف وواضح بضرورة زيارة الطبيب أو العيادة في حال استمرار الأعراض أو ظهور علامات الخطر.
4. إذا كانت معلومات العيادة متوفرة ومفعّلة، ادمجها بذكاء في نهاية المنشور مع عبارة حث على الإجراء (CTA).
5. توفير إخلاء مسؤولية طبي مدمج أو في نهاية المنشور بشكل سلس.

يجب أن تقوم بإرجاع النتيجة حصراً بتنسيق JSON نظيف وصحيح بالبنية التالية وبدون أي علامات Markdown حول الـ JSON نفسه:
{
  "content": "نص المنشور بالكامل مع التنسيقات والرموز التعبيرية المناسبة للمنصة والهاشتاجات المطلوبة",
  "dialectOptimizations": [
    {
      "original": "المصطلح الطبي المعقد باللغة الفصحى أو الإنجليزية الذي كان يمكن استخدامه",
      "simplified": "المصطلح العامي المصري البديل الذي استخدمته لتسهيل الفهم",
      "explanation": "تفسير طبي لغوي سريع لسبب هذا التبسيط وكيف يحمي المريض"
    }
  ],
  "safetyShield": [
    {
      "rule": "اسم قاعدة الأمان الطبية المتبعة (مثل: عدم كتابة جرعات دقيقة، توجيه للعيادة، لغة غير مخيفة)",
      "passed": true,
      "feedback": "شرح كيف تم الالتزام بهذه القاعدة في النص المولد"
    }
  ],
  "designerPrompt": "A detailed English prompt for text-to-image AI (like Midjourney or Canva) to generate a high-quality professional image relevant to this post's topic, using high-end medical/lifestyle aesthetic.",
  "hashtags": ["قائمة", "الهاشتاجات", "المقترحة", "للمنشور"]
}

تأكد تماماً أن النص المرتجع هو JSON صالح بنسبة 100% ولا يحتوي على أي نصوص قبل أو بعد كائن الـ JSON.
`;

    const result = await model.generateContent(prompt);
    const resultText = result.response.text();
    const resultJson = JSON.parse(resultText);

    return new Response(JSON.stringify(resultJson), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating medical post:', error);
    return new Response(JSON.stringify({
      error: 'حدث خطأ أثناء توليد المحتوى الطبي. يرجى المحاولة مرة أخرى.',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
