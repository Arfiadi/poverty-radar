/**
 * Geographical name reconciliation aliases between BPS Susenas survey data
 * and GADM level 1 (provinces) & level 2 (regencies/cities) GeoJSON topology.
 */

export const PROV_NAME_MAPPING: Record<string, string> = {
  'DKI JAKARTA': 'Jakarta Raya',
  'D I YOGYAKARTA': 'Yogyakarta',
  'KEP. BANGKA BELITUNG': 'Bangka Belitung',
};

export const KNOWN_DISTRICT_ALIASES: Record<string, string> = {
  'tanjung jabung b': 'tanjung jabung barat',
  'tanjung jabung t': 'tanjung jabung timur',
  'pakpak barat': 'pakpak bharat',
  'bolaang mongondow u': 'bolaang mongondow utara',
  'bolaang mongondow s': 'bolaang mongondow selatan',
  'bolaang mongondow t': 'bolaang mongondow timur',
  'penajam paser u': 'penajam paser utara',
  'memparwah': 'mempawah',
  'bagan siapi-api': 'rokan hilir',
  'kepulauan siau tagulandang biaro': 'siau tagulandang biaro',
};
