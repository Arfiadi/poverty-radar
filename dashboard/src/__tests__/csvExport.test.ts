import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportDistrictsToCSV } from '../utils/csvExport';
import { District } from '../types';

describe('csvExport utility', () => {
  const sampleDistricts: District[] = [
    {
      provinsi: 'JAWA TIMUR',
      kab_kota: 'Surabaya',
      tipe_wilayah: 'Kota',
      region_pulau: 'Jawa',
      cluster_id: 0,
      cluster_name: 'Klaster 1: Perkotaan Modern & Formal',
      vulnerability_score: 0.1234,
      vulnerability_quadrant: 'Kuadran IV (Wilayah Terbina/Mapan)',
      poverty_rate_p0: 5.23,
      avg_school_years: 10.5,
      expenditure_per_capita: 18500,
      human_dev_index: 82.5,
      life_expectancy: 74.5,
      sanitation_access_pct: 95.5,
      clean_water_access_pct: 98.0,
      unemployment_rate_tpt: 6.5,
      labor_participation_tpak: 68.0,
      grdp_constant_million_idr: 450000000,
      log_pdrb: 19.92,
      is_multivariate_anomaly: false,
      anomaly_score: 0.12
    }
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('handles empty district array without error', () => {
    expect(() => exportDistrictsToCSV([])).not.toThrow();
  });

  it('triggers browser download link click with proper filename', () => {
    const mockClick = vi.fn();
    const mockSetAttribute = vi.fn();
    const mockAppendChild = vi.fn();
    const mockRemoveChild = vi.fn();

    // Mock DOM and URL globals
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn()
    });

    vi.stubGlobal('document', {
      createElement: vi.fn().mockReturnValue({
        setAttribute: mockSetAttribute,
        click: mockClick
      }),
      body: {
        appendChild: mockAppendChild,
        removeChild: mockRemoveChild
      }
    });

    exportDistrictsToCSV(sampleDistricts, 'TestExport');

    expect(mockSetAttribute).toHaveBeenCalledWith('href', 'blob:mock-url');
    expect(mockSetAttribute).toHaveBeenCalledWith(
      'download',
      expect.stringMatching(/^TestExport_\d{4}-\d{2}-\d{2}\.csv$/)
    );
    expect(mockClick).toHaveBeenCalled();
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
  });
});
