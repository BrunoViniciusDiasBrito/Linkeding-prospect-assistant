import { tauriApi } from '../../shared/api';
import type { Search, SearchPayload } from '../../entities/search';

const STORAGE_KEY = 'linkedin-prospect-assistant:searches';
const hasTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

const readLocalSearches = (): Search[] => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Search[];
const writeLocalSearches = (searches: Search[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));

export async function createSearch(payload: SearchPayload): Promise<Search> {
  if (hasTauri()) return tauriApi.invoke<Search>('create_search', { payload });
  const search: Search = { ...payload, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  writeLocalSearches([search, ...readLocalSearches()]);
  return search;
}

export async function listSearches(): Promise<Search[]> {
  if (hasTauri()) return tauriApi.invoke<Search[]>('list_searches');
  return readLocalSearches();
}

export async function updateSearch(id: string, payload: SearchPayload): Promise<Search> {
  if (hasTauri()) return tauriApi.invoke<Search>('update_search', { id, payload });
  const searches = readLocalSearches();
  const current = searches.find((search) => search.id === id);
  if (!current) throw new Error('Pesquisa salva não encontrada.');
  const updated = { ...current, ...payload };
  writeLocalSearches(searches.map((search) => (search.id === id ? updated : search)));
  return updated;
}

export async function deleteSearch(id: string): Promise<void> {
  if (hasTauri()) return tauriApi.invoke<void>('delete_search', { id });
  writeLocalSearches(readLocalSearches().filter((search) => search.id !== id));
}
