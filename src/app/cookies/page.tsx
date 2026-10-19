import {
  buildLegalJsonLd,
  buildLegalMetadata,
  COOKIES_PAGE,
  LEGAL_UPDATED_AT,
} from "@/components/legal/legalPageMeta";
import { CookiePolicy } from "@/components/legal/CookiePolicy";

export const metadata = buildLegalMetadata(COOKIES_PAGE);

const jsonLd = buildLegalJsonLd(COOKIES_PAGE);

export default function CookiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CookiePolicy updatedAt={LEGAL_UPDATED_AT} />
    </>
  );
}
