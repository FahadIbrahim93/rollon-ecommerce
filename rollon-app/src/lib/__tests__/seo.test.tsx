import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Product } from '@/types';
import { buildProductJsonLd, useDocumentSEO } from '@/lib/seo';

const product: Product = {
  id: 'p-1',
  name: 'Cyber Grinder',
  slug: 'cyber-grinder',
  description: 'Precision CNC grinder with magnetic lock.',
  price: 3200,
  image: '/images/grinder.png',
  images: ['/images/grinder-2.png'],
  category: 'grinders',
  categoryId: 'grinders',
  rating: 4.8,
  reviewCount: 23,
  inStock: true,
  stock: 10,
};

function TestSEO(props: Parameters<typeof useDocumentSEO>[0]) {
  useDocumentSEO(props);
  return null;
}

describe('buildProductJsonLd', () => {
  it('builds product schema with absolute image and canonical URL', () => {
    const schema = buildProductJsonLd(product, '/product/cyber-grinder');

    expect(schema['@type']).toBe('Product');
    expect((schema.image as string[])[0]).toBe('https://rollon.com.bd/images/grinder.png');
    expect((schema.offers as { url: string }).url).toBe('https://rollon.com.bd/product/cyber-grinder');
  });

  it('keeps external image URLs unchanged', () => {
    const schema = buildProductJsonLd(
      { ...product, image: 'https://cdn.example.com/grinder.png', images: [] },
      '/product/cyber-grinder',
    );

    expect((schema.image as string[])[0]).toBe('https://cdn.example.com/grinder.png');
  });

  it('sets OutOfStock availability when product is unavailable', () => {
    const schema = buildProductJsonLd({ ...product, inStock: false }, '/product/cyber-grinder');
    expect((schema.offers as { availability: string }).availability).toBe('https://schema.org/OutOfStock');
  });
});

describe('useDocumentSEO', () => {
  it('updates title, canonical, and social metadata', () => {
    render(
      <TestSEO
        title="Cyber Grinder"
        description="Industrial precision grinder"
        canonicalPath="/product/cyber-grinder"
        image="/images/grinder.png"
        type="product"
      />,
    );

    expect(document.title).toBe('Cyber Grinder | RollON Bangladesh');
    expect(document.querySelector('meta[property="og:type"]')?.getAttribute('content')).toBe('product');
    expect(document.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(
      'https://rollon.com.bd/images/grinder.png',
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://rollon.com.bd/product/cyber-grinder',
    );
  });

  it('injects JSON-LD payload and removes it on unmount', () => {
    const jsonLd = buildProductJsonLd(product, '/product/cyber-grinder');
    const view = render(
      <TestSEO
        title="Cyber Grinder"
        description="Industrial precision grinder"
        canonicalPath="/product/cyber-grinder"
        jsonLd={jsonLd}
      />,
    );

    const script = document.getElementById('rollon-jsonld');
    expect(script).not.toBeNull();
    expect(script?.textContent).toContain('Cyber Grinder');

    view.unmount();
    expect(document.getElementById('rollon-jsonld')).toBeNull();
  });

  it('replaces stale JSON-LD when route metadata changes', () => {
    const first = buildProductJsonLd(product, '/product/cyber-grinder');
    const next = buildProductJsonLd({ ...product, name: 'Neo Grinder', slug: 'neo-grinder' }, '/product/neo-grinder');

    const view = render(
      <TestSEO
        title="Cyber Grinder"
        description="Industrial precision grinder"
        canonicalPath="/product/cyber-grinder"
        jsonLd={first}
      />,
    );

    view.rerender(
      <TestSEO
        title="Neo Grinder"
        description="Upgraded precision grinder"
        canonicalPath="/product/neo-grinder"
        jsonLd={next}
      />,
    );

    const script = document.getElementById('rollon-jsonld');
    expect(script?.textContent).toContain('Neo Grinder');
    expect(script?.textContent).not.toContain('Cyber Grinder');
  });
});
