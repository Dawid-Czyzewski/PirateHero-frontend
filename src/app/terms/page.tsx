import {
  buildLegalJsonLd,
  buildLegalMetadata,
  LEGAL_UPDATED_AT,
  TERMS_PAGE,
} from "@/components/legal/legalPageMeta";
import { TermsOfService } from "@/components/legal/TermsOfService";

export const metadata = buildLegalMetadata(TERMS_PAGE);

const jsonLd = buildLegalJsonLd(TERMS_PAGE);

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TermsOfService updatedAt={LEGAL_UPDATED_AT} />
    </>
  );
}
