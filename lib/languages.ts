import { translations, Locale } from "@/lib/i18n";

export const languages = [
  {
    code: Locale.en,
    buttonText: translations[Locale.en].buttons.en,
    icon: translations[Locale.en].icons.language,
  },
  {
    code: Locale.vi,
    buttonText: translations[Locale.vi].buttons.vi,
    icon: translations[Locale.vi].icons.language,
  },
];  