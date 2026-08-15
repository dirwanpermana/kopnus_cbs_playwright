  // file normalize-allure-results.js untuk menormalkan hasil Allure agar menampilkan langkah-langkah Gherkin dengan benar, termasuk melampirkan tangkapan layar yang sesuai.

  const fs = require('fs');
  const path = require('path');

  const resultsDir = path.resolve(process.cwd(), 'reports', 'allure-results');

  if (!fs.existsSync(resultsDir)) {
    console.error('Allure results folder not found:', resultsDir);
    process.exit(1);
  }

  function collectAttachmentsList(obj, attachmentsList = []) {
    if (!obj || typeof obj !== 'object') return attachmentsList;

    if (Array.isArray(obj)) {
      obj.forEach(item => collectAttachmentsList(item, attachmentsList));
      return attachmentsList;
    }

    if (obj.attachments && Array.isArray(obj.attachments)) {
      for (const a of obj.attachments) {
        if (a && a.name && a.name.startsWith('Step:')) {
          attachmentsList.push(a);
        }
      }
    }

    if (obj.steps && Array.isArray(obj.steps)) {
      obj.steps.forEach(s => collectAttachmentsList(s, attachmentsList));
    }

    // also inspect nested objects for attachments
    Object.keys(obj).forEach(k => {
      const v = obj[k];
      if (v && typeof v === 'object' && k !== 'attachments' && k !== 'steps') {
        collectAttachmentsList(v, attachmentsList);
      }
    });

    return attachmentsList;
  }

  function normalizeFile(filePath) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);

      // Collect attachments across the whole result JSON in traversal order
      const attachmentsList = collectAttachmentsList(data) || [];
      if (!attachmentsList.length) {
        console.log('No Gherkin step attachments found in', path.basename(filePath));
        return;
      }

      // Try to extract full step list from feature file (so we include steps without attachments)
      let featureSteps = null;
      if (Array.isArray(data.labels)) {
        const suiteLabel = data.labels.find(l => l.name === 'suite') || data.labels.find(l => l.name === 'package');
        if (suiteLabel && suiteLabel.value) {
          let candidate = String(suiteLabel.value || '').replace(/\.spec\.js$/i, '');
          let featurePath = path.resolve(process.cwd(), candidate);
          if (!fs.existsSync(featurePath)) {
            // try appending .feature
            if (fs.existsSync(featurePath + '.feature')) featurePath = featurePath + '.feature';
          }
          if (fs.existsSync(featurePath)) {
            featureSteps = extractStepsFromFeature(featurePath, String(data.name || ''));
          }
        }
      }

      let newSteps = [];
      if (featureSteps && featureSteps.length) {
        // build steps from feature order, attach matching screenshots
        for (const stepText of featureSteps) {
          const norm = String(stepText || '').trim();
          const matched = attachmentsList.filter(a => String(a.name || '').replace(/^Step:\s*/i, '').trim() === norm);
          const unique = [];
          const seenSrc = new Set();
          for (const m of matched) {
            const src = m.source || m.file || m.name;
            if (src && !seenSrc.has(src)) {
              seenSrc.add(src);
              unique.push(m);
            }
          }
          newSteps.push({
            name: norm,
            status: data.status || 'unknown',
            statusDetails: data.statusDetails || {},
            stage: 'finished',
            steps: [],
            attachments: unique,
            parameters: [],
          });
        }
      } else {
        // fallback: use ordered attachment-derived step names
        const seen = new Set();
        const orderedStepNames = [];
        for (const a of attachmentsList) {
          const raw = String(a.name || '').replace(/^Step:\s*/i, '').trim();
          if (!seen.has(raw)) {
            seen.add(raw);
            orderedStepNames.push(raw);
          }
        }
        newSteps = orderedStepNames.map((stepName) => {
          const matched = attachmentsList.filter(a => String(a.name || '').replace(/^Step:\s*/i, '').trim() === stepName);
          const unique = [];
          const seenSrc = new Set();
          for (const m of matched) {
            const src = m.source || m.file || m.name;
            if (src && !seenSrc.has(src)) {
              seenSrc.add(src);
              unique.push(m);
            }
          }
          return {
            name: stepName,
            status: data.status || 'unknown',
            statusDetails: data.statusDetails || {},
            stage: 'finished',
            steps: [],
            attachments: unique,
            parameters: [],
          };
        });
      }

      // Backup original
      fs.copyFileSync(filePath, filePath + '.bak');

      // Replace top-level steps with normalized Gherkin steps
      data.steps = newSteps;

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log('Normalized', path.basename(filePath), '=>', newSteps.length, 'steps');
    } catch (err) {
      console.error('Failed to normalize', filePath, err.message);
    }
  }

  const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('-result.json'));
  if (!files.length) {
    console.error('No result JSON files found in', resultsDir);
    process.exit(1);
  }

  for (const f of files) {
    normalizeFile(path.join(resultsDir, f));
  }

  console.log('Allure results normalization complete.');

  function extractStepsFromFeature(featurePath, scenarioName) {
    if (!fs.existsSync(featurePath)) return null;
    const content = fs.readFileSync(featurePath, 'utf8');
    const lines = content.split(/\r?\n/);

    // find scenario occurrence
    let scenarioIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(scenarioName.toLowerCase())) {
        // ensure this line is within a Scenario block by searching backwards for 'Scenario'
        for (let j = i; j >= 0; j--) {
          if (/^\s*Scenario(?: Outline)?:/i.test(lines[j])) {
            scenarioIndex = j;
            break;
          }
        }
        if (scenarioIndex !== -1) break;
      }
    }

    if (scenarioIndex === -1) return null;

    const steps = [];
    for (let k = scenarioIndex + 1; k < lines.length; k++) {
      const line = lines[k].trim();
      if (line === '' ) break;
      if (/^@/.test(line)) break; // next scenario tags
      if (/^Scenario(?: Outline)?:/i.test(line)) break;
      const m = line.match(/^\s*(Given|When|Then|And|But)\s+(.*)/i);
      if (m) {
        steps.push(m[2].trim());
      }
    }

    return steps.length ? steps : null;
  }
