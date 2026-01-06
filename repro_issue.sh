#!/bin/bash

BASE_URL="http://localhost:5001/api"
EMAIL="test$(date +%s)@example.com"
PASSWORD="password123"

echo "Registering user..."
curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"testuser$(date +%s)\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}"
echo -e "\nUser registered."

echo "Logging in..."
LOGIN_RES=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo $LOGIN_RES | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token received: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo "Failed to get token. Login response: $LOGIN_RES"
  exit 1
fi

echo "Accessing protected route with Bearer token..."
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X GET "$BASE_URL/user" \
  -H "Authorization: Bearer $TOKEN")

HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | grep -v "HTTP_STATUS")

echo "Response Body: $BODY"
echo "HTTP Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "SUCCESS: Accessed protected route."
else
  echo "FAILURE: Could not access protected route."
fi
