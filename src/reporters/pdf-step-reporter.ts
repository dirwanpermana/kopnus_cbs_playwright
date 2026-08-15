import type {
  Reporter, FullConfig, Suite, TestCase, TestResult, TestStep,
} from '@playwright/test/reporter';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';

type PdfDoc = InstanceType<typeof PDFDocument>;

/**
 * Generates one PDF per test run under reports/pdf/.
 * Detailed mode (per your decision): every Gherkin step (Given/When/Then) gets its own
 * screenshot embedded, regardless of pass/fail — not just failures.
 *
 * How screenshots reach this reporter:
 * src/support/stepScreenshot.ts's withStepScreenshot() is called manually inside each
 * step body and calls `test.info().attach('step-screenshot-<n>-<passed|failed>', ...)`
 * right after the step finishes. This reporter reads `result.attachments` and zips them
 * 1:1 (in order) against `result.steps` filtered to BDD-level steps (category 'test.step').
 */
export default class PdfStepReporter implements Reporter {
  private outputDir = path.resolve(process.cwd(), 'reports/pdf');
  private doc: PdfDoc | null = null;
  private outStream: fs.WriteStream | null = null;

  onBegin(_config: FullConfig, _suite: Suite): void {
    // Intentionally lazy — do NOT create the PDF file here. `onBegin` also fires during
    // `playwright test --list` (no test actually runs), which previously left behind an
    // empty 0-byte PDF because `onEnd()` never got a matching `doc.end()` call.
    // File creation is deferred to the first `onTestEnd`, so a PDF only ever appears when
    // at least one test actually executed. (Bug found via real `--list` + `test` runs.)
  }

  private ensureDoc(): PdfDoc {
    if (this.doc) return this.doc;

    fs.mkdirSync(this.outputDir, { recursive: true });
    const fileName = `test-report-${this.timestamp()}.pdf`;
    const doc = new PDFDocument({ margin: 40, size: 'A4', bufferPages: true });
    this.outStream = fs.createWriteStream(path.join(this.outputDir, fileName));
    doc.pipe(this.outStream);

    doc.fontSize(18).text('CBS Automation — Test Execution Report (Detail)', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor('gray')
      .text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.fillColor('black');
    doc.moveDown(1.5);

    this.doc = doc;
    return doc;
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const doc = this.ensureDoc();
    this.ensureSpace(doc, 80);
    doc.fontSize(13).fillColor('#1a1a1a').text(test.title, { underline: true });

    const statusColor = result.status === 'passed' ? 'green'
      : result.status === 'failed' ? 'red'
      : result.status === 'skipped' ? 'gray'
      : 'orange';

    doc.fontSize(10).fillColor(statusColor)
      .text(`Status: ${result.status.toUpperCase()}  |  Duration: ${result.duration}ms  |  Retries: ${result.retry}`);
    doc.fillColor('black');
    doc.moveDown(0.5);

    const bddSteps = result.steps.filter((s: TestStep) => s.category === 'test.step');
    const stepScreenshots = result.attachments
      .filter(a => a.name.startsWith('step-screenshot-') && a.path)
      .sort((a, b) => this.stepIndexOf(a.name) - this.stepIndexOf(b.name));

    if (bddSteps.length === 0) {
      // Test failed before any BDD step ran (e.g. worker fixture setup failure, like a DB
      // that's unreachable) — still surface that in the PDF instead of silently showing
      // an empty step list.
      doc.fontSize(9).fillColor('red')
        .text(`(No BDD steps executed — test failed during setup: ${this.cleanError(result.error?.message)})`);
      doc.fillColor('black');
    }

    bddSteps.forEach((step: TestStep, idx: number) => {
      this.ensureSpace(doc, 220); // reserve room for text + one embedded screenshot before page-break

      const mark = step.error ? '✗' : '✓';
      const color = step.error ? 'red' : 'green';
      doc.fontSize(10).fillColor(color).text(`${mark} ${step.title}`, { continued: false });
      doc.fontSize(8).fillColor('gray').text(`  duration: ${step.duration}ms`);
      doc.fillColor('black');

      if (step.error?.message) {
        doc.fontSize(8).fillColor('red').text(`  Error: ${this.cleanError(step.error.message)}`);
        doc.fillColor('black');
      }

      const screenshot = stepScreenshots[idx];
      if (screenshot?.path && fs.existsSync(screenshot.path)) {
        try {
          doc.moveDown(0.2);
          doc.image(screenshot.path, { width: 350 });
        } catch {
          doc.fontSize(8).fillColor('gray').text('  [screenshot could not be embedded]');
          doc.fillColor('black');
        }
      }
      doc.moveDown(0.6);
    });

    doc.moveDown(0.5);
    this.drawSeparator(doc);
    doc.moveDown(1);
  }

  onEnd(): void {
    // Guard: if no test ever ran (e.g. `--list`), this.doc stays null — nothing to close.
    this.doc?.end();
  }

  private stepIndexOf(attachmentName: string): number {
    const match = attachmentName.match(/^step-screenshot-(\d+)-/);
    return match ? Number(match[1]) : 0;
  }

  private ensureSpace(doc: PdfDoc, minHeight: number): void {
    const remaining = doc.page.height - doc.page.margins.bottom - doc.y;
    if (remaining < minHeight) {
      doc.addPage();
    }
  }

  private drawSeparator(doc: PdfDoc): void {
    const y = doc.y;
    doc.moveTo(40, y).lineTo(555, y).strokeColor('#dddddd').stroke();
    doc.strokeColor('black');
  }

  private cleanError(message?: string): string {
    if (!message) return 'Unknown error';
    return message.replace(/\u001b\[[0-9;]*m/g, '').slice(0, 400);
  }

  private timestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }
}
