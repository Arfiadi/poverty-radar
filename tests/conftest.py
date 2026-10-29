"""
Pytest configuration and shared fixtures for PovertyRadar tests.
"""

import pytest
import pandas as pd
from pathlib import Path

from poverty_radar.config import PROCESSED_DATA_PATH, CLEANED_DATA_PATH, RAW_DATA_PATH
from poverty_radar.data.loader import load_raw_data, load_cleaned_data, load_processed_data


@pytest.fixture
def raw_df():
    return load_raw_data(RAW_DATA_PATH)


@pytest.fixture
def cleaned_df():
    return load_cleaned_data(CLEANED_DATA_PATH)


@pytest.fixture
def processed_df():
    return load_processed_data(PROCESSED_DATA_PATH)

