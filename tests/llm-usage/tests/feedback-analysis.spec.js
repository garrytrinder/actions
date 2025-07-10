// playwright/test-feedback-analysis.spec.js
// Test: Feedback analysis UI end-to-end

const { test, expect } = require('@playwright/test');

test.describe('Session Evaluations Analysis', () => {
  test('loads feedback, analyzes, and displays pills', async ({ page, baseURL }) => {
    test.slow();
    // 1. Load the webpage using its baseUrl
    await page.goto(baseURL);

    // 2. Wait for feedback to load (wait for at least one evaluation item)
    await page.waitForSelector('.evaluation-item', { timeout: 10000 });

    // 3. When feedback has loaded, press the Analyze button
    await page.waitForSelector('#analyze-button', { timeout: 20000 });
    const analyzeButton = await page.$('#analyze-button');
    await analyzeButton.click();

    // 4. Wait for button text to eventually become "Analysis Complete"
    // Poll the button text until it matches, to handle intermediate states
    const maxWait = 60000; // Maximum wait time of 60 seconds
    const pollInterval = 10000; // Poll every 10 seconds
    const start = Date.now();
    let found = false;
    while (Date.now() - start < maxWait) {
      const text = await analyzeButton.innerText();
      if (/Analysis Complete/i.test(text)) {
        found = true;
        break;
      }
      await new Promise(r => setTimeout(r, pollInterval));
    }
    expect(found).toBeTruthy();

    // 5. Verify that all feedbacks contain an evaluation pill that contains a value
    const evaluationItems = await page.$$('.evaluation-item');
    for (const item of evaluationItems) {
      const pill = await item.$('.evaluation-pill');
      const pillText = await pill?.innerText();
      expect(pillText && pillText.trim().length).toBeGreaterThan(0);
    }
  });
});
