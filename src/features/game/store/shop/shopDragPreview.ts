import type { DragEvent } from 'react';
import { shopItemImageSrc } from './shopItemImage';
import type { ShopItem } from './types';

export function setShopDragImage(e: DragEvent, item: ShopItem, title: string): void {
  const dt = e.dataTransfer;
  if (!dt) return;

  const wrap = document.createElement('div');
  wrap.setAttribute('data-shop-drag-ghost', 'true');
  Object.assign(wrap.style, {
    position: 'fixed',
    left: '0',
    top: '-9999px',
    zIndex: '2147483647',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    maxWidth: '240px',
    borderRadius: '10px',
    border: '2px solid rgba(234, 179, 8, 0.5)',
    background: 'hsl(220 28% 11%)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
    pointerEvents: 'none',
    opacity: '0.98',
    fontFamily: 'var(--font-sans, ui-sans-serif, system-ui)',
  });

  const img = document.createElement('img');
  img.src = shopItemImageSrc(item);
  img.alt = '';
  img.draggable = false;
  Object.assign(img.style, {
    width: '56px',
    height: '56px',
    objectFit: 'contain',
    borderRadius: '8px',
    background: 'rgba(0,0,0,0.25)',
    flexShrink: '0',
  });

  const text = document.createElement('div');
  Object.assign(text.style, {
    minWidth: '0',
    flex: '1',
    fontSize: '12px',
    fontWeight: '700',
    lineHeight: '1.3',
    color: 'hsl(48 96% 92%)',
    overflow: 'hidden',
    display: '-webkit-box',
  });
  text.style.setProperty('-webkit-line-clamp', '3');
  text.style.setProperty('-webkit-box-orient', 'vertical');
  text.textContent = title;

  wrap.appendChild(img);
  wrap.appendChild(text);
  document.body.appendChild(wrap);

  const w = wrap.offsetWidth;
  const h = wrap.offsetHeight;
  dt.setDragImage(wrap, Math.floor(w / 2), Math.floor(h / 2));

  const cleanup = () => {
    wrap.remove();
    window.removeEventListener('dragend', cleanup);
  };
  window.addEventListener('dragend', cleanup, { once: true });
}
