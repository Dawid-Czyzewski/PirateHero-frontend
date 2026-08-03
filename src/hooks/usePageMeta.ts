import { useEffect } from 'react';

type PageMetaOptions = {
  title: string;
  description?: string;
  
  openGraph?: boolean;
};

function upsertMetaProperty(
  property: string,
  content: string
): { cleanup: () => void } {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  const created = !el;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  const previous = el.getAttribute('content') ?? '';
  el.setAttribute('content', content);
  return {
    cleanup: () => {
      if (created) {
        el?.remove();
      } else if (previous) {
        el?.setAttribute('content', previous);
      } else {
        el?.removeAttribute('content');
      }
    },
  };
}

function upsertMetaName(
  name: string,
  content: string
): { cleanup: () => void } {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  const created = !el;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  const previous = el.getAttribute('content') ?? '';
  el.setAttribute('content', content);
  return {
    cleanup: () => {
      if (created) {
        el?.remove();
      } else if (previous) {
        el?.setAttribute('content', previous);
      } else {
        el?.removeAttribute('content');
      }
    },
  };
}

export function usePageMeta({ title, description, openGraph }: PageMetaOptions) {
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content') ?? null;

    document.title = title;
    if (description && meta) {
      meta.setAttribute('content', description);
    }

    const ogCleanups: (() => void)[] = [];
    if (openGraph && description) {
      ogCleanups.push(upsertMetaProperty('og:title', title).cleanup);
      ogCleanups.push(upsertMetaProperty('og:description', description).cleanup);
      ogCleanups.push(upsertMetaProperty('og:type', 'website').cleanup);
      ogCleanups.push(upsertMetaName('twitter:card', 'summary_large_image').cleanup);
      ogCleanups.push(upsertMetaName('twitter:title', title).cleanup);
      ogCleanups.push(upsertMetaName('twitter:description', description).cleanup);
    }

    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== null) {
        meta.setAttribute('content', previousDescription);
      }
      ogCleanups.forEach((fn) => fn());
    };
  }, [title, description, openGraph]);
}
