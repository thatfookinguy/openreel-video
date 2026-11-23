export type PersonalCategory =
  | "birthday"
  | "wedding"
  | "baby"
  | "graduation"
  | "holiday"
  | "thank-you"
  | "printable";

export interface PersonalTemplate {
  id: string;
  name: string;
  category: PersonalCategory;
  defaultSize: { w: number; h: number };
  promptHint: string;
}

export const PERSONAL_TEMPLATES: PersonalTemplate[] = [
  { id: "bday-invite", name: "Birthday Invitation", category: "birthday", defaultSize: { w: 1080, h: 1920 }, promptHint: "Colorful birthday party invitation" },
  { id: "wedding-invite", name: "Wedding Invitation", category: "wedding", defaultSize: { w: 1200, h: 1800 }, promptHint: "Elegant wedding invitation" },
  { id: "baby-shower", name: "Baby Shower", category: "baby", defaultSize: { w: 1080, h: 1080 }, promptHint: "Soft baby shower invite" },
  { id: "grad-announce", name: "Graduation Announcement", category: "graduation", defaultSize: { w: 1080, h: 1350 }, promptHint: "Graduation announcement card" },
  { id: "xmas-card", name: "Christmas Card", category: "holiday", defaultSize: { w: 1200, h: 1600 }, promptHint: "Warm Christmas greeting card" },
  { id: "valentine", name: "Valentine Card", category: "holiday", defaultSize: { w: 1080, h: 1080 }, promptHint: "Romantic Valentine card" },
  { id: "thank-you", name: "Thank You Card", category: "thank-you", defaultSize: { w: 1200, h: 900 }, promptHint: "Simple thank you card" },
  { id: "calendar", name: "Monthly Calendar", category: "printable", defaultSize: { w: 2550, h: 3300 }, promptHint: "Clean printable monthly calendar" },
];
