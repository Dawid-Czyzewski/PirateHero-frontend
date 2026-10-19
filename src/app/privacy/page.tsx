import {
  buildLegalJsonLd,
  buildLegalMetadata,
  LEGAL_UPDATED_AT,
  PRIVACY_PAGE,
} from "@/components/legal/legalPageMeta";
import { PrivacyPolicy } from "@/components/legal/PrivacyPolicy";

export const metadata = buildLegalMetadata(PRIVACY_PAGE);

const jsonLd = buildLegalJsonLd(PRIVACY_PAGE);

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PrivacyPolicy updatedAt={LEGAL_UPDATED_AT} />
    </>
  );
}
