// file generate-allure-pdf.js ini utk ekspor dokumentasi langkah testing berdasarkan file hasil di allure-results

const fs = require('fs');
const path = require('path');
let htmlDocx = null;
try {
  htmlDocx = require('html-docx-js');
} catch (err) {
  // optional dependency; Word export will be skipped if not installed
  htmlDocx = null;
}
const puppeteer = require('puppeteer');

const rootDir = process.cwd();
const resultsDir = path.resolve(rootDir, 'reports', 'allure-results');
const outDir = path.resolve(rootDir, 'test-docs');

const args = process.argv.slice(2);
const shouldHtml = args.includes('--html') || args.includes('--all');
const shouldPdf = args.includes('--pdf') || args.includes('--all') || args.length === 0;
const shouldWord = args.includes('--word') || args.includes('--all');

function ensureOutputDir() {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
}

function readResults() {
  if (!fs.existsSync(resultsDir)) {
    console.error(`Direktori allure-results tidak ditemukan: ${resultsDir}`);
    process.exit(1);
  }

  return fs.readdirSync(resultsDir)
    .filter((file) => file.endsWith('-result.json'))
    .map((file) => {
      const filePath = path.join(resultsDir, file);
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (err) {
        console.error(`Gagal membaca file hasil: ${filePath}`, err.message);
        return null;
      }
    })
    .filter(Boolean);
}

function getFeatureKey(result) {
  const fullName = normalizeString(result.fullName || result.name || 'unknown');
  const parts = fullName.split('#');
  let featureName = parts[0] || 'unknown';
  // featureName = featureName.replace(/\.feature\.spec\.js.*?:/gi, '').trim(); //pake uniq angka file
  featureName = featureName.replace(/\.(feature|spec|js|ts).*$/gi, '').trim();
  featureName = path.basename(featureName);
  return featureName;
}

function sanitizeFileName(value) {
  return normalizeString(value)
    .replace(/[^a-zA-Z0-9-_ ]+/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase();
}

function buildTitle() {
  return 'Dokumentasi Testing by Automation';
}

function toDataUri(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const ext = path.extname(filePath).toLowerCase();
  const mime = ext === '.png' ? 'image/png'
    : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
    : ext === '.gif' ? 'image/gif'
    : 'application/octet-stream';
  const data = fs.readFileSync(filePath);
  return `data:${mime};base64,${data.toString('base64')}`;
}

function normalizeString(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function findBrowserExecutable() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium'
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    } catch (err) {
      continue;
    }
  }

  try {
    const defaultPath = puppeteer.executablePath();
    if (defaultPath && fs.existsSync(defaultPath)) {
      return defaultPath;
    }
  } catch (error) {
    // ignore
  }

  return null;
}

function flattenSteps(steps, parents = []) {
  const rows = [];
  if (!Array.isArray(steps)) {
    return rows;
  }

  for (const step of steps) {
    const stepTitle = normalizeString(step.name || step.title || '');
    rows.push({
      title: stepTitle,
      status: step.status || 'unknown',
      attachments: Array.isArray(step.attachments) ? step.attachments : [],
      duration: step.duration,
      parentTitles: [...parents]
    });

    if (Array.isArray(step.steps) && step.steps.length) {
      rows.push(...flattenSteps(step.steps, [...parents, stepTitle]));
    }
  }

  return rows;
}

function extractScenarioName(result) {
  const fullName = normalizeString(result.fullName || result.name || '');
  const fullNameParts = fullName.split('#').map((t) => normalizeString(t));
  if (fullNameParts.length > 1) {
    return fullNameParts.slice(1).join(' - ');
  }
  return normalizeString(result.name || 'Unknown scenario');
}

function buildHtml(results, featureLabel) {
  const title = buildTitle();
  const generatedAt = new Date().toLocaleString('id-ID', { hour12: false });
  const sortedResults = [...results].sort((a, b) => extractScenarioName(a).localeCompare(extractScenarioName(b)));

  let html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #222; }
    h1 { color: #1f4e79; margin-bottom: 0; font-size: 32px; }
    .subtitle { margin-top: 4px; margin-bottom: 20px; font-size: 18px; color: #4a5568; }
    .summary { margin-bottom: 24px; font-size: 14px; color: #4a5568; }
    .summary p { margin: 4px 0; }
    .scenario { page-break-inside: avoid; margin-bottom: 40px; }
    .step { margin-bottom: 16px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; background: #fafafa; }
    .step-number { font-weight: bold; margin-bottom: 8px; }
    .step-title { font-size: 1rem; margin-bottom: 8px; }
    .attachment { margin-top: 8px; }
    .attachment img { width: 100%; max-width: 680px; border: 1px solid #ccc; border-radius: 4px; }
    .attachment-caption { font-size: 0.95rem; color: #555; margin-top: 4px; }
    .meta { font-size: 0.95rem; color: #555; margin-bottom: 12px; font-weight: bold; }
    .status-passed { color: green; }
    .status-failed, .status-broken { color: #d0342c; }
    .status-skipped { color: #b97a00; }
    .status-unknown { color: #555; }
    
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="subtitle">Scenario File: ${featureLabel}</div>
  <div class="summary">
    <p>Tanggal Testing: ${generatedAt}</p>
    <p>Total scenario: ${sortedResults.length}</p>
  </div>
`;

  sortedResults.forEach((result, index) => {
    const scenarioName = extractScenarioName(result);
    const status = normalizeString(result.status || 'unknown');
    const duration = result.stop && result.start ? `${result.stop - result.start} ms` : (result.duration ? `${result.duration} ms` : 'N/A');
    const steps = flattenSteps(result.steps || []);
    let screenshotNumber = 0;

    html += `<div class="scenario">
      <h2>${index + 1}. ${scenarioName}</h2>
      <div class="meta" >Status Testing : <span class="status-${status}">${status}</span></div>
    `;

    if (steps.length === 0) {
      html += '<p>Tidak ada langkah yang ditemukan.</p>';
    }

    steps.forEach((step, stepIndex) => {
      const stepIndexLabel = `${index + 1}.${stepIndex + 1}`;
      html += `<div class="step">
        <div class="step-number">Langkah ${stepIndexLabel}</div>
        <div class="step-title">${step.title}</div>
        <div class="meta">Status Steps: <span class="status-${step.status}">${step.status}</span></div>
      `;

      if (step.attachments.length > 0) {
        step.attachments.forEach((attachment) => {
          const source = normalizeString(attachment.source || attachment.file || attachment.name || '');
          const attachmentPath = path.join(resultsDir, source);
          const dataUri = toDataUri(attachmentPath);
          if (dataUri) {
            screenshotNumber += 1;
            const attachmentLabel = `${scenarioName} - ${screenshotNumber}`;
            html += `<div class="attachment">
              <img src="${dataUri}" alt="${attachmentLabel}" />
            </div>`;
          }
        });
      }

      html += '</div>';
    });

    html += '</div>';
  });

  html += '</body></html>';
  return html;
}

function writeHtml(html, featureFileName) {
  const outputPath = path.join(outDir, `${featureFileName}.html`);
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`HTML dokumentasi dibuat: ${outputPath}`);
}

async function generatePdf(html, fileName) {
  const executablePath = findBrowserExecutable();
  const launchOptions = {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  };

  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const outputPath = path.join(outDir, `${fileName}.pdf`);
  await page.pdf({ path: outputPath, format: 'A4', printBackground: true, margin: { top: '24px', right: '16px', bottom: '24px', left: '16px' } });
  await browser.close();
  console.log(`PDF dokumentasi dibuat: ${outputPath}`);
}

async function generateWord(html, featureFileName) {
  if (!htmlDocx) {
    console.warn('html-docx-js not installed; skipping Word (.docx) generation. Install with `npm i -D html-docx-js`.');
    return;
  }

  try {
    let buffer = null;
    if (typeof htmlDocx.asBuffer === 'function') {
      buffer = htmlDocx.asBuffer(html);
    } else if (typeof htmlDocx.asBlob === 'function') {
      const blob = htmlDocx.asBlob(html);
      if (blob && blob.arrayBuffer) {
        const arr = await blob.arrayBuffer();
        buffer = Buffer.from(arr);
      }
    } else if (typeof htmlDocx === 'function') {
      // some builds export function directly
      buffer = Buffer.from(htmlDocx(html));
    }

    if (!buffer) {
      console.warn('html-docx-js did not produce a Buffer; skipping .docx output.');
      return;
    }

    const outputPath = path.join(outDir, `${featureFileName}.docx`);
    fs.writeFileSync(outputPath, buffer);
    console.log(`Word dokumentasi dibuat: ${outputPath}`);
  } catch (err) {
    console.error('Gagal membuat Word (.docx):', err.message);
  }
}

(async () => {
  ensureOutputDir();
  const results = readResults();

  const grouped = results.reduce((acc, result) => {
    const key = getFeatureKey(result);
    const featureKey = key || 'unknown';
    acc[featureKey] = acc[featureKey] || [];
    acc[featureKey].push(result);
    return acc;
  }, {});

  for (const result of results) {
    const featureKey = getFeatureKey(result);
    const featureSanitized = sanitizeFileName(featureKey) || 'feature';
    const scenarioName = extractScenarioName(result);
    const scenarioSanitized = sanitizeFileName(scenarioName) || 'scenario';
    
    // Combine feature and scenario name with dash separator
    const combinedFileName = `${featureSanitized}-${scenarioSanitized}`;
    
    // Build HTML for single scenario
    const html = buildHtml([result], featureKey);

    if (shouldHtml) {
      writeHtml(html, combinedFileName);
    }
    if (shouldWord) {
      await generateWord(html, combinedFileName);
    }
    if (shouldPdf) {
      try {
        await generatePdf(html, combinedFileName);
      } catch (error) {
        console.error(`PDF gagal dibuat untuk ${combinedFileName}. Pastikan Chrome/Chromium tersedia.`);
        console.error(error.message);
      }
    }
  }
})();