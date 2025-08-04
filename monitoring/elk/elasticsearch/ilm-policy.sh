#!/bin/bash

ES_HOST="http://localhost:9200"
ES_USER="elastic"
ES_PASS="$ELASTIC_PASSWORD"

# Wait until Elasticsearch is ready
until curl -u "$ES_USER:$ES_PASS" -s "$ES_HOST/_cluster/health?wait_for_status=yellow" | grep -q '"status":"yellow"\|"status":"green"'; do
  echo "Waiting for Elasticsearch to start..."
  sleep 5
done

echo "Elasticsearch is up. Creating ILM policy..."

# Create ILM policy
curl -s -X PUT "$ES_HOST/_ilm/policy/log-retention-policy" \
  -u $ES_USER:$ES_PASS \
  -H 'Content-Type: application/json' \
  -d '{
    "policy": {
      "phases": {
        "hot": {
          "min_age": "0ms",
          "actions": {}
        },
        "delete": {
          "min_age": "30d",
          "actions": {
            "delete": {}
          }
        }
      }
    }
  }' && echo "ILM policy created."

# Create index template for all logstash-* indices
curl -s -X PUT "$ES_HOST/_index_template/logstash-lifecycle-template" \
  -u $ES_USER:$ES_PASS \
  -H 'Content-Type: application/json' \
  -d '{
    "index_patterns": ["logstash-*"],
    "template": {
      "settings": {
        "index.lifecycle.name": "log-retention-policy"
      }
    },
    "priority": 10
  }' && echo "Index template created."

# Apply ILM to existing logstash-* indices
echo "Checking for existing logstash-* indices..."
EXISTING_INDICES=$(curl -s -u $ES_USER:$ES_PASS "$ES_HOST/_cat/indices/logstash-*?h=index" | tr -d '\r')

for index in $EXISTING_INDICES; do
  echo "Applying ILM to $index..."
  curl -s -X PUT "$ES_HOST/$index/_settings" \
    -u $ES_USER:$ES_PASS \
    -H 'Content-Type: application/json' \
    -d '{
      "index": {
        "lifecycle": {
          "name": "log-retention-policy"
        }
      }
    }'
done
