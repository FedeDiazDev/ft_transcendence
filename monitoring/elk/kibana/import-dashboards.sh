#!/bin/bash

# Start Kibana in the background
/opt/kibana/bin/kibana &

# Wait until Kibana is ready
echo "Waiting for Kibana to start..."
until curl -u "$ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD" -s http://localhost:5601/api/status | grep -q '"state":"green"'; do
  sleep 5
done

# Import dashboards
echo "Kibana is up. Importing dashboards..."
curl -u "$ELASTICSEARCH_USERNAME:$ELASTICSEARCH_PASSWORD" \
  -X POST "http://localhost:5601/api/saved_objects/_import?overwrite=true" \
  -H "kbn-xsrf: true" \
  --form file=@/usr/share/kibana/dashboard.ndjson
echo "Dashboards imported"

# Keep Kibana running
wait
