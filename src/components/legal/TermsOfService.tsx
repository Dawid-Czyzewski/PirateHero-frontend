import { LegalDocument } from "@/components/legal/LegalDocument";
import { TERMS_SECTIONS_A } from "@/components/legal/termsSectionsA";
import { TERMS_SECTIONS_B } from "@/components/legal/termsSectionsB";

export function TermsOfService({ updatedAt }: { updatedAt: string }) {
  return (
    <LegalDocument
      title="Regulamin"
      headlineSrc="/images/terms-headline.png"
      headlineWidth={1219}
      headlineHeight={696}
      updatedAt={updatedAt}
      sections={[...TERMS_SECTIONS_A, ...TERMS_SECTIONS_B]}
    />
  );
}
