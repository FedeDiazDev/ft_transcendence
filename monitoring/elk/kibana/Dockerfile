FROM kibana:7.17.28

USER root

COPY kibana-dashboard.ndjson /usr/share/kibana/dashboard.ndjson

COPY import-dashboards.sh /usr/share/kibana/import-dashboards.sh
RUN chmod +x /usr/share/kibana/import-dashboards.sh

USER kibana
