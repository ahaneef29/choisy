import { Component, Inject, Renderer2 } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { AppSettingService } from './modules/universal/app-setting.service';
import { NgxPubSubService } from './modules/universal/pub-sub';
import { HelperService } from './modules/universal/helper.service';
import { LocalizationService } from './modules/universal/localization.service';
import { AppConstant } from './modules/universal/app-constant';
import { DOCUMENT } from '@angular/common';
import { LanguagePage } from './modules/language/language.page';
import { CustomerSettingService } from './modules/customer/customer-setting.service';
import { CustomerService } from './modules/customer/customer.service';
import { CustomerRoleSystemName, ICustomer } from './modules/customer/customer.model';
import { CustomerConstant } from './modules/customer/customer-constant';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  existingRouteUrl;
  workingLanguage;
  currentCustomer: any;

  constructor(
    private router: Router,
    private platform: Platform,
    private appSettingSvc: AppSettingService,
    private pubsubSvc: NgxPubSubService,
    private customerSettingSvc: CustomerSettingService,
    private customerSvc: CustomerService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private modalCtrl: ModalController,
    private localizationSvc: LocalizationService, private helperSvc: HelperService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.router.events.subscribe(async (val) => {
      if (val instanceof NavigationStart) {
        if (val.url.includes('/resetPassword')) {
          const token = val.url.split('?token=')[1];
          if (!token) {
            return;
          }

          //check for token expiration
          //TODO:

          //redirect to change password
          // this.pubsubSvc.publishEvent(
          //   UserConstant.EVENT_USER_DISPLAY_AUTH_MODAL,
          //   {
          //     resetPasswordToken: token,
          //     viewStep: AuthenticationOptionsViewStep.ResetPassword,
          //   }
          // );
        } else {
          const urls = val.url.split('/').filter((u) => u.length);
          if (urls.length) {
            this.existingRouteUrl = val.url;
          }
        }
      }
    });
    this._subscribeToEvents();
  }

  private async _subscribeToEvents() {
    this.pubsubSvc.subscribe(AppConstant.EVENT_DB_INITIALIZED, async () => {
      if (AppConstant.DEBUG) {
        console.log('Event received: EVENT_DB_INITIALIZED');
      }

      await this._setDefaults();
    });

    // this.pubsubSvc.subscribe(
    //   UserConstant.EVENT_USER_DISPLAY_AUTH_MODAL,
    //   async (args?: { resetPasswordToken?; viewStep? }) => {
    //     if (AppConstant.DEBUG) {
    //       console.log(
    //         'Event received: EVENT_USER_DISPLAY_AUTH_MODAL: args',
    //         args
    //       );
    //     }

    //     if (!args) {
    //       args = {};
    //     }

    //     await this.userSettingSvc.displayAuthModal({
    //       resetPasswordToken: args.resetPasswordToken,
    //       viewStep: args.viewStep,
    //     });
    //   }
    // );

    this.pubsubSvc.subscribe(
      AppConstant.EVENT_LANGUAGE_CHANGED,
      async (params) => {
        if (AppConstant.DEBUG) {
          console.log('EVENT_LANGUAGE_CHANGED', params);
        }
        const { wkLangauge, reload, isRtl } = params;
        if (reload) {
          // SplashScreen.show();

          // make sure we are in root page before reoloading, just incase if user tries to change the language from inner page
          await this._navigateTo('/home', true);
          setTimeout(() => {
            this.document.location.reload();
          });
        } else {
          this.document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
          this.workingLanguage = wkLangauge;

          setTimeout(() => {
            this.renderer.addClass(document.body, wkLangauge);
          });
        }
      }
    );

    // this.pubsubSvc.subscribe(
    //   UserConstant.EVENT_USER_PROFILE_UPDATED,
    //   async (user: IUserProfile) => {
    //     if (AppConstant.DEBUG) {
    //       console.log('AppComponent: EVENT_USER_PROFILE_UPDATED: params', user);
    //     }

    //     const profile = await this.userSettingSvc.getUserProfileLocal();
    //     this.currentUser = profile;
    //   }
    // );

    this.pubsubSvc.subscribe(CustomerConstant.EVENT_USER_LOGGEDIN_CLICKED
      , async (params: { username; password; type }) => {
        if (AppConstant.DEBUG) {
          console.log('AppComponent: EVENT_USER_LOGGEDIN_CLICKED: params', params);
        }

        const profile = await this.customerSvc.login(params.type, {
          username: params.username,
          password: params.password,
        });

        if (!profile) {
          return;
        }

        this.pubsubSvc.publishEvent(CustomerConstant.EVENT_CUSTOMER_LOGGEDIN, {
          user: profile,
          redirectToHome: true,
          displayWelcomeMessage: true
        });
      }
    );

    this.pubsubSvc.subscribe(CustomerConstant.EVENT_CUSTOMER_LOGGEDIN
      , async (params: { user: ICustomer; redirectToHome?: boolean; displayWelcomeMessage?: boolean; }) => {
        if (AppConstant.DEBUG) {
          console.log('AppComponent: EVENT_USER_LOGGEDIN: params', params);
        }

        this.currentCustomer = params.user;

        if (params.displayWelcomeMessage) {
          this.localizationSvc.getResource('user.login.logged_in')
          .then(async (msg) => {
            await this.helperSvc.presentToast(msg);
          });
        }

        if (params.redirectToHome) {
          await this._navigateTo('/home', null, true);
        }
      }
    );

    // this.pubsubSvc.subscribe(
    //   UserConstant.EVENT_USER_LOGGEDOUT,
    //   async (args: { clearCache; displayLoginDialog; displayMessage }) => {
    //     if (AppConstant.DEBUG) {
    //       console.log('AppComponent: EVENT_USER_LOGGEDOUT: args', args);
    //     }
    //     this.currentUser = null;

    //     //redirect to login...
    //     await this._navigateTo('/home', null, true);

    //     if (args?.clearCache) {
    //       await this._logout();
    //     }

    //     if (args?.displayMessage) {
    //       const msg = await this.localizationSvc.getResource(
    //         'user.login.logged_out'
    //       );
    //       await this.helperSvc.presentToast(msg);
    //     }

    //     if (args?.displayLoginDialog) {
    //       const canActivate = await this.userSettingSvc.canActivate();
    //       if (!canActivate) {
    //         return;
    //       }
    //     }
    //   }
    // );

    // this.pubsubSvc.subscribe(
    //   UserConstant.EVENT_USER_FORGOT_PASSWORD,
    //   async (params: { username }) => {
    //     if (AppConstant.DEBUG) {
    //       console.log(
    //         'AppComponent: EVENT_USER_FORGOT_PASSWORD: params',
    //         params
    //       );
    //     }

    //     const response = await this.userSvc.forgotPassword({
    //       username: params.username,
    //     });

    //     const msg = await this.localizationSvc.getResource(
    //       'user.forgot_password_sent'
    //     );
    //     await this.helperSvc.presentToast(msg);
    //   }
    // );

    // this.pubsubSvc.subscribe(
    //   UserConstant.EVENT_USER_RESET_PASSWORD,
    //   async (params: { resetPasswordToken; newPassword }) => {
    //     if (AppConstant.DEBUG) {
    //       console.log(
    //         'AppComponent: EVENT_USER_RESET_PASSWORD: params',
    //         params
    //       );
    //     }

    //     try {
    //       const result = await this.userSvc.resetPassword({
    //         resetPasswordToken: params.resetPasswordToken,
    //         newPassword: params.newPassword,
    //       });

    //       if (result) {
    //         await this.helperSvc.presentToastGenericSuccess();
    //       } else {
    //         //TODO: need to update the message
    //         await this.helperSvc.presentToastGenericError();
    //       }
    //     } catch (e) {
    //       await this.helperSvc.presentToastGenericError();
    //     }
    //   }
    // );

    // this.pubsubSvc.subscribe(AppConstant.EVENT_NAVIGATE_TO, async (params) => {
    //   await this._navigateTo(params.url);
    // });
  }

  private async _setDefaults() {
    //run in background
    this.customerSettingSvc.getCurrentCustomerEmail()
    .then(async (ce) => {
      if (ce) {
        this.currentCustomer = await this.customerSettingSvc.getCustomerLocal(ce);
      }

      if (!this.currentCustomer) {
        this.currentCustomer = await this.customerSvc.getAndSetGuestCustomer();
      } else {
        //refresh guest always...
        const guestCustomerRole = this.currentCustomer.customerRoles
          .filter((cr) => cr.systemName == CustomerRoleSystemName.Guests);
        if (guestCustomerRole.length) {
          this.currentCustomer = await this.customerSvc.getAndSetGuestCustomer(ce);
        }
      }
  
      // notify to refresh dashboard also
      this.pubsubSvc.publishEvent(CustomerConstant.EVENT_CUSTOMER_LOGGEDIN, {
        user: this.currentCustomer,
        shouldFetchCart: false,
      });
  
      if (AppConstant.DEBUG) {
        console.log('AppComponent: initializeApp: currentUser', this.currentCustomer);
      }
    });


    // if (this.splashScreen) {
    //   this.splashScreen.hide();
    // }

    const res = await Promise.all([
      this.appSettingSvc.getWorkingLanguage(),
      this.appSettingSvc.getAppTourSkipped(),
    ]);

    let wkl = res[0];
    let appTour = res[1];

    if (!wkl) {
      const wkl = await this._openLanguageModal();

      await this.appSettingSvc.putWorkingLanguage(wkl);
      this.pubsubSvc.publishEvent(AppConstant.EVENT_LANGUAGE_CHANGED, {
        wkLangauge: wkl,
        reload: false,
        isRtl: false,
      });
    }

    const url = this.router.routerState.snapshot.url;
    const ignoreRoutes = ['privacy', 'feedback'];
    const exists = ignoreRoutes.filter((r) => url.includes(r));

    if (exists.length) {
      return;
    }

    if (!appTour) {
      this.router.navigate(['/app-tour']);
    }

    if (this.existingRouteUrl) {
      await this._navigateTo(this.existingRouteUrl);
      return;
    }
    await this._navigateTo('/home');
  }

  private async _openLanguageModal() {
    const modal = await this.modalCtrl.create({
      component: LanguagePage,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      return data;
    }
  }

  private async _navigateTo(path, args?, replaceUrl = false) {
    if (!args) {
      await this.router.navigate([path], { replaceUrl: replaceUrl });
    } else {
      await this.router.navigate([path, args], { replaceUrl: replaceUrl });
    }
  }

  // private async _configureWeb() {
  //   if (this.platform.is('capacitor')) {
  //     return;
  //   }

  //   await this.userSvc.init();
  // }

  // private async _logout() {
  //   // const resp = await this.helperSvc.presentConfirmDialog();
  //   // if(resp) {
  //   const loader = await this.helperSvc.loader;
  //   await loader.dismiss();

  //   try {
  //     await this.userSvc.logoutEverywhere();
  //   } catch (e) {
  //   } finally {
  //     await loader.dismiss();
  //   }
  //   // }
  // }
}
