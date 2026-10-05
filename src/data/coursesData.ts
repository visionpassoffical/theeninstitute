import { Course } from '../types';

export const coursesData: Course[] = [
  {
    id: 'hifz',
    number: '01',
    name: {
      en: 'HIFZ',
      ml: 'ഹിഫ്ള്',
      ur: 'حفظِ قرآن',
    },
    subtitle: {
      en: 'Complete & Partial Qur’an Memorization',
      ml: 'സമ്പൂർണ്ണ & ഭാഗിക ഖുർആൻ മനഃപാഠം',
      ur: 'مکمل اور منتخب سورتوں کا حفظ',
    },
    description: {
      en: 'A structured memorization pathway emphasizing accurate Makhraj, disciplined daily new lessons (Sabaq), continuous recent revision (Sabqi), and cumulative consolidation (Manzil).',
      ml: 'വ്യവസ്ഥാപിതമായ പാഠ്യപദ്ധതിയോടെ ദിവസേനയുള്ള പുതിയ പാഠങ്ങൾ (സബഖ്), സമീപ പാഠങ്ങളുടെ ആവർത്തനം (സബ്ഖി), മുൻഭാഗങ്ങളുടെ ക്രമാനുഗതമായ പുനരാവർത്തനം (മൻസിൽ) എന്നിവയിലൂടെ ഖുർആൻ മനഃപാഠമാക്കുന്ന കോഴ്സ്.',
      ur: 'ایک منظم قرآنی نصاب جس میں روزانہ نیا سبق (سبق)، پچھلے اسباق کی دہرائی (سبقی) اور مکمل منزل کی مسلسل نگرانی کے ساتھ قرآن حفظ کرایا جاتا ہے۔',
    },
    highlights: {
      en: [
        'Daily supervised new lesson recitation and memorization testing',
        'Systematic revision schedules for long-term retention',
        'Rigorous Tajweed and articulation enforcement throughout',
        'Available in 1-on-1 intensive or capped small group batches',
      ],
      ml: [
        'ദിവസേന പുതിയ പാഠം കേൾപ്പിക്കലും മനഃപാഠ പരിശോധനയും',
        'ദീർഘകാല ഓർമ്മക്കായി ചിട്ടയായ പുനരാവർത്തന ക്രമങ്ങൾ',
        'തുടക്കം മുതൽ ഒടുക്കം വരെ കൃത്യമായ തജ്‌വീദ് നിഷ്കർഷ',
        'വൺ-ടു-വൺ തീവ്ര ബാച്ചുകളിലും ചെറിയ ഗ്രൂപ്പുകളിലും ലഭ്യമാണ്',
      ],
      ur: [
        'روزانہ نیا سبق سنانے اور حفظ کے امتحان کا باقاعدہ نظام',
        'مستقل یادداشت کے لیے سائنسی بنیادوں پر منزل کی دہرائی',
        'شروع سے آخر تک تجوید و مخارج کی کڑی پابندی',
        'انفرادی ون-ٹو-ون یا محدود گروپ بیجز میں دستیاب',
      ],
    },
    suitableFor: {
      en: 'Children, youth, and adults aspiring to memorize the entire Qur’an or selected Surahs with authentic Tajweed.',
      ml: 'വിശുദ്ധ ഖുർആൻ പൂർണ്ണമായോ പ്രത്യേക സൂറത്തുകളോ മനഃപാഠമാക്കാൻ ആഗ്രഹിക്കുന്ന കുട്ടികൾ, കൗമാരക്കാർ, മുതിർന്നവർ.',
      ur: 'مکمل قرآن یا منتخب سورتیں حفظ کرنے کے خواہشمند بچے، نوجوان اور بڑے احباب۔',
    },
  },
  {
    id: 'nazira',
    number: '02',
    name: {
      en: 'NAZIRA',
      ml: 'നാളിറ & തജ്‌വീദ്',
      ur: 'ناظرہ مع تجوید',
    },
    subtitle: {
      en: 'Qur’an Reading & Applied Tajweed Mastery',
      ml: 'ഖുർആൻ പാരായണവും തജ്‌വീദ് പ്രയോഗവും',
      ur: 'قرآن مجید کی درست قرأت اور تجوید',
    },
    description: {
      en: 'Focuses on building flawless reading fluency directly from the Mushaf with precise letter exits (Makharij), phonetic attributes (Sifat), rules of Nun/Mim Sakinah, and rhythmic stopping (Waqf).',
      ml: 'വിശുദ്ധ ഖുർആൻ നോക്കി തെറ്റുകൂടാതെയും അതിമനോഹരമായും പാരായണം ചെയ്യാൻ പരിശീലിപ്പിക്കുന്ന കോഴ്സ്. അക്ഷരങ്ങളുടെ ഉച്ചാരണ സ്ഥാനങ്ങൾ (മഖാരിജ്), നിയമങ്ങൾ, വഖ്ഫ് രീതികൾ എന്നിവ പഠിപ്പിക്കുന്നു.',
      ur: 'مصحفِ عثمانی سے دیکھ کر مکمل روانی، درست مخارج، صفاتِ حروف، احکامِ نون و میم ساکن اور آدابِ وقف کے ساتھ قرآن پڑھنے کی جامع تربیت۔',
    },
    highlights: {
      en: [
        'Step-by-step phonetic pronunciation from basic letters to fluent recitation',
        'Applied Tajweed rules: Madd, Ghunnah, Ikhfa, Idgham, and Iqlab',
        'Individual correction of every word and breath control',
        'Confidence building in reading from standard Mushaf layouts',
      ],
      ml: [
        'അക്ഷരങ്ങളുടെ ഉച്ചാരണം മുതൽ ഒഴുക്കോടെയുള്ള പാരായണം വരെയുള്ള ഘട്ടം ഘട്ടമായുള്ള പരിശീലനം',
        'മദ്ദ്, ഗുന്ന, ഇഖ്ഫാഅ്, ഇദ്ഗാം, ഇഖ്‌ലാബ് തുടങ്ങിയ തജ്‌വീദ് നിയമങ്ങളുടെ പ്രായോഗിക പ്രയോഗം',
        'ഓരോ വാക്കിന്റെയും ഉച്ചാരണത്തിൽ വ്യക്തിഗത തിരുത്തലുകൾ',
        'മുസ്ഹഫ് നോക്കി ഭയമില്ലാതെ സുന്ദരമായി ഓതാനുള്ള ആത്മവിശ്വാസം',
      ],
      ur: [
        'بنیادی حروف شناسی سے لے کر روانی کے ساتھ تلاوت تک مرحلہ وار تدریس',
        'مد، غنہ، اخفاء، ادغام اور اقلاب کے عملی قواعد کی مشق',
        'ہر لفظ کی انفرادی تصحیح اور سانس کے درست استعمال کی تربیت',
        'عام مصحف سے روانی سے پڑھنے کا مکمل اعتماد',
      ],
    },
    suitableFor: {
      en: 'Beginners learning to read the Qur’an for the first time, or reciters seeking to eliminate errors and master Tajweed.',
      ml: 'ആദ്യമായി ഖുർആൻ വായിക്കാൻ പഠിക്കുന്നവരും പാരായണത്തിലെ തെറ്റുകൾ തിരുത്തി തജ്‌വീദോടെ ഓതാൻ ആഗ്രഹിക്കുന്നവരും.',
      ur: 'قرآن مجید پہلی بار سیکھنے والے یا اپنی قرأت کی غلطیاں درست کر کے تجوید کے ساتھ پڑھنے کے خواہشمند حضرات۔',
    },
  },
  {
    id: 'fiqh',
    number: '03',
    name: {
      en: 'FIQH',
      ml: 'ഫിഖ്ഹ് (കർമ്മശാസ്ത്രം)',
      ur: 'فقہ اسلامی',
    },
    subtitle: {
      en: 'Islamic Jurisprudence — Shafi & Hanafi Schools',
      ml: 'ശാഫിഈ & ഹനഫീ മദ്ഹബ് കർമ്മശാസ്ത്ര പഠനം',
      ur: 'فقہ شافعی اور فقہ حنفی کے مطابق احکامِ شرعیہ',
    },
    description: {
      en: 'Comprehensive studies in Islamic jurisprudence covering Taharah (purification), Salah (prayer), Sawm (fasting), Zakah, and daily transactional rulings according to the established Shafi or Hanafi Madhhab.',
      ml: 'ശുദ്ധി (ത്വഹാറത്ത്), നമസ്കാരം (സ്വലാത്ത്), നോമ്പ് (സ്വൗം), സകാത്ത്, നിത്യജീവിത ഇടപാടുകൾ എന്നിവയിൽ ശാഫിഈ അല്ലെങ്കിൽ ഹനഫീ മദ്ഹബുകൾ പ്രകാരമുള്ള ആധികാരിക കർമ്മശാസ്ത്ര പഠനം.',
      ur: 'طہارت، نماز، روزہ، زکوٰۃ اور روزمرہ زندگی کے شرعی احکام پر مشتمل فقہی تعلیم، جس میں فقہ شافعی یا فقہ حنفی میں سے کسی ایک کا انتخاب کیا جا سکتا ہے۔',
    },
    highlights: {
      en: [
        'Dual stream offering: Dedicated Shafi Madhhab & Hanafi Madhhab tracks',
        'Practical step-by-step guidance on purification, prayer, and worship acts',
        'Q&A sessions addressing contemporary everyday legal scenarios',
        'Taught by qualified scholars holding traditional scholastic grounding',
      ],
      ml: [
        'ശാഫിഈ, ഹനഫീ മദ്ഹബുകൾക്കായി പ്രത്യേക പാഠ്യപദ്ധതികൾ',
        'ശുദ്ധീകരണം, നമസ്കാരം, ആരാധനാ കർമ്മങ്ങൾ എന്നിവയിലെ പ്രായോഗിക മാർഗ്ഗനിർദ്ദേശം',
        'നിത്യജീവിതത്തിലെ സംശയങ്ങൾ ദൂരീകരിക്കുന്ന ചർച്ചകൾ',
        'പാരമ്പര്യ വൈജ്ഞാനിക പശ്ചാത്തലമുള്ള പണ്ഡിതരുടെ ക്ലാസുകൾ',
      ],
      ur: [
        'شافعی اور حنفی دونوں مکاتبِ فکر کے لیے الگ الگ خصوصی اسباق',
        'وضو، غسل، نماز اور عبادات کے احکام کی عملی رہنمائی',
        'روزمرہ کے فقہی مسائل اور شبہات کے تسلی بخش جوابات',
        'مستند اور روایتی علوم سے وابستہ اساتذہ کی زیرِ نگرانی',
      ],
    },
    madhhabs: {
      shafi: {
        en: 'Shafi Madhhab Stream: Structured study of classical Shafi primers covering worship, conditions, pillars, and invalidators.',
        ml: 'ശാഫിഈ മദ്ഹബ്: ശാഫിഈ കർമ്മശാസ്ത്ര ഗ്രന്ഥങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ള ആരാധനാ വിധികൾ, ശർത്തുകൾ, അർകാനുകൾ.',
        ur: 'فقہ شافعی: امام شافعیؒ کے فقہی مسلک کے بنیادی متون کے مطابق عبادات اور شرائط کا فہم۔',
      },
      hanafi: {
        en: 'Hanafi Madhhab Stream: Structured study of classical Hanafi legal texts covering worship, obligations, sunnahs, and common rulings.',
        ml: 'ഹനഫീ മദ്ഹബ്: ഹനഫീ കർമ്മശാസ്ത്ര ഗ്രന്ഥങ്ങളെ അടിസ്ഥാനമാക്കിയുള്ള ഫർളുകൾ, വാജിബുകൾ, സുന്നത്തുകൾ.',
        ur: 'فقہ حنفی: امام اعظم ابو حنیفہؒ کے مسلک کے مستند کتب کے مطابق فرائض، واجبات اور سنتوں کا مطالعہ۔',
      },
    },
    suitableFor: {
      en: 'Students and adults desiring to correct and elevate their personal daily worship and religious obligations in accordance with classical jurisprudence.',
      ml: 'തങ്ങളുടെ നിത്യജീവിത ആരാധനകളും കർമ്മങ്ങളും മദ്ഹബിന്റെ അടിസ്ഥാനത്തിൽ കൃത്യമായി നിർവ്വഹിക്കാൻ ആഗ്രഹിക്കുന്നവർ.',
      ur: 'اپنی عبادات، طہارت اور نماز کو فقہی اعتبار سے درست بنانے کے خواہشمند مرد و خواتین۔',
    },
  },
  {
    id: 'madrasa',
    number: '04',
    name: {
      en: 'MADRASA',
      ml: 'മദ്റസ പഠനം',
      ur: 'دینی مدرسہ کورس',
    },
    subtitle: {
      en: 'Foundational Islamic Studies & Character Formation',
      ml: 'അടിസ്ഥാന ഇസ്ലാമിക പഠനവും സ്വഭാവ രൂപീകരണവും',
      ur: 'بنیادی دینی تعلیمات اور اخلاقی تربیت',
    },
    description: {
      en: 'A foundational Islamic curriculum encompassing core Islamic beliefs (Aqeedah), prophetic character and manners (Akhlaq & Adab), daily masnoon prayers (Dua & Adhkar), and basic Islamic history.',
      ml: 'ഇസ്ലാമിക വിശ്വാസകാര്യങ്ങൾ (അഖീദ), പ്രവാചക ജീവിതവും സ്വഭാവ സംസ്കരണവും (അഖ്‌ലാഖ് & അദബ്), നിത്യജീവിത ദിക്റുകളും ദുആകളും, ഇസ്ലാമിക ചരിത്ര പാഠങ്ങൾ എന്നിവ ഉൾപ്പെടുന്ന അടിസ്ഥാന മദ്റസ കോഴ്സ്.',
      ur: 'اسلامی عقائد کی پختگی، اخلاق و آدابِ زندگی، مسنون دعائیں، اذکارِ مسنونہ اور سیرت النبی ﷺ پر مشتمل بنیادی دینی نصاب۔',
    },
    highlights: {
      en: [
        'Sound Aqeedah: Affirming the articles of faith in an age-appropriate format',
        'Akhlaq & Adab: Cultivating respect for parents, elders, teachers, and society',
        'Daily Adhkar: Memorizing authentic morning, evening, and situational prayers',
        'Interactive live teaching with visual storyboards and regular assessments',
      ],
      ml: [
        'നേരായ അഖീദ: വിശ്വാസ കാര്യങ്ങളെക്കുറിച്ചുള്ള വ്യക്തമായ അവബോധം',
        'അഖ്‌ലാഖ് & അദബ്: മാതാപിതാക്കളോടും മുതിർന്നവരോടും സമൂഹത്തോടുമുള്ള മര്യാദകൾ',
        'നിത്യജീവിത പ്രാർത്ഥനകൾ: രാവിലെയും വൈകുന്നേരവുമുള്ള ദിക്ർ-ദുആകൾ മനഃപാഠമാക്കൽ',
        'കുട്ടികൾക്കും തുടക്കക്കാർക്കും ആസ്വാദ്യകരമായ ലളിത അധ്യാപന രീതി',
      ],
      ur: [
        'صحیح عقائدِ اسلامیہ کی تفہیم اور دلائل',
        'اخلاق و آداب: والدین، اساتذہ اور معاشرے کے حقوق و احترام کی تربیت',
        'صبح و شام کے مسنون اذکار اور موقع بہ موقع کی دعائیں حفظ کرانا',
        'بچوں اور ابتدائی طلبہ کے لیے آسان، پرکشش اور معلوماتی اندازِ تدریس',
      ],
    },
    suitableFor: {
      en: 'School-going children, teenagers, and new learners requiring systematic foundational religious upbringing from home.',
      ml: 'സ്കൂൾ കുട്ടികൾ, കൗമാരക്കാർ, വീട്ടിലിരുന്ന് മതവിജ്ഞാനം നേടാൻ ആഗ്രഹിക്കുന്ന തുടക്കക്കാർ.',
      ur: 'اسکول کے بچے، نوجوان اور وہ تمام افراد جو گھر بیٹھے بنیادی دینی تعلیم حاصل کرنا چاہتے ہیں۔',
    },
  },
];
