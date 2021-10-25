(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "+U99":
/*!***********************************************!*\
  !*** ./src/app/services/error-interceptor.ts ***!
  \***********************************************/
/*! exports provided: ErrorInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorInterceptor", function() { return ErrorInterceptor; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _login_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./login.service */ "EFyh");
/* harmony import */ var _chat_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./chat.service */ "sjK5");
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./common.service */ "OlR4");








const TOKEN_HEADER_KEY = 'x-access-token';
class ErrorInterceptor {
    constructor(router, loginService, signalRService, CommonService) {
        this.router = router;
        this.loginService = loginService;
        this.signalRService = signalRService;
        this.CommonService = CommonService;
        this.isRefreshing = false;
        this.refreshTokenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](null);
    }
    intercept(request, next) {
        let token = this.CommonService.getData('accessToken') || 'undefined';
        if (token !== 'undefined') {
            request = this.addToken(request, token);
        }
        return next.handle(request)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(error => {
            if (error instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpErrorResponse"] && error.status === 401) {
                return this.handle401Error(request, next);
            }
            else {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["throwError"])(error);
            }
        }));
    }
    addToken(request, token) {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
        // request = request.clone({
        //   setHeaders: { Authorization: `Bearer ${token}` }
        // });
    }
    handle401Error(request, next) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            let obj = {
                userID: this.CommonService.getData('userID'),
                refreshToken: this.CommonService.getData('refreshToken')
            };
            console.log("Refresh Token Request", obj);
            return this.loginService.refreshToken(obj).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])((token) => {
                console.log("Refresh Token Response", token);
                this.isRefreshing = false;
                if (token.result === 'Success') {
                    this.CommonService.setData('accessToken', token.accessToken);
                    this.refreshTokenSubject.next(token.accessToken);
                    // return next.handle(this.addToken(request, token.accessToken));
                }
                else {
                    console.log("Else");
                    this.signalRService.removeFromGroup();
                    this.CommonService.clearStorage();
                    this.router.navigate(['/']);
                    //this.loginService.redirect();
                    //return throwError(token.message);
                }
                return next.handle(this.addToken(request, token.accessToken));
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])((err) => {
                console.log("catch Error");
                this.CommonService.clearStorage();
                this.router.navigate(['/']);
                this.isRefreshing = false;
                this.signalRService.removeFromGroup();
                this.loginService.redirect();
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["throwError"])(err);
            }));
        }
        return this.refreshTokenSubject.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["filter"])(token => token != null), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])(token => {
            console.log("Refresh Token 1", token);
            return next.handle(this.addToken(request, token));
        }));
    }
    logOut() {
        var obj = {
            customerID: this.CommonService.getData('customerID'),
            userID: this.CommonService.getData('userID'),
        };
        this.loginService.logout(obj).subscribe((res) => {
            this.signalRService.removeFromGroup();
            this.loginService.redirect();
        }, (err) => {
            console.log(err);
        });
    }
}
ErrorInterceptor.ɵfac = function ErrorInterceptor_Factory(t) { return new (t || ErrorInterceptor)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_login_service__WEBPACK_IMPORTED_MODULE_5__["LoginService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_chat_service__WEBPACK_IMPORTED_MODULE_6__["SignalRService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_common_service__WEBPACK_IMPORTED_MODULE_7__["CommonService"])); };
ErrorInterceptor.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: ErrorInterceptor, factory: ErrorInterceptor.ɵfac, providedIn: 'root' });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\Projects\ManagerApp\src\main.ts */"zUnb");


/***/ }),

/***/ "8Ek8":
/*!*****************************************!*\
  !*** ./src/app/services/login.guard.ts ***!
  \*****************************************/
/*! exports provided: LoginGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginGuard", function() { return LoginGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common.service */ "OlR4");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");



class LoginGuard {
    constructor(CommonService, router) {
        this.CommonService = CommonService;
        this.router = router;
    }
    canActivate(route, state) {
        if (this.CommonService.isAuthenticated()) {
            this.router.navigate(['/pages']);
            return false;
        }
        return true;
    }
}
LoginGuard.ɵfac = function LoginGuard_Factory(t) { return new (t || LoginGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_common_service__WEBPACK_IMPORTED_MODULE_1__["CommonService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"])); };
LoginGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: LoginGuard, factory: LoginGuard.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false,
    API_URL: 'https://nmbservice.spitfireagent.com/DialServiceAPI',
    //API_URL: 'http://localhost:62188',
    CAMPAIGN_STATS_INTERVAL: 10000
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "EFyh":
/*!*******************************************!*\
  !*** ./src/app/services/login.service.ts ***!
  \*******************************************/
/*! exports provided: LoginService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginService", function() { return LoginService; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _constants_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/constants */ "bl9C");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./common.service */ "OlR4");








class LoginService {
    constructor(http, router, CommonService) {
        this.http = http;
        this.router = router;
        this.CommonService = CommonService;
        this.headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpHeaders"]({ 'Content-Type': 'application/json' });
    }
    login(user) {
        return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/Login/LoginUser', user, { headers: this.headers }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    }
    refreshToken(data) {
        return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/Login/RefreshToken', data, { headers: this.headers }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    }
    registerClient(data) {
        return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/DialService/RegisterClient', data, { headers: this.headers }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    }
    registerSupervisor(data) {
        return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/DialService/RegisterSupervisor', data, { headers: this.headers }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    }
    getSecretQuestion(data) {
        return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/Login/GetSecretQuestion', data, { headers: this.headers }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    }
    verifySecretAnswer(data) {
        return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/Login/verifySecretAnswer', data, { headers: this.headers }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    }
    logout(data) {
        return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/Login/LogoutUser', data, { headers: this.headers }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    }
    redirect() {
        this.CommonService.clearStorage();
        this.router.navigate(['/']);
    }
    gotoNotFound() {
        this.router.navigate(['/403']);
    }
    handleError(error) {
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])(error.message || error);
    }
}
LoginService.ɵfac = function LoginService_Factory(t) { return new (t || LoginService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_common_service__WEBPACK_IMPORTED_MODULE_6__["CommonService"])); };
LoginService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({ token: LoginService, factory: LoginService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "OlR4":
/*!********************************************!*\
  !*** ./src/app/services/common.service.ts ***!
  \********************************************/
/*! exports provided: CommonService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommonService", function() { return CommonService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class CommonService {
    constructor() { }
    setData(key, val) {
        sessionStorage[key] = val;
    }
    getData(key) {
        return sessionStorage[key];
    }
    isAuthenticated() {
        return sessionStorage.userID != null;
    }
    clearStorage() {
        sessionStorage.clear();
    }
}
CommonService.ɵfac = function CommonService_Factory(t) { return new (t || CommonService)(); };
CommonService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: CommonService, factory: CommonService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");


class AppComponent {
    constructor() {
        this.title = 'SpitFire';
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 1, vars: 0, template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]], encapsulation: 2 });


/***/ }),

/***/ "Z5rb":
/*!*****************************************!*\
  !*** ./src/app/services/pages.guard.ts ***!
  \*****************************************/
/*! exports provided: PagesGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PagesGuard", function() { return PagesGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _login_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login.service */ "EFyh");
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common.service */ "OlR4");



class PagesGuard {
    constructor(loginService, CommonService) {
        this.loginService = loginService;
        this.CommonService = CommonService;
    }
    canActivate(route, state) {
        if (!this.CommonService.isAuthenticated()) {
            this.loginService.redirect();
            return false;
        }
        return true;
    }
}
PagesGuard.ɵfac = function PagesGuard_Factory(t) { return new (t || PagesGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_login_service__WEBPACK_IMPORTED_MODULE_1__["LoginService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_common_service__WEBPACK_IMPORTED_MODULE_2__["CommonService"])); };
PagesGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: PagesGuard, factory: PagesGuard.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app-routing.module */ "vY5A");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser/animations */ "R1ws");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _services_error_interceptor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/error-interceptor */ "+U99");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "fXoL");







class AppModule {
}
AppModule.ɵfac = function AppModule_Factory(t) { return new (t || AppModule)(); };
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({ providers: [
        {
            provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HTTP_INTERCEPTORS"],
            useClass: _services_error_interceptor__WEBPACK_IMPORTED_MODULE_5__["ErrorInterceptor"],
            multi: true
        },
    ], imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_1__["AppRoutingModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _app_routing_module__WEBPACK_IMPORTED_MODULE_1__["AppRoutingModule"],
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"]] }); })();


/***/ }),

/***/ "bl9C":
/*!****************************************!*\
  !*** ./src/app/constants/constants.ts ***!
  \****************************************/
/*! exports provided: API_URL, CAMPAIGN_STATS_INTERVAL, COUNTRIES */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "API_URL", function() { return API_URL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAMPAIGN_STATS_INTERVAL", function() { return CAMPAIGN_STATS_INTERVAL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COUNTRIES", function() { return COUNTRIES; });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../environments/environment */ "AytR");

const API_URL = _environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].API_URL;
const CAMPAIGN_STATS_INTERVAL = _environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].CAMPAIGN_STATS_INTERVAL;
const COUNTRIES = [
    {
        id: 1,
        name: 'Russia',
        flag: 'f/f3/Flag_of_Russia.svg',
        area: 17075200,
        population: 146989754
    },
    {
        id: 2,
        name: 'France',
        flag: 'c/c3/Flag_of_France.svg',
        area: 640679,
        population: 64979548
    },
    {
        id: 3,
        name: 'Germany',
        flag: 'b/ba/Flag_of_Germany.svg',
        area: 357114,
        population: 82114224
    },
    {
        id: 4,
        name: 'Portugal',
        flag: '5/5c/Flag_of_Portugal.svg',
        area: 92090,
        population: 10329506
    },
    {
        id: 5,
        name: 'Canada',
        flag: 'c/cf/Flag_of_Canada.svg',
        area: 9976140,
        population: 36624199
    },
    {
        id: 6,
        name: 'Vietnam',
        flag: '2/21/Flag_of_Vietnam.svg',
        area: 331212,
        population: 95540800
    },
    {
        id: 7,
        name: 'Brazil',
        flag: '0/05/Flag_of_Brazil.svg',
        area: 8515767,
        population: 209288278
    },
    {
        id: 8,
        name: 'Mexico',
        flag: 'f/fc/Flag_of_Mexico.svg',
        area: 1964375,
        population: 129163276
    },
    {
        id: 9,
        name: 'United States',
        flag: 'a/a4/Flag_of_the_United_States.svg',
        area: 9629091,
        population: 324459463
    },
    {
        id: 10,
        name: 'India',
        flag: '4/41/Flag_of_India.svg',
        area: 3287263,
        population: 1324171354
    },
    {
        id: 11,
        name: 'Indonesia',
        flag: '9/9f/Flag_of_Indonesia.svg',
        area: 1910931,
        population: 263991379
    },
    {
        id: 12,
        name: 'Tuvalu',
        flag: '3/38/Flag_of_Tuvalu.svg',
        area: 26,
        population: 11097
    },
    {
        id: 13,
        name: 'China',
        flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
        area: 9596960,
        population: 1409517397
    }
];


/***/ }),

/***/ "sjK5":
/*!******************************************!*\
  !*** ./src/app/services/chat.service.ts ***!
  \******************************************/
/*! exports provided: SignalRService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignalRService", function() { return SignalRService; });
/* harmony import */ var _aspnet_signalr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @aspnet/signalr */ "Gpoy");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _constants_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/constants */ "bl9C");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _common_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./common.service */ "OlR4");
 // or from "@microsoft/signalr" if you are using a new library







class SignalRService {
    constructor(http, CommonService) {
        this.http = http;
        this.CommonService = CommonService;
        this.headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({ 'Content-Type': 'application/json' });
        this.startConnection = () => {
            this.groupName = JSON.parse(this.CommonService.getData('user')).userName;
            //this.groupName = this.CommonService.getData('userID');
            this.hubConnection = new _aspnet_signalr__WEBPACK_IMPORTED_MODULE_0__["HubConnectionBuilder"]()
                .withUrl(_constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/chatsocket', {
                skipNegotiation: true,
                transport: _aspnet_signalr__WEBPACK_IMPORTED_MODULE_0__["HttpTransportType"].WebSockets
            })
                .build();
            this.hubConnection
                .start()
                .then(() => console.log('Connection started'))
                .then(() => this.getConnectionId())
                .then(() => this.addToGroup(this.groupName))
                .catch((err) => console.log(err, _constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/chatsocket'));
        };
        this.addToGroup = (groupName) => {
            this.hubConnection.invoke('AddToGroup', groupName).then(() => {
                console.log("AddToGroup", groupName);
            })
                .catch((err) => console.log("AddToGroup Error", err));
        };
        //Called Directly from the Page.ts
        /*   public receiveManagerMessageListener = () => {
            this.hubConnection.on('ReceiveManagerMessage', (data: any[]) => {
              this.data = data;
              console.log(data);
            });
          } */
        this.getConnectionId = () => {
            this.hubConnection.invoke('getconnectionid').then((data) => {
                console.log("ConnectionId", data);
            });
        };
        this.removeFromGroup = () => {
            if (this.hubConnection) {
                console.log("RemoveFromALLGroup");
                this.hubConnection.invoke('RemoveFromALLGroup', JSON.parse(this.CommonService.getData('user')).userName)
                    .catch((err) => console.log("RemoveAllFromGroup Error", err));
            }
        };
    }
    getAllAgent() {
        return this.http.get(_constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/api/Agent/GetAllAgents', { headers: this.headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    }
    getAllManagers() {
        return this.http.get(_constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/api/Users/GetAllManagers', { headers: this.headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    }
    sendChatMessage(data) {
        return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/api/Chat/SendChatMessage', data, { headers: this.headers })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    }
    getImage(name) {
        return this.http.get(_constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/api/FileUpload/GetImage/' + name, { responseType: "blob" })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
    }
    handleError(error) {
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["throwError"])(error.message || error);
    }
}
SignalRService.ɵfac = function SignalRService_Factory(t) { return new (t || SignalRService)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_common_service__WEBPACK_IMPORTED_MODULE_6__["CommonService"])); };
SignalRService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({ token: SignalRService, factory: SignalRService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "vY5A":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _services_login_guard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services/login.guard */ "8Ek8");
/* harmony import */ var _services_pages_guard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/pages.guard */ "Z5rb");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");





const routes = [
    { path: '', canActivate: [_services_login_guard__WEBPACK_IMPORTED_MODULE_1__["LoginGuard"]], loadChildren: () => Promise.all(/*! import() | auth-auth-module */[__webpack_require__.e("default~auth-auth-module~pages-pages-module"), __webpack_require__.e("auth-auth-module")]).then(__webpack_require__.bind(null, /*! ./auth/auth.module */ "Yj9t")).then(m => m.AuthModule) },
    { path: 'pages', canActivate: [_services_pages_guard__WEBPACK_IMPORTED_MODULE_2__["PagesGuard"]], loadChildren: () => Promise.all(/*! import() | pages-pages-module */[__webpack_require__.e("default~auth-auth-module~pages-pages-module"), __webpack_require__.e("pages-pages-module")]).then(__webpack_require__.bind(null, /*! ./pages/pages.module */ "dgmN")).then(m => m.PagesModule) }
];
class AppRoutingModule {
}
AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) { return new (t || AppRoutingModule)(); };
AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({ type: AppRoutingModule });
AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({ imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes, { onSameUrlNavigation: 'reload' })], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](AppRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]] }); })();


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es2015.js.map