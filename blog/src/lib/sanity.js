import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { toHTML } from '@portabletext/to-html';
import { posts as samplePosts } from '../data/posts.js';

export const client = createClient({
  projectId: '57jbjtzh',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const builder = createImageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);

const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  "slug": slug.current,
  title,
  excerpt,
  "tag": category->title,
  coverImage,
  "authorName": author->name,
  publishedAt,
  body
}`;

function initialsOf(name) {
  return (name || 'MultaZero')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();
}

function dateLabel(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function blocksToPlainText(body = []) {
  return body
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) => b.children.map((c) => c.text || '').join(''))
    .join(' ');
}

function readingTime(body) {
  const words = blocksToPlainText(body).split(/\s+/).filter(Boolean).length;
  const min = Math.max(1, Math.round(words / 200));
  return `${min} min de leitura`;
}

const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return '';
      const url = urlFor(value).width(1280).fit('max').auto('format').url();
      return `<img src="${url}" alt="${value.alt || ''}" loading="lazy" />`;
    },
  },
};

function bodyToHtml(body) {
  return body ? toHTML(body, { components: ptComponents }) : '';
}

function normalize(d) {
  return {
    slug: d.slug,
    title: d.title,
    tag: d.tag || 'Conteúdo',
    tags: d.tag ? [d.tag] : [],
    excerpt: d.excerpt || '',
    cover: d.coverImage?.asset
      ? urlFor(d.coverImage).width(1280).height(720).fit('crop').auto('format').url()
      : `${import.meta.env.BASE_URL}sample-cover.jpg`,
    author: { name: d.authorName || 'Equipe MultaZero', initials: initialsOf(d.authorName) },
    dateLabel: dateLabel(d.publishedAt),
    readingTime: readingTime(d.body),
    bodyHtml: bodyToHtml(d.body),
  };
}

// Sample posts kept as a graceful fallback while the Sanity dataset is empty
// (or not yet public). Same shape as normalized Sanity posts.
function sampleAsNormalized() {
  const base = import.meta.env.BASE_URL;
  return samplePosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    tag: p.tag,
    tags: p.tags,
    excerpt: p.excerpt,
    cover: `${base}${p.cover}`,
    author: p.author,
    dateLabel: p.dateLabel,
    readingTime: p.readingTime,
    bodyHtml: p.body,
  }));
}

export async function getPosts() {
  let docs = [];
  try {
    docs = await client.fetch(POSTS_QUERY);
  } catch (err) {
    console.warn('[sanity] fetch falhou, usando dados de exemplo:', err?.message || err);
    docs = [];
  }
  if (!docs || docs.length === 0) return sampleAsNormalized();
  return docs.map(normalize);
}
