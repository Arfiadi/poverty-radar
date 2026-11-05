import { describe, it, expect, beforeEach } from 'vitest';
import { useFilterStore } from '../store/useFilterStore';

describe('useFilterStore Zustand Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useFilterStore.getState().resetFilters();
  });

  it('initializes with default values', () => {
    const state = useFilterStore.getState();
    expect(state.selectedIsland).toBe('Semua Wilayah');
    expect(state.selectedProvince).toBe('Semua Provinsi');
    expect(state.selectedCluster).toBe('all');
    expect(state.selectedQuadrant).toBe('all');
    expect(state.searchQuery).toBe('');
    expect(state.hasActiveFilters()).toBe(false);
  });

  it('updates selectedIsland and resets selectedProvince', () => {
    useFilterStore.getState().setSelectedProvince('Jawa Timur');
    expect(useFilterStore.getState().selectedProvince).toBe('Jawa Timur');

    useFilterStore.getState().setSelectedIsland('Sumatera');
    expect(useFilterStore.getState().selectedIsland).toBe('Sumatera');
    expect(useFilterStore.getState().selectedProvince).toBe('Semua Provinsi');
    expect(useFilterStore.getState().hasActiveFilters()).toBe(true);
  });

  it('detects active filters correctly', () => {
    expect(useFilterStore.getState().hasActiveFilters()).toBe(false);

    useFilterStore.getState().setSearchQuery('Surabaya');
    expect(useFilterStore.getState().hasActiveFilters()).toBe(true);

    useFilterStore.getState().clearSearch();
    expect(useFilterStore.getState().hasActiveFilters()).toBe(false);

    useFilterStore.getState().setP0Range([5.0, 30.0]);
    expect(useFilterStore.getState().hasActiveFilters()).toBe(true);
  });

  it('resets all filters back to defaults on resetFilters()', () => {
    useFilterStore.getState().setSelectedIsland('Jawa');
    useFilterStore.getState().setSelectedCluster(0);
    useFilterStore.getState().setSelectedQuadrant('Kuadran I');
    useFilterStore.getState().setSearchQuery('Malang');

    useFilterStore.getState().resetFilters();

    const state = useFilterStore.getState();
    expect(state.selectedIsland).toBe('Semua Wilayah');
    expect(state.selectedProvince).toBe('Semua Provinsi');
    expect(state.selectedCluster).toBe('all');
    expect(state.selectedQuadrant).toBe('all');
    expect(state.searchQuery).toBe('');
    expect(state.hasActiveFilters()).toBe(false);
  });
});
