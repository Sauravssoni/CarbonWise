echo "--- SCANS ---"
grep -R ": any" . --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=coverage || true
grep -R "as any" . --include="*.ts" --include="*.tsx" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=coverage || true
grep -R "server.ts" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=coverage || true
grep -R "Express" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=coverage || true
grep -R "Cloud Run" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=coverage || true
grep -R "AI Studio" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=coverage || true
grep -R "32 tests" . --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build --exclude-dir=coverage || true
grep -R "err?.message\|String(err" api src --include="*.ts" --include="*.tsx" || true
grep -R "confirm(" src --include="*.ts" --include="*.tsx" || true
grep -R "text-\[8px\]\|text-\[9px\]\|text-\[10px\]" src --include="*.tsx" || true

echo "--- NPM RUN LINT ---"
npm run tsc || npx tsc --noEmit

echo "--- NPM RUN TEST ---"
CI=true npx vitest run

echo "--- NPM RUN COVERAGE ---"
CI=true npm run coverage

echo "--- NPM RUN BUILD ---"
npm run build

echo "--- NPM AUDIT ---"
npm audit --audit-level=high || true

echo "--- CURL 1 ---"
curl -I -s https://carbon-wise-eight.vercel.app/ | head -n 1

echo "--- CURL 2 ---"
curl -s https://carbon-wise-eight.vercel.app/api/health

echo "--- CURL 3 ---"
curl -s -X POST https://carbon-wise-eight.vercel.app/api/generate-insight \
  -H "Content-Type: application/json" \
  -d '{
    "commuteMode": "Car",
    "distancePerDayKm": 35,
    "carpool": false,
    "flightsThisMonth": 1,
    "electricityKwhMonthly": 360,
    "acUsage": "Medium",
    "householdSize": 2,
    "dietType": "Mixed",
    "foodWaste": "Sometimes",
    "eatingOutFrequency": "Weekly",
    "onlineOrdersMonthly": 5,
    "clothingPurchasesMonthly": 2,
    "recyclingHabit": "Sometimes",
    "reductionTarget": 10,
    "preferredEffort": "Balanced",
    "optionalNote": "Final valid payload."
  }'

echo "--- REPO SIZE ---"
du -sh . --exclude=node_modules

