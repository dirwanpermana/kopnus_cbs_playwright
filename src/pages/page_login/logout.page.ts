// import { $ } from '@wdio/globals';
// import Page from './page.js';

// class LogoutPage extends Page {
//     public get usernameLogout() {
//         return $('#cbs-user-name');
//     }
//     public get pilihLogout(){
//         return $('a=Keluar');
//     }
//     public get halLogin(){
//         return $('h3=Sign in to your Account');
//     }

//     async logout() {
//         await this.usernameLogout.click();
//         await browser.pause(500);
//         await this.pilihLogout.click();
//         await browser.pause(1000);
//         await expect(this.halLogin).toBeDisplayed();
//         await expect(this.halLogin).toHaveText('Sign in to your Account');
//     }

// }

// export default new LogoutPage();