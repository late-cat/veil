#!/bin/bash
echo "Starting Preprod Siege (Day 2)..."
count=1
while [ $count -le 50 ]
do
  echo "==================================="
  echo "Attempt $count..."
  echo "==================================="
  npm run deploy -- --network preprod
  if [ $? -eq 0 ]; then
    echo "SUCCESS! Deployment went through."
    exit 0
  fi
  echo "Failed. Midnight servers dropped connection. Retrying in 5 seconds..."
  sleep 5
  ((count++))
done
echo "Siege finished without success."
