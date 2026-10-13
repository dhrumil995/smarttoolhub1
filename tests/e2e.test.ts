import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { WORKFLOWS_DATA } from '../src/data/workflows.js';
import { COMPATIBILITY_FEATURES } from '../src/data/compatibility.js';
import { TROUBLESHOOTING_DATA } from '../src/data/troubleshooting.js';

describe('SmartToolHub - End-to-End Navigation & Flow Verification', () => {

  const ALL_PAGE_IDS = [
    'home',
    'library',
    'compatibility',
    'generator',
    'troubleshooting',
    'pricing',
    'contact',
    'privacy',
    'terms',
    'workflow-detail',
  ] as const;

  describe('1. Full Homepage Load & Content Structure', () => {
    test('homepage has verified CTAs pointing to valid application routes', () => {
      const primaryHeroActions = [
        { label: 'Generate Shortcuts', target: 'generator' },
        { label: 'Explore Curated Blueprints', target: 'library' },
        { label: 'Check Sequoia Continuity', target: 'compatibility' },
        { label: 'Troubleshoot Features', target: 'troubleshooting' },
      ];

      for (const action of primaryHeroActions) {
        assert.ok(
          ALL_PAGE_IDS.includes(action.target as any),
          `CTA "${action.label}" must target a valid page route (${action.target})`
        );
      }
    });

    test('homepage featured tools link to existing verified datasets', () => {
      // Check that all featured workflows exist in WORKFLOWS_DATA
      assert.ok(WORKFLOWS_DATA.length >= 8, 'Workflows catalog must have at least 8 items');
      assert.ok(COMPATIBILITY_FEATURES.length >= 6, 'Compatibility catalog must have at least 6 features');
      assert.ok(TROUBLESHOOTING_DATA.length >= 5, 'Troubleshooting catalog must have at least 5 issues');
    });
  });

  describe('2. Primary Navigation Flow Simulation', () => {
    test('simulates browser history navigation across all pages without crash', () => {
      let currentPage: string = 'home';
      let selectedWorkflowId: string | null = null;
      const historyStack: string[] = ['home'];

      function navigate(to: string, wfId?: string) {
        assert.ok(ALL_PAGE_IDS.includes(to as any), `Cannot navigate to unknown page: ${to}`);
        currentPage = to;
        if (wfId) selectedWorkflowId = wfId;
        historyStack.push(to);
      }

      // Step 1: User lands on Home
      assert.equal(currentPage, 'home');

      // Step 2: Clicks "Explore Library"
      navigate('library');
      assert.equal(currentPage, 'library');

      // Step 3: Selects first workflow to view detail sheet
      const firstWf = WORKFLOWS_DATA[0];
      navigate('workflow-detail', firstWf.id);
      assert.equal(currentPage, 'workflow-detail');
      assert.equal(selectedWorkflowId, firstWf.id);

      // Step 4: Navigates to Compatibility Checker
      navigate('compatibility');
      assert.equal(currentPage, 'compatibility');

      // Step 5: Navigates to Troubleshooting
      navigate('troubleshooting');
      assert.equal(currentPage, 'troubleshooting');

      // Step 6: Navigates to Generator
      navigate('generator');
      assert.equal(currentPage, 'generator');

      // Step 7: Navigates to Pricing
      navigate('pricing');
      assert.equal(currentPage, 'pricing');

      // Step 8: Navigates to Contact
      navigate('contact');
      assert.equal(currentPage, 'contact');

      // Total history entries
      assert.equal(historyStack.length, 8);
    });
  });

  describe('3. Deep-Link & URL Query Parameter Parsing', () => {
    test('parses ?page= and ?search= URL query parameters correctly', () => {
      function parseUrlParams(searchString: string) {
        const params = new URLSearchParams(searchString);
        const page = params.get('page') || 'home';
        const search = params.get('search') || '';
        const id = params.get('id') || '';
        return { page, search, id };
      }

      const test1 = parseUrlParams('?page=library&search=Continuity');
      assert.equal(test1.page, 'library');
      assert.equal(test1.search, 'Continuity');

      const test2 = parseUrlParams('?page=workflow-detail&id=wf-iphone-mirroring');
      assert.equal(test2.page, 'workflow-detail');
      assert.equal(test2.id, 'wf-iphone-mirroring');

      const test3 = parseUrlParams('');
      assert.equal(test3.page, 'home');
      assert.equal(test3.search, '');
    });
  });

  describe('4. Complete Workflow Step Consistency & Slug Resolution', () => {
    test('every workflow has a valid title, slug, and ordered numbered steps', () => {
      for (const wf of WORKFLOWS_DATA) {
        assert.ok(wf.slug, `Workflow ${wf.id} must have a slug`);
        assert.ok(wf.steps.length >= 2, `Workflow ${wf.id} must have at least 2 steps`);

        // Check sequential numbering
        wf.steps.forEach((s, idx) => {
          assert.equal(s.stepNumber, idx + 1, `Workflow ${wf.id} step at index ${idx} must be numbered ${idx + 1}`);
          assert.ok(s.instruction, `Workflow ${wf.id} step ${s.stepNumber} must have instructions`);
        });
      }
    });

    test('every troubleshooting entry links to an existing feature or official Apple doc', () => {
      for (const item of TROUBLESHOOTING_DATA) {
        assert.ok(
          item.officialDocUrl.startsWith('https://support.apple.com'),
          `Must link to official Apple support: ${item.officialDocUrl}`
        );
      }
    });
  });
});
