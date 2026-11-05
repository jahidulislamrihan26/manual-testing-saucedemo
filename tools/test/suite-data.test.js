// Consistency tests for the manual test suite's own data (run with: npm test inside tools/, or node --test tools/test/).
// A test suite that contradicts itself (a failed case with no defect, a defect pointing at a case that does not exist)
// is worse than a short one, so the data is checked like code.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { requirements, cases, defects } = require('../suite-data');

const ids = (list) => list.map((x) => x.id);
const reqIds = new Set(requirements.map((r) => r[0]));
const defectIds = new Set(ids(defects));
const caseIds = new Set(ids(cases));
const tcList = (text) => String(text).match(/TC-\d{3}/g) || [];

test('case ids are unique and numbered TC-001 upwards without gaps', () => {
  assert.equal(caseIds.size, cases.length, 'duplicate case id');
  cases.forEach((c, i) => assert.equal(c.id, `TC-${String(i + 1).padStart(3, '0')}`));
});
test('defect ids are unique and numbered BUG-001 upwards without gaps', () => {
  assert.equal(defectIds.size, defects.length, 'duplicate defect id');
  defects.forEach((d, i) => assert.equal(d.id, `BUG-${String(i + 1).padStart(3, '0')}`));
});
test('every case belongs to a requirement that exists', () => {
  for (const c of cases) assert.ok(reqIds.has(c.req), `${c.id} points at unknown ${c.req}`);
});
test('every requirement has at least one case (no untested requirement)', () => {
  for (const r of reqIds) assert.ok(cases.some((c) => c.req === r), `${r} has no test case`);
});
test('every status is Pass, Fail or Not Run', () => {
  for (const c of cases) assert.ok(['Pass', 'Fail', 'Not Run'].includes(c.status), `${c.id}: ${c.status}`);
});
test('every failed case names a defect that exists', () => {
  for (const c of cases.filter((x) => x.status === 'Fail')) {
    assert.ok(c.defect, `${c.id} failed but has no defect`);
    for (const d of String(c.defect).split(/[,\s]+/).filter(Boolean)) assert.ok(defectIds.has(d), `${c.id} names unknown ${d}`);
  }
});
test('only failed cases name a defect', () => {
  for (const c of cases.filter((x) => x.status !== 'Fail')) assert.ok(!c.defect, `${c.id} is ${c.status} but names ${c.defect}`);
});
test('every defect lists failed cases that exist and that name it back', () => {
  for (const d of defects) {
    const listed = tcList(d.tcs);
    if (/none/i.test(d.tcs) && !listed.length) continue;
    assert.ok(listed.length, `${d.id} lists no test case`);
    for (const t of listed) {
      assert.ok(caseIds.has(t), `${d.id} lists unknown ${t}`);
      assert.match(String(cases.find((c) => c.id === t).defect), new RegExp(d.id), `${t} does not name ${d.id} back`);
    }
  }
});
test('every defect has steps, expected and actual results, a known severity and an origin', () => {
  for (const d of defects) {
    for (const f of ['title', 'steps', 'expected', 'actual']) assert.ok(String(d[f] || '').trim(), `${d.id} has no ${f}`);
    assert.ok(['Critical', 'Major', 'Minor'].includes(d.severity), `${d.id}: ${d.severity}`);
    assert.ok(['Genuine', 'Seeded'].includes(d.kind), `${d.id}: ${d.kind}`);
  }
});
test('every evidence file named by a case or defect exists in evidence/', () => {
  const missing = [];
  for (const x of [...cases, ...defects]) if (x.evidence && x.evidence.endsWith('.png') && !fs.existsSync(path.join(__dirname, '..', '..', 'evidence', x.evidence))) missing.push(`${x.id}: ${x.evidence}`);
  assert.deepEqual(missing, []);
});

// check-links.js is run as a black box in a throw-away folder that mimics the repository layout.
function linkCheck(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'links-'));
  fs.mkdirSync(path.join(dir, 'tools'));
  fs.copyFileSync(path.join(__dirname, '..', 'check-links.js'), path.join(dir, 'tools', 'check-links.js'));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  }
  const r = spawnSync(process.execPath, [path.join(dir, 'tools', 'check-links.js')], { encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true, force: true });
  return r;
}
test('check-links: passes when links exist, fails and names a broken one', () => {
  assert.equal(linkCheck({ 'README.md': '[a](docs/a.md)', 'docs/a.md': 'x' }).status, 0);
  const bad = linkCheck({ 'README.md': '[gone](docs/missing.md)' });
  assert.equal(bad.status, 1);
  assert.match(bad.stdout, /docs\/missing\.md/);
});
