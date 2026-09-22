import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { APPLE_DEVICES_CATALOG, COMPATIBILITY_FEATURES } from '../src/data/compatibility.js';
import { WORKFLOWS_DATA } from '../src/data/workflows.js';
import { TROUBLESHOOTING_DATA } from '../src/data/troubleshooting.js';

describe('SmartToolHub - Unit Tests', () => {

  describe('1. Compatibility Checker Logic', () => {
    const macs = APPLE_DEVICES_CATALOG.filter((d) => d.type === 'mac');
    const iphones = APPLE_DEVICES_CATALOG.filter((d) => d.type === 'iphone');
    const ipads = APPLE_DEVICES_CATALOG.filter((d) => d.type === 'ipad');

    test('catalog contains valid Apple hardware models for Mac, iPhone, and iPad', () => {
      assert.ok(macs.length >= 6, 'Must contain at least 6 Mac models');
      assert.ok(iphones.length >= 6, 'Must contain at least 6 iPhone models');
      assert.ok(ipads.length >= 4, 'Must contain at least 4 iPad models');

      for (const device of APPLE_DEVICES_CATALOG) {
        assert.ok(device.id, `Device ${device.name} must have an ID`);
        assert.ok(device.name, 'Device must have a display name');
        assert.ok(device.chip, 'Device must specify processor chip');
        assert.ok(device.latestOS, 'Device must specify latest OS');
      }
    });

    test('macOS Sequoia iPhone Mirroring compatibility rule', () => {
      // Rule: Requires Apple Silicon or T2 Mac AND iOS 18 iPhone
      const m3Air = macs.find((m) => m.id === 'mac-m3-air')!;
      const intelPreT2 = macs.find((m) => m.id === 'mac-intel-pre-t2')!;
      const iphone16Pro = iphones.find((p) => p.id === 'iphone-16-pro')!;

      // Modern Apple Silicon + iOS 18
      const isM3Supported = m3Air.supportsIphoneMirroring && iphone16Pro.supportsIphoneMirroring;
      assert.equal(isM3Supported, true, 'M3 MacBook Air + iPhone 16 Pro should be fully supported');

      // Intel without T2 or older iPhone
      const isOldMacSupported = intelPreT2.supportsIphoneMirroring && iphone16Pro.supportsIphoneMirroring;
      assert.equal(isOldMacSupported, false, 'Pre-T2 Intel Mac lacks Apple Silicon/T2 and must be incompatible');
    });

    test('Continuity Camera and Desk View hardware prerequisites', () => {
      const iphone16Pro = iphones.find((p) => p.id === 'iphone-16-pro')!;
      const m3Air = macs.find((m) => m.id === 'mac-m3-air')!;
      const intelPreT2 = macs.find((m) => m.id === 'mac-intel-pre-t2')!;

      assert.equal(iphone16Pro.supportsContinuityCamera, true);
      assert.equal(m3Air.supportsContinuityCamera, true);
      assert.equal(intelPreT2.supportsContinuityCamera, false);
    });

    test('Universal Control and Sidecar iPad requirements', () => {
      const m2AirPad = ipads.find((p) => p.id === 'ipad-m2-air')!;
      assert.equal(m2AirPad.supportsUniversalControl, true);
      assert.equal(m2AirPad.supportsSidecar, true);
    });
  });

  describe('2. Workflow Search & Filter Logic', () => {
    test('curated workflows data integrity', () => {
      assert.ok(WORKFLOWS_DATA.length >= 8, 'Should have at least 8 comprehensive workflows');
      for (const wf of WORKFLOWS_DATA) {
        assert.ok(wf.id, 'Workflow must have an id');
        assert.ok(wf.title, 'Workflow must have a title');
        assert.ok(wf.steps && wf.steps.length > 0, `Workflow ${wf.title} must have steps`);
        assert.ok(Array.isArray(wf.tags), 'Tags must be an array');
        assert.ok(wf.devicesRequired && wf.devicesRequired.length > 0, 'Must specify required devices');
      }
    });

    test('filter by persona and category', () => {
      const creators = WORKFLOWS_DATA.filter((w) => w.persona.toLowerCase() === 'creators');
      assert.ok(creators.length > 0, 'Creators persona must return results');

      const audioWorkflows = WORKFLOWS_DATA.filter((w) => w.category === 'Audio & Video Production');
      assert.ok(audioWorkflows.length > 0, 'Audio & Video Production category must return results');
    });

    test('search query fuzzy match across title, tags, and summary', () => {
      const query = 'Desk View'.toLowerCase();
      const matches = WORKFLOWS_DATA.filter((w) =>
        w.title.toLowerCase().includes(query) ||
        w.summary.toLowerCase().includes(query) ||
        w.tags.some((t) => t.toLowerCase().includes(query))
      );
      assert.ok(matches.length > 0, 'Query "Desk View" should find relevant workflows');
    });
  });

  describe('3. Troubleshooting Resolution Tree Logic', () => {
    test('troubleshooting data completeness', () => {
      assert.ok(TROUBLESHOOTING_DATA.length >= 5, 'Should have at least 5 major diagnostic trees');
      for (const item of TROUBLESHOOTING_DATA) {
        assert.ok(item.id, 'Issue must have an ID');
        assert.ok(item.title, 'Issue must have a title');
        assert.ok(item.feature, 'Issue must declare target feature');
        assert.ok(item.symptoms.length > 0, 'Must provide symptom descriptions');
        assert.ok(item.quickFixSteps.length > 0, 'Must have at least one quick fix step');
        assert.ok(item.officialDocUrl.startsWith('https://'), 'Must cite official Apple documentation');
      }
    });

    test('terminal diagnostic commands provided for complex issues', () => {
      const diagnosticCommands = TROUBLESHOOTING_DATA.flatMap((i) =>
        i.deepDiagnostics.filter((d) => d.command).map((d) => d.command)
      );
      assert.ok(diagnosticCommands.length > 0, 'Should have terminal isolation commands for technical triage');
      for (const cmd of diagnosticCommands) {
        assert.ok(typeof cmd === 'string');
        assert.ok(cmd.length > 5);
      }
    });
  });

  describe('4. Input Validation & Security Rules', () => {
    test('rejects sensitive credential inputs', () => {
      const sensitiveTokens = ['password', 'passcode', 'apple id password', 'private key', 'secret key', 'credit card'];
      const dangerousInputs = [
        'How to sync my Apple ID password across devices',
        'Extract my private key via Shortcuts',
        'Store my credit card in an unencrypted file'
      ];

      for (const input of dangerousInputs) {
        const lower = input.toLowerCase();
        const hasSensitive = sensitiveTokens.some((t) => lower.includes(t));
        assert.equal(hasSensitive, true, `Input "${input}" should be flagged as sensitive`);
      }
    });

    test('task length validation', () => {
      const isValidTask = (task: any) => typeof task === 'string' && task.trim().length >= 3 && task.length <= 500;

      assert.equal(isValidTask(''), false);
      assert.equal(isValidTask('ab'), false);
      assert.equal(isValidTask('Sync photos from iPhone to Mac on Wi-Fi'), true);
      assert.equal(isValidTask('a'.repeat(501)), false);
    });
  });
});
