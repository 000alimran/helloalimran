import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const tones = ['peach', 'sky', 'butter', 'teal', 'sage', 'dark', 'orange'] as const;

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    // venture: primary work with its own overview page. orbit: associated project linking out.
    group: z.enum(['venture', 'orbit']),
    order: z.number(),
    homeOrder: z.number().nullish(),
    tag: z.string(),
    workTag: z.string().nullish(),
    role: z.string(),
    summary: z.string(),
    workSummary: z.string().nullish(),
    // Keystatic saves empty optional fields as "", so treat "" as unset.
    website: z.preprocess((v) => v || null, z.string().url().nullish()),
    domain: z.string(),
    filter: z.preprocess((v) => v || null, z.enum(['public-interest', 'exploration']).nullish()),
    // Overview page fields (ventures only)
    description: z.string().nullish(),
    eyebrow: z.string().nullish(),
    subhead: z.string().nullish(),
    tone: z.enum(tones).nullish(),
    roleNote: z.string().nullish(),
    status: z.string().nullish(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    heading: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    eyebrow: z.string(),
    subhead: z.string(),
    meta: z.array(z.string()),
    listLabel: z.string(),
    homeSummary: z.string(),
    indexSummary: z.string(),
    note: z.string().nullish(),
  }),
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    pageTitle: z.string(),
    description: z.string(),
    order: z.number(),
    eyebrow: z.string(),
    subhead: z.string(),
    meta: z.array(z.string()),
    notice: z.string().nullish(),
    note: z.string().nullish(),
    homeLabel: z.string(),
    homeSummary: z.string(),
    indexLabel: z.string(),
    indexSummary: z.string(),
  }),
});

export const collections = { projects, writing, research };
