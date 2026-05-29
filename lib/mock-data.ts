import type { Entry } from './types'

export const mockEntries: Entry[] = [
  {
    id: '1',
    title: 'Plan na dziś',
    content: 'Rano bieganie, potem praca nad projektem Dzienniczek. Wieczorem czytanie ulubionej książki i relaks.',
    mood: 'great',
    tags: ['projekt', 'sport'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Pomysły na nowe funkcje',
    content: 'Może dodać wyszukiwanie wpisów? Albo eksport do PDF? Warto też pomyśleć o trybie skupienia.',
    mood: 'good',
    tags: ['pomysły', 'projekt'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Refleksje po tygodniu',
    content: 'Byłam trochę zmęczona, ale udało mi się skończyć ważny projekt. Trzeba pamiętać o odpoczynku.',
    mood: 'neutral',
    tags: ['refleksje'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]
