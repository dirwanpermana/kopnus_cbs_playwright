// import { Page } from '@playwright/test';
// import BasePage from './page.js';

// export default class SearchMenu extends BasePage {
//     constructor(page: Page) {
//         super(page);
//     }

//     public async navigateMenu(menuPath: string): Promise<void> {
//         const menuItems = menuPath.split('>').map((item) => item.trim());

//         for (let i = 0; i < menuItems.length; i++) {
//             const menu = menuItems[i];
//             const isLast = i === menuItems.length - 1;

//             const menuElement = this.page.locator('span', { hasText: new RegExp(`^${this.escapeRegExp(menu)}$`) });
//             await menuElement.first().waitFor({ state: 'attached', timeout: 10_000 });

//             const clicked = await this.page.evaluate((text) => {
//                 const spans = Array.from(document.querySelectorAll('span'));
//                 const target = spans.find((s) => s.textContent?.trim() === text);
//                 if (!target) return false;
//                 const rect = target.getBoundingClientRect();
//                 if (rect.width === 0 || rect.height === 0) return false;
//                 (target as HTMLElement).click();
//                 return true;
//             }, menu);

//             console.log(`   ${clicked ? '✓' : '⚠'} Klik menu "${menu}"`);

//             if (!isLast) {
//                 const nextMenu = menuItems[i + 1];
//                 await this.page
//                     .locator('span', { hasText: new RegExp(`^${this.escapeRegExp(nextMenu)}$`) })
//                     .first()
//                     .waitFor({ state: 'visible', timeout: 5000 })
//                     .catch(() => console.log(`   Submenu "${nextMenu}" belum visible, lanjut...`));
//             }

//             await this.page.waitForTimeout(300);
//         }

//         console.log(`navigateMenu selesai untuk: ${menuPath}`);
//     }
// }

import { Page } from '@playwright/test';
import BasePage from './page.js';

export default class SearchMenu extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public async navigateMenu(menuPath: string, expectedHeading?: string): Promise<void> {
    const menuItems = menuPath.split('>').map((item) => item.trim());
    const sidebarSelector = 'aside.sidebar';

    for (let i = 0; i < menuItems.length; i++) {
      const menu = menuItems[i];
      const isLast = i === menuItems.length - 1;

      // Target 'a, button' (elemen clickable asli), hasText = substring match
      // aman terhadap teks icon yang nyelip (mis. "circle Tipe Dokumen")
      const menuElement = this.page
        .locator(`${sidebarSelector} a, ${sidebarSelector} button`)
        .filter({ hasText: menu });

      await menuElement.first().waitFor({ state: 'visible', timeout: 10_000 });

      const clicked = await this.page.evaluate(
        ({ text, scopeSelector }) => {
          const scope = document.querySelector(scopeSelector);
          if (!scope) return false;

          const candidates = Array.from(scope.querySelectorAll('a, button'));

          const target = candidates.find((el) => {
            const clone = el.cloneNode(true) as HTMLElement;
            // Buang icon material-icons biar gak ikut dihitung teksnya
            clone.querySelectorAll('.material-icons').forEach((icon) => icon.remove());
            return clone.textContent?.trim() === text;
          });

          if (!target) return false;
          const rect = target.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return false;
          (target as HTMLElement).click();
          return true;
        },
        { text: menu, scopeSelector: sidebarSelector }
      );

      console.log(`   ${clicked ? '✓' : '⚠'} Klik menu "${menu}"`);

      if (!isLast) {
        const nextMenu = menuItems[i + 1];
        await this.page
          .locator(`${sidebarSelector} a, ${sidebarSelector} button`)
          .filter({ hasText: nextMenu })
          .first()
          .waitFor({ state: 'visible', timeout: 5000 })
          .catch(() => console.log(`   Submenu "${nextMenu}" belum visible, lanjut...`));
      }

      await this.page.waitForTimeout(300);
    }

    console.log(`navigateMenu selesai untuk: ${menuPath}`);

    if (expectedHeading) {
      await this.page
        .getByRole('heading', { name: expectedHeading, exact: true })
        .waitFor({ state: 'visible', timeout: 10_000 });
      console.log(`   ✓ Halaman "${expectedHeading}" berhasil dimuat`);
    }
  }
}