export type Lang = "en" | "ar" | "fa" | "ps" | "ru";

export const RTL_LANGS: Lang[] = ["ar", "fa", "ps"];

export function isRtl(lang: string): boolean {
  return RTL_LANGS.includes(lang as Lang);
}

const ui = {
  en: {
    dashboard: "Dashboard",
    aiMentor: "AI Mentor",
    learningPath: "Learning Path",
    quietLibrary: "Quiet Library",
    peerCircles: "Peer Circles",
    stories: "Stories",
    announcements: "Announcements",
    reviews: "Reviews",
    safeMode: "Safe Mode",
    signOut: "Sign Out",
    chooseDisguise: "Choose disguise",
    disguiseAs: "Disguise as",
  },
  ar: {
    dashboard: "لوحة التحكم",
    aiMentor: "المرشد الذكي",
    learningPath: "مسار التعلم",
    quietLibrary: "المكتبة الهادئة",
    peerCircles: "دوائر الأقران",
    stories: "القصص",
    announcements: "الإعلانات",
    reviews: "التقييمات",
    safeMode: "الوضع الآمن",
    signOut: "تسجيل الخروج",
    chooseDisguise: "اختر التنكر",
    disguiseAs: "تنكر كـ",
  },
  fa: {
    dashboard: "داشبورد",
    aiMentor: "مربی هوش مصنوعی",
    learningPath: "مسیر یادگیری",
    quietLibrary: "کتابخانه‌ی آرام",
    peerCircles: "حلقه‌های همسالان",
    stories: "داستان‌ها",
    announcements: "اعلانات",
    reviews: "نظرات",
    safeMode: "حالت امن",
    signOut: "خروج",
    chooseDisguise: "انتخاب ظاهر",
    disguiseAs: "ظاهر شو به عنوان",
  },
  ps: {
    dashboard: "ډشبورډ",
    aiMentor: "د AI لارښود",
    learningPath: "د زده کړې لار",
    quietLibrary: "آرام کتابتون",
    peerCircles: "د ملګرو حلقې",
    stories: "کیسې",
    announcements: "اعلانات",
    reviews: "نظرونه",
    safeMode: "خوندي حالت",
    signOut: "وتل",
    chooseDisguise: "د پټیدو انتخاب",
    disguiseAs: "پټ شه لکه",
  },
  ru: {
    dashboard: "Главная",
    aiMentor: "ИИ-наставник",
    learningPath: "Путь обучения",
    quietLibrary: "Тихая библиотека",
    peerCircles: "Круги общения",
    stories: "Истории",
    announcements: "Объявления",
    reviews: "Отзывы",
    safeMode: "Безопасный режим",
    signOut: "Выйти",
    chooseDisguise: "Маскировка",
    disguiseAs: "Замаскироваться под",
  },
} as const;

export type UiKey = keyof typeof ui.en;

export function t(lang: string, key: UiKey): string {
  const locale = (lang in ui ? lang : "en") as Lang;
  return ui[locale][key];
}
