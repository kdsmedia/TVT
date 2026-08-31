export interface IPTVSource {
  id: string;
  name: string;
  description: string;
  url: string;
  channelCount: string;
}

export const IPTV_SOURCES: IPTVSource[] = [
  {
    id: 'free-tv',
    name: 'Free-TV (Lengkap)',
    description: 'Playlist penuh dari komunitas Free-TV',
    url: 'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlist.m3u8',
    channelCount: '~1.000+ saluran',
  },
  {
    id: 'movies',
    name: 'Movies',
    description: 'Kategori Film dari IPTV-org',
    url: 'https://iptv-org.github.io/iptv/categories/movies.m3u',
    channelCount: '~350 saluran',
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Kategori Olahraga dari IPTV-org',
    url: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
    channelCount: '~320 saluran',
  },
  {
    id: 'everything',
    name: 'Semua Saluran',
    description: 'Seluruh katalog IPTV-org',
    url: 'https://iptv-org.github.io/iptv/index.m3u',
    channelCount: '~12.000+ saluran',
  },
  {
    id: 'by-category',
    name: 'Per Kategori',
    description: 'Saluran dikelompokkan per folder (News, Sports, Movies)',
    url: 'https://iptv-org.github.io/iptv/index.category.m3u',
    channelCount: 'Semua kategori',
  },
];

export const getIPTVSourceById = (id: string) => IPTV_SOURCES.find(s => s.id === id);