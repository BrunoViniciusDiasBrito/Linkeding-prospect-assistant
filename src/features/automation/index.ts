import { tauriApi } from '../../shared/api';
import type { Search } from '../../entities/search';

export async function openSavedSearchInControlledBrowser(search: Pick<Search, 'id' | 'url'>): Promise<void> {
  if (!search.url.startsWith('https://www.linkedin.com/') && !search.url.startsWith('https://linkedin.com/')) {
    throw new Error('A automação integrada aceita apenas URLs do LinkedIn salvas pelo usuário.');
  }
  await tauriApi.invoke('open_saved_search_url', { searchId: search.id, url: search.url });
}
