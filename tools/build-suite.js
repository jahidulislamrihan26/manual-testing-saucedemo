// Generates Excel workbook, CSV files, bug report pages and metrics from suite-data.js
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { EXEC_DATE, requirements, cases, defects } = require('./suite-data');

const ROOT = path.join(__dirname, '..');
const SUITE = path.join(ROOT, 'test-suite');
const DEF = path.join(ROOT, 'defects');
fs.mkdirSync(SUITE, { recursive: true });
fs.mkdirSync(DEF, { recursive: true });

// ---------- metrics
const count = (arr, f) => arr.filter(f).length;
const status = (s) => count(cases, (c) => c.status === s);
const executed = cases.length - status('Not Run');
const m = {
  total: cases.length, pass: status('Pass'), fail: status('Fail'), notRun: status('Not Run'),
  executed, passRate: +(100 * status('Pass') / executed).toFixed(1),
  executionRate: +(100 * executed / cases.length).toFixed(1),
  defects: defects.length,
  bySeverity: ['Critical', 'Major', 'Minor'].map((s) => [s, count(defects, (d) => d.severity === s)]),
  byKind: ['Genuine', 'Seeded'].map((s) => [s, count(defects, (d) => d.kind === s)]),
  byModule: {},
  reqCoverage: requirements.map((r) => {
    const cs = cases.filter((c) => c.req === r[0]);
    return [r[0], r[1], cs.length, count(cs, (c) => c.status === 'Pass'), count(cs, (c) => c.status === 'Fail'), count(cs, (c) => c.status === 'Not Run')];
  }),
};
cases.forEach((c) => {
  const k = c.module;
  m.byModule[k] = m.byModule[k] || { total: 0, pass: 0, fail: 0, notRun: 0 };
  m.byModule[k].total++;
  m.byModule[k][c.status === 'Pass' ? 'pass' : c.status === 'Fail' ? 'fail' : 'notRun']++;
});
fs.writeFileSync(path.join(SUITE, 'metrics.json'), JSON.stringify(m, null, 2));

// ---------- CSV
const csvCell = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
const csv = (rows) => '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\n') + '\n';
const tcHead = ['ID', 'Requirement', 'Module', 'Title', 'Type', 'Priority', 'Preconditions', 'Test Data', 'Steps', 'Expected Result', 'Actual Result', 'Status', 'Defect', 'Evidence'];
fs.writeFileSync(path.join(SUITE, 'test-cases.csv'), csv([tcHead, ...cases.map((c) => [c.id, c.req, c.module, c.title, c.type, c.priority, c.pre, c.data, c.steps.replace(/\n/g, ' '), c.expected, c.actual, c.status, c.defect, c.evidence])]));
const dHead = ['ID', 'Title', 'Severity', 'Priority', 'Module', 'Origin', 'Status', 'Failed Test Cases', 'Evidence'];
fs.writeFileSync(path.join(DEF, 'defect-log.csv'), csv([dHead, ...defects.map((d) => [d.id, d.title, d.severity, d.priority, d.module, d.kind, 'Open', d.tcs, d.evidence])]));

// ---------- bug report pages
for (const d of defects) {
  const img = d.evidence.endsWith('.png') ? `\n## Evidence\n![${d.id}](../evidence/${d.evidence})\n` : '\n## Evidence\nBrowser alert or behaviour with no screenshot; reproduce with the steps above.\n';
  const md = `# ${d.id}: ${d.title}

| Field | Value |
|---|---|
| Severity | ${d.severity} |
| Priority | ${d.priority} |
| Module | ${d.module} |
| Origin | ${d.kind} |
| Status | Open |
| Found in | https://www.saucedemo.com, Chrome (Chromium), ${EXEC_DATE} |
| Test user | \`${d.user}\` |
| Failed test cases | ${d.tcs} |

## Steps to reproduce
${d.steps.split('\n').map((s) => s).join('\n')}

## Expected result
${d.expected}

## Actual result
${d.actual}
${img}${d.note ? `\n> ${d.note}\n` : ''}`;
  fs.writeFileSync(path.join(DEF, `${d.id}.md`), md);
}

// ---------- Excel
const NAVY = 'FF1F3864', GREY = 'FFF2F2F2';
const fills = { Pass: 'FFC6EFCE', Fail: 'FFFFC7CE', 'Not Run': 'FFFFEB9C' };
const fonts = { Pass: 'FF006100', Fail: 'FF9C0006', 'Not Run': 'FF9C5700' };
const head = (row) => {
  row.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
  row.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  row.height = 24;
};
const border = { top: { style: 'thin', color: { argb: 'FFBFBFBF' } }, left: { style: 'thin', color: { argb: 'FFBFBFBF' } }, bottom: { style: 'thin', color: { argb: 'FFBFBFBF' } }, right: { style: 'thin', color: { argb: 'FFBFBFBF' } } };

(async () => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SQA Portfolio';
  wb.created = new Date(EXEC_DATE);

  // Dashboard
  const ds = wb.addWorksheet('Dashboard', { views: [{ showGridLines: false }] });
  ds.columns = [{ width: 3 }, { width: 28 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }, { width: 14 }];
  ds.mergeCells('B2:G2');
  ds.getCell('B2').value = 'Sauce Demo - Test Execution Dashboard';
  ds.getCell('B2').font = { size: 18, bold: true, color: { argb: NAVY } };
  ds.mergeCells('B3:G3');
  ds.getCell('B3').value = `Executed ${EXEC_DATE} | Chrome 1366x768 and 375x667 | https://www.saucedemo.com`;
  ds.getCell('B3').font = { italic: true, color: { argb: 'FF595959' } };
  const kpis = [['Total test cases', m.total], ['Executed', m.executed], ['Passed', m.pass], ['Failed', m.fail], ['Not run', m.notRun], ['Pass rate (executed)', m.passRate / 100]];
  kpis.forEach((k, i) => {
    const col = 2 + i;
    const lab = ds.getCell(5, col), val = ds.getCell(6, col);
    lab.value = k[0]; lab.font = { bold: true, size: 9, color: { argb: 'FF595959' } }; lab.alignment = { horizontal: 'center', wrapText: true };
    val.value = k[1]; val.font = { bold: true, size: 20, color: { argb: NAVY } }; val.alignment = { horizontal: 'center' };
    if (i === 5) val.numFmt = '0.0%';
    [lab, val].forEach((c) => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GREY } }; });
  });
  ds.getRow(5).height = 28; ds.getRow(6).height = 34;
  // live formulas for the 5 count KPIs
  ds.getCell('B6').value = { formula: "COUNTA('Test Cases'!A2:A200)", result: m.total };
  ds.getCell('D6').value = { formula: "COUNTIF('Test Cases'!L2:L200,\"Pass\")", result: m.pass };
  ds.getCell('E6').value = { formula: "COUNTIF('Test Cases'!L2:L200,\"Fail\")", result: m.fail };
  ds.getCell('F6').value = { formula: "COUNTIF('Test Cases'!L2:L200,\"Not Run\")", result: m.notRun };
  ds.getCell('C6').value = { formula: 'D6+E6', result: m.executed };
  ds.getCell('G6').value = { formula: 'D6/C6', result: m.passRate / 100 };

  ds.getCell('B9').value = 'Results by module'; ds.getCell('B9').font = { bold: true, size: 12, color: { argb: NAVY } };
  const mh = ds.getRow(10); ['Module', 'Total', 'Pass', 'Fail', 'Not Run'].forEach((h, i) => (mh.getCell(2 + i).value = h)); [2, 3, 4, 5, 6].forEach((c) => { const x = mh.getCell(c); x.font = { bold: true, color: { argb: 'FFFFFFFF' } }; x.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }; x.alignment = { horizontal: 'center' }; });
  let r = 11;
  Object.entries(m.byModule).forEach(([k, v]) => {
    ds.getCell(r, 2).value = k;
    ds.getCell(r, 3).value = { formula: `COUNTIF('Test Cases'!C2:C200,B${r})`, result: v.total };
    ds.getCell(r, 4).value = { formula: `COUNTIFS('Test Cases'!C2:C200,B${r},'Test Cases'!L2:L200,"Pass")`, result: v.pass };
    ds.getCell(r, 5).value = { formula: `COUNTIFS('Test Cases'!C2:C200,B${r},'Test Cases'!L2:L200,"Fail")`, result: v.fail };
    ds.getCell(r, 6).value = { formula: `COUNTIFS('Test Cases'!C2:C200,B${r},'Test Cases'!L2:L200,"Not Run")`, result: v.notRun };
    for (let c = 2; c <= 6; c++) { ds.getCell(r, c).border = border; if (c > 2) ds.getCell(r, c).alignment = { horizontal: 'center' }; }
    r++;
  });
  r += 1;
  ds.getCell(r, 2).value = 'Defects by severity'; ds.getCell(r, 2).font = { bold: true, size: 12, color: { argb: NAVY } }; r++;
  m.bySeverity.forEach(([k, v]) => {
    ds.getCell(r, 2).value = k; ds.getCell(r, 3).value = { formula: `COUNTIF('Defect Log'!C2:C100,B${r})`, result: v };
    ds.getCell(r, 2).border = border; ds.getCell(r, 3).border = border; ds.getCell(r, 3).alignment = { horizontal: 'center' }; r++;
  });

  // Test Cases
  const ws = wb.addWorksheet('Test Cases', { views: [{ state: 'frozen', ySplit: 1, xSplit: 1 }] });
  ws.columns = [
    { header: 'ID', width: 9 }, { header: 'Requirement', width: 12 }, { header: 'Module', width: 14 }, { header: 'Title', width: 40 },
    { header: 'Type', width: 14 }, { header: 'Priority', width: 10 }, { header: 'Preconditions', width: 24 }, { header: 'Test Data', width: 30 },
    { header: 'Steps', width: 44 }, { header: 'Expected Result', width: 40 }, { header: 'Actual Result', width: 44 }, { header: 'Status', width: 10 },
    { header: 'Defect', width: 10 }, { header: 'Evidence', width: 30 },
  ];
  head(ws.getRow(1));
  cases.forEach((c) => ws.addRow([c.id, c.req, c.module, c.title, c.type, c.priority, c.pre, c.data, c.steps, c.expected, c.actual, c.status, c.defect, c.evidence]));
  ws.eachRow((row, n) => {
    row.eachCell((cell) => { cell.border = border; if (n > 1) cell.alignment = { vertical: 'top', wrapText: true }; });
    if (n > 1) {
      const s = row.getCell(12);
      s.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fills[s.value] } };
      s.font = { bold: true, color: { argb: fonts[s.value] } };
      s.alignment = { vertical: 'top', horizontal: 'center' };
    }
  });
  ws.autoFilter = { from: 'A1', to: 'N1' };
  ws.getCell('L1').dataValidation = undefined;
  for (let i = 2; i <= cases.length + 1; i++) ws.getCell(`L${i}`).dataValidation = { type: 'list', allowBlank: false, formulae: ['"Pass,Fail,Not Run,Blocked"'] };

  // Traceability
  const tr = wb.addWorksheet('Traceability', { views: [{ state: 'frozen', ySplit: 1 }] });
  tr.columns = [{ header: 'Req ID', width: 9 }, { header: 'Area', width: 24 }, { header: 'Requirement', width: 70 }, { header: 'Priority', width: 10 }, { header: 'Test Cases', width: 60 }, { header: '# Cases', width: 9 }, { header: 'Pass', width: 8 }, { header: 'Fail', width: 8 }, { header: 'Not Run', width: 9 }, { header: 'Coverage', width: 11 }];
  head(tr.getRow(1));
  requirements.forEach((q, i) => {
    const cs = cases.filter((c) => c.req === q[0]);
    const row = tr.addRow([q[0], q[1], q[2], q[3], cs.map((c) => c.id).join(', '), cs.length, cs.filter((c) => c.status === 'Pass').length, cs.filter((c) => c.status === 'Fail').length, cs.filter((c) => c.status === 'Not Run').length, cs.length ? 'Covered' : 'GAP']);
    row.eachCell((c) => { c.border = border; c.alignment = { vertical: 'top', wrapText: true }; });
    const cov = row.getCell(10); cov.font = { bold: true, color: { argb: cs.length ? 'FF006100' : 'FF9C0006' } };
  });

  // Defect log
  const dl = wb.addWorksheet('Defect Log', { views: [{ state: 'frozen', ySplit: 1 }] });
  dl.columns = [{ header: 'ID', width: 9 }, { header: 'Title', width: 56 }, { header: 'Severity', width: 10 }, { header: 'Priority', width: 9 }, { header: 'Module', width: 12 }, { header: 'Origin', width: 10 }, { header: 'Status', width: 8 }, { header: 'Failed Test Cases', width: 20 }, { header: 'Actual Result', width: 60 }, { header: 'Evidence', width: 32 }];
  head(dl.getRow(1));
  defects.forEach((d) => dl.addRow([d.id, d.title, d.severity, d.priority, d.module, d.kind, 'Open', d.tcs, d.actual, d.evidence]));
  const sev = { Critical: 'FFFFC7CE', Major: 'FFFFEB9C', Minor: 'FFDDEBF7' };
  dl.eachRow((row, n) => { row.eachCell((c) => { c.border = border; if (n > 1) c.alignment = { vertical: 'top', wrapText: true }; }); if (n > 1) row.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: sev[row.getCell(3).value] } }; });

  await wb.xlsx.writeFile(path.join(SUITE, 'SauceDemo-Test-Suite.xlsx'));
  console.log(JSON.stringify(m, null, 2));
})();
