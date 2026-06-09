const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'README.md',
  'LINKEDIN_POST.md',
  'docs/PITCH.md',
  'docs/SECURITY.md',
  'docs/ARCHITECTURE.md',
  'docs/TESTING.md',
];

const replacements = [
  { regex: /Express\.ts backend/gi, replace: 'Vercel Serverless backend route' },
  { regex: /Express \+ Vite/gi, replace: 'Vite + Vercel Serverless Functions' },
  { regex: /Express backend/gi, replace: 'Vercel Serverless Function' },
  { regex: /Cloud Run/gi, replace: '' },
  { regex: /32 tests/gi, replace: '50 tests' },
  { regex: /31 tests/gi, replace: '50 tests' },
  { regex: /100% data confidentiality/gi, replace: 'privacy-first, device-local storage' },
  { regex: /absolute privacy/gi, replace: 'privacy-first, device-local storage' },
  {
    regex: /100% app availability/gi,
    replace: 'core experience remains functional without an AI key',
  },
  { regex: /100% of test suites/gi, replace: 'all automated tests currently pass' },
  { regex: /telemetry inputs/gi, replace: 'lifestyle inputs' },
  { regex: /trees planted/gi, replace: 'tree-growth equivalents' },
  {
    regex: /Express appends standard, robust security layers:/gi,
    replace: 'Vercel appends standard, robust security layers:',
  },
  {
    regex: /An Express\.ts backend bound natively with Vite/gi,
    replace: 'A Vercel Serverless backend bound natively with Vite',
  },
];

for (const file of filesToUpdate) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (const r of replacements) {
      content = content.replace(r.regex, r.replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
