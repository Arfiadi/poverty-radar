"""
Export canonical processed data and statistical benchmarks to JSON payloads
for the PovertyRadar SDGs React + Vite frontend dashboard.
"""

from poverty_radar.data.exporter import export_dashboard_payloads


def export_all():
    export_dashboard_payloads()


if __name__ == "__main__":
    export_all()
