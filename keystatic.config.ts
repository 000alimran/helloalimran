import { config, collection, fields } from '@keystatic/core';

const tone = fields.select({
  label: 'Page colour',
  options: [
    { label: 'Peach', value: 'peach' },
    { label: 'Sky', value: 'sky' },
    { label: 'Butter', value: 'butter' },
    { label: 'Teal', value: 'teal' },
    { label: 'Sage', value: 'sage' },
    { label: 'Forest (dark)', value: 'dark' },
    { label: 'Orange', value: 'orange' },
  ],
  defaultValue: 'peach',
});
const body = fields.markdoc({ label: 'Body', extension: 'md' });
const optionalNumber = (label: string, description?: string) => fields.integer({ label, description });

// The live site edits through GitHub (login with GitHub, saves become commits on main).
// `npm run dev` edits local files, unless PUBLIC_KEYSTATIC_GITHUB=1 is set (used once to create the GitHub App).
const useGitHub = !import.meta.env.DEV || import.meta.env.PUBLIC_KEYSTATIC_GITHUB === '1';

export default config({
  storage: useGitHub ? { kind: 'github', repo: '000alimran/helloalimran' } : { kind: 'local' },
  ui: { brand: { name: 'helloalimran.com' } },
  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['group', 'order'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        group: fields.select({
          label: 'Group',
          description: 'Venture = primary work with its own overview page. Orbit = associated project that links out.',
          options: [{ label: 'Venture', value: 'venture' }, { label: 'Orbit', value: 'orbit' }],
          defaultValue: 'orbit',
        }),
        order: fields.integer({ label: 'Order on Work page', validation: { isRequired: true }, defaultValue: 1 }),
        homeOrder: optionalNumber('Order on home page', 'Leave empty to keep it off the home page.'),
        tag: fields.text({ label: 'Card label', description: 'Top-right label on the card, e.g. HEALTHCARE' }),
        workTag: fields.text({ label: 'Card label on Work page (optional)' }),
        role: fields.text({ label: 'Role label', description: 'e.g. FOUNDER, CONNECTED PROJECT' }),
        summary: fields.text({ label: 'Card summary', multiline: true }),
        workSummary: fields.text({ label: 'Card summary on Work page (optional)', multiline: true }),
        website: fields.url({ label: 'Website URL', description: 'Leave empty if the site is not live yet.' }),
        domain: fields.text({ label: 'Domain', description: 'e.g. aiatdu.com' }),
        filter: fields.select({
          label: 'Work page filter (orbit only)',
          options: [
            { label: 'None', value: '' },
            { label: 'Public interest', value: 'public-interest' },
            { label: 'Exploration', value: 'exploration' },
          ],
          defaultValue: '',
        }),
        description: fields.text({ label: 'Overview page: meta description', multiline: true }),
        eyebrow: fields.text({ label: 'Overview page: eyebrow' }),
        subhead: fields.text({ label: 'Overview page: subhead', multiline: true }),
        tone,
        roleNote: fields.text({ label: 'Overview page: role note', multiline: true }),
        status: fields.text({ label: 'Overview page: case study status', multiline: true }),
        body,
      },
    }),
    writing: collection({
      label: 'Writing',
      slugField: 'title',
      path: 'src/content/writing/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title (used in lists and the browser tab)' } }),
        heading: fields.text({ label: 'Page heading' }),
        description: fields.text({ label: 'Meta description', multiline: true }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        eyebrow: fields.text({ label: 'Eyebrow' }),
        subhead: fields.text({ label: 'Subhead', multiline: true }),
        meta: fields.array(fields.text({ label: 'Item' }), { label: 'Meta line', itemLabel: (p) => p.value }),
        listLabel: fields.text({ label: 'List label', description: 'e.g. FIELD NOTE / 2026' }),
        homeSummary: fields.text({ label: 'Summary on home page', multiline: true }),
        indexSummary: fields.text({ label: 'Summary on Writing page', multiline: true }),
        note: fields.text({ label: 'Closing note', multiline: true }),
        body,
      },
    }),
    research: collection({
      label: 'Research',
      slugField: 'title',
      path: 'src/content/research/*',
      format: { contentField: 'body' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Full title' } }),
        pageTitle: fields.text({ label: 'Short title (browser tab)' }),
        description: fields.text({ label: 'Meta description', multiline: true }),
        order: fields.integer({ label: 'Order', defaultValue: 1 }),
        eyebrow: fields.text({ label: 'Eyebrow' }),
        subhead: fields.text({ label: 'Subhead', multiline: true }),
        meta: fields.array(fields.text({ label: 'Item' }), { label: 'Meta line', itemLabel: (p) => p.value }),
        notice: fields.text({ label: 'Notice box', multiline: true }),
        note: fields.text({ label: 'Closing note', multiline: true }),
        homeLabel: fields.text({ label: 'Label on home page' }),
        homeSummary: fields.text({ label: 'Summary on home page', multiline: true }),
        indexLabel: fields.text({ label: 'Label on Research page' }),
        indexSummary: fields.text({ label: 'Summary on Research page', multiline: true }),
        body,
      },
    }),
  },
});
