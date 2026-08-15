<!-- Jalankan Perintah Running -->
Generate gherkin syntax ke Playwright -> bdd:gen
Jalankan test dulu: npm run test
Generate report Allure: npm run allure:report
Buka report dashboard: npm run allure:open
Jalankan test dengan browser terlihat : npm run test:headed
Jalankan test by tag : npm run bdd:gen && npx playwright test --grep "@login_valid"

Jalankan Report dashboard : npm run report
Jalankan report pdf : npm run report:pdf

