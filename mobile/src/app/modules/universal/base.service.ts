import { Injectable, Injector } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Platform } from '@ionic/angular';

import { AppConstant } from './app-constant';
import { DbService } from './db/db-base.service';
import { SchemaService } from './db/schema.service';
import { AppSettingService } from './app-setting.service';
import { AppInjector } from './app-injector';
import { HelperService } from './helper.service';
import { LocalizationService } from './localization.service';
import { DbWebService } from './db/db-web.service';
import { NgxPubSubService } from 'src/app/modules/universal/pub-sub';
import { CustomerSettingService } from '../customer/customer-setting.service';
import { DbSqlService } from './db/db-sql.service';
@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected http: HttpClient;
  protected platform: Platform;
  protected dbService: DbService;
  protected schemaSvc: SchemaService;
  protected appSettingSvc: AppSettingService;
  protected customerSettingSvc: CustomerSettingService;
  protected helperSvc: HelperService;
  protected localizationSvc: LocalizationService;
  protected pubsubSvc: NgxPubSubService;

  constructor() {
    const injector = AppInjector.getInjector();

    this.http = injector.get(HttpClient);
    this.platform = injector.get(Platform);
    this.schemaSvc = injector.get(SchemaService);
    this.appSettingSvc = injector.get(AppSettingService);
    this.customerSettingSvc = injector.get(CustomerSettingService);

    this.helperSvc = injector.get(HelperService);
    this.localizationSvc = injector.get(LocalizationService);
    this.pubsubSvc = injector.get(NgxPubSubService);
    // this.dbService = injector.get(DbWebService);

      // if (this.platform.is('capacitor')) {
      //   this.dbService = injector.get(DbSqlService);
      // } else {
      //   this.dbService = injector.get(DbWebService);
      // }

      this.dbService = injector.get(DbWebService);
  }

  protected getData<T>(
    url: string,
    body?: any,
    errorHandler?: any
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      let headers: any = await this.prepareHeaders();
      body = body || {};

      url = `${AppConstant.BASE_API_URL + url}`;
      for (let prop in body) {
        if (body.hasOwnProperty(prop) && body[prop]) {
          if (url.includes('?')) {
            url += '&';
          } else {
            url += '?';
          }
          url += `${prop}=${body[prop]}`;
        }
      }
      const request = this.http.get<ApiResponse>(url, {
        headers: headers,
      });
      request.subscribe(
        (result) => {
          if(result.StatusCode !== HttpStatusCode.Ok) {
            reject(result.Exception);
            return;
          }

          const d = this._toCamelCase(result.Data);
          resolve(<T>d);
        },
        async (error) => {
          // await this.handleError(error, errorHandler, request, resolve, reject);
        }
      );
    });
  }

  protected postData<T>(args: HttpParams): Promise<T> {
    return new Promise(async (resolve, reject) => {
      let headers: HttpHeaders = await this.prepareHeaders(args);

      let newUrl;
      if (!args.overrideUrl) {
        newUrl = `${AppConstant.BASE_API_URL + args.url}`;
      } else {
        newUrl = args.url;
      }

      args.url = newUrl;

      //add to queue
      let body = args.body;
      this.http
        .post<ApiResponse>(args.url, body, {
          headers: headers,
        })
        .subscribe(
          (result) => {
            if(result.StatusCode !== HttpStatusCode.Ok) {
              reject(result.Exception);
              return;
            }
  
            const d = this._toCamelCase(result.Data);
            resolve(<T>d);
          },
          (error) => {
            this.handleError(error, args);
            if (args.errorCallback) {
              resolve(null as any);
            } else {
              reject(error);
            }
          }
        );
    });
  }

  protected async handleError(e: HttpErrorResponse, args: HttpParams) {
    if (AppConstant.DEBUG) {
      console.log('BaseService: handleError', e);
    }
    switch (e.status) {
      // case 401:
      //     const u = await this.userSettingSvc.getCurrentUser();
      //     if(u) {
      //         //TODO: check for token expiration...
      //         //kickout...
      //         this.pubsubSvc.publishEvent(UserConstant.EVENT_USER_LOGGEDOUT, { clearCache: true, displayLoginDialog: true });
      //     }
      // break;
      default:
        if (!args.errorCallback) {
          let msg;
          //the error might be thrown by e.g a plugin wasn't install properly. In that case text() will not be available
          if (e.message) {
            msg = e.message;
          } else {
            msg = e.error.toString();
          }
          // setTimeout(async () => {
          //     await this.helperSvc.alert(msg);
          // });
        } else {
          args.errorCallback(e, args);
        }
        break;
    }
  }

  // private async prepareHeaders(args: HttpParams) {
  //   let headers = new HttpHeaders();
  //   if (!args.ignoreContentType) {
  //     headers = headers.append(
  //       'Content-Type',
  //       'application/json;charset=utf-8'
  //     );
  //   }

  //   // const token = await this.userSettingSvc.getAccessToken();
  //   // if(token) {
  //   //     headers = headers.append('Authorization', `Bearer ${token}`);
  //   // }

  //   // if (args.httpHeaders) {
  //   //   args.httpHeaders.keys().forEach((k) => {
  //   //     headers = headers.append(k, args.httpHeaders.get(k) as any);
  //   //   });
  //   // }
  //   return headers;
  // }

  async prepareHeaders(ignoreContentType?) {
    let headers = new HttpHeaders();
    if (!ignoreContentType) {
      headers = headers.append(
        'Content-Type',
        'application/json;charset=utf-8'
      );
    }
    let ce = await this.customerSettingSvc.getCurrentCustomerEmail();
    if (ce) {
      if (ce.includes('@')) {
        //its an email and user is loggedin
        headers = headers.append('email', ce);
      } else {
        //its a guest
        headers = headers.append('token', ce);
      }
    }
    let cp = await this.customerSettingSvc.getCurrentCustomerPassword();
    if (cp) {
      headers = headers.append('password', cp);
    }
    let workingLanguage = await this.appSettingSvc.getWorkingLanguage();
    if (workingLanguage) {
      headers = headers.append('workingLanguage', workingLanguage);
    }
    return headers;
  }

  private _toCamelCase(o) {
    var newO, origKey, newKey, value
    if (o instanceof Array) {
      return o.map((value) => {
          if (typeof value === "object") {
            value = this._toCamelCase(value)
          }
          return value
      })
    } else {
      newO = {}
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString()
          value = o[origKey]
          if (value instanceof Array || (value !== null && value.constructor === Object)) {
            value = this._toCamelCase(value)
          }
          newO[newKey] = value
        }
      }
    }
    return newO;
  }
}

export class HttpParams {
  url: any;
  body?: any;
  errorCallback?;
  ignoreContentType?: boolean;
  overrideUrl?: boolean;
  httpHeaders?: HttpHeaders;
}

export interface ApiResponse {
  StatusCode: number
  Message: any
  Data: any
  Exception: any
}