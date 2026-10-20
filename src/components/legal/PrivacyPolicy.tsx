import { LegalDocument } from "@/components/legal/LegalDocument";
import { PRIVACY_SECTIONS_A } from "@/components/legal/privacySectionsA";
import { PRIVACY_SECTIONS_B } from "@/components/legal/privacySectionsB";

export function PrivacyPolicy({ updatedAt }: { updatedAt: string }) {
  return (
    <LegalDocument
      title="Polityka prywatności"
      headlineSrc="/images/privacy-headline.png"
      headlineWidth={1182}
      headlineHeight={658}
      updatedAt={updatedAt}
      sections={[...PRIVACY_SECTIONS_A, ...PRIVACY_SECTIONS_B]}
    />
  );
}
