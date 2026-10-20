import { LegalDocument } from "@/components/legal/LegalDocument";
import { COOKIE_SECTIONS_A } from "@/components/legal/cookieSectionsA";
import { COOKIE_SECTIONS_B } from "@/components/legal/cookieSectionsB";

export function CookiePolicy({ updatedAt }: { updatedAt: string }) {
  return (
    <LegalDocument
      title="Polityka cookies"
      headlineSrc="/images/cookies-headline.png"
      headlineWidth={1236}
      headlineHeight={692}
      updatedAt={updatedAt}
      sections={[...COOKIE_SECTIONS_A, ...COOKIE_SECTIONS_B]}
    />
  );
}
