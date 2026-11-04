import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Placement = 'home' | 'work';

/** Projects in a group, in the order they appear on the given page. */
export async function projectsFor(group: Project['data']['group'], page: Placement): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => data.group === group);
  if (page === 'home') {
    return all.filter(({ data }) => data.homeOrder != null).sort((a, b) => a.data.homeOrder! - b.data.homeOrder!);
  }
  return all.sort((a, b) => a.data.order - b.data.order);
}
