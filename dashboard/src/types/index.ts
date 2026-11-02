export interface District {
  provinsi: string;
  kab_kota: string;
  tipe_wilayah: 'Kabupaten' | 'Kota';
  region_pulau: string;
  cluster_id: number;
  cluster_name: string;
  vulnerability_score: number;
  vulnerability_quadrant: string;
  poverty_rate_p0: number;
  avg_school_years: number;
  expenditure_per_capita: number;
  human_dev_index: number;
  life_expectancy: number;
  sanitation_access_pct: number;
  clean_water_access_pct: number;
  unemployment_rate_tpt: number;
  labor_participation_tpak: number;
  grdp_constant_million_idr: number;
  log_pdrb: number;
  is_multivariate_anomaly: boolean;
  anomaly_score: number;
}

export interface ClusterSummary {
  cluster_id: number;
  cluster_name: string;
  n_members: number;
  pct_share: number;
  mean_p0: number;
  median_p0: number;
  mean_v_struc: number;
  mean_avg_school_years: number;
  mean_expenditure: number;
  mean_life_expectancy: number;
  mean_sanitation: number;
  mean_water: number;
  mean_tpt: number;
  mean_tpak: number;
  mean_log_pdrb: number;
  z_avg_school_years?: number;
  z_expenditure?: number;
  z_life_expectancy?: number;
  z_sanitation?: number;
  z_water?: number;
  z_tpt?: number;
  z_log_pdrb?: number;
}

export interface PolicyRecommendation {
  category_type: 'cluster' | 'quadrant';
  id: string;
  code: string;
  name: string;
  n_regions: number;
  pct_regions: number;
  poverty_range: string;
  deficit_profile: string;
  working_hypothesis: string;
  primary_policy_track: string;
  fiscal_instruments: string;
  lead_agencies: string;
  direct_evidence_required: string;
}

export interface OLSResult {
  feature: string;
  label: string;
  beta: number;
  t_stat: number;
  p_val: number;
  significance: string;
}

export interface BoundaryCase {
  region: string;
  province: string;
  variable: string;
  variable_label: string;
  value: number;
  unit: string;
  p0: number;
  tpak?: number;
  context: string;
}

export interface NationalBenchmarks {
  n_regions: number;
  n_provinces: number;
  median_p0: number;
  mean_p0: number;
  min_p0: number;
  min_p0_region: string;
  min_p0_province: string;
  max_p0: number;
  max_p0_region: string;
  max_p0_province: string;
  disparity_ratio: number;
  total_acute_pockets: number;
  eastern_acute_count: number;
  eastern_acute_pct: number;
  western_acute_count: number;
  western_acute_pct: number;
  median_v_struc: number;
  dualism_kab_p0: number;
  dualism_kota_p0: number;
  dualism_kab_tpt: number;
  dualism_kota_tpt: number;
}

export type CaseStudyPin = 'none' | 'resource_curse' | 'madura';

export interface FilterState {
  selectedIsland: string;
  selectedProvince: string;
  selectedCluster: number | 'all';
  selectedQuadrant: string | 'all';
  searchQuery: string;
  p0Range: [number, number];
  activeCasePin: CaseStudyPin;
}
