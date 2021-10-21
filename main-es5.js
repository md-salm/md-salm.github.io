(function () {
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"], {
    /***/
    "+U99":
    /*!***********************************************!*\
      !*** ./src/app/services/error-interceptor.ts ***!
      \***********************************************/

    /*! exports provided: ErrorInterceptor */

    /***/
    function U99(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "ErrorInterceptor", function () {
        return ErrorInterceptor;
      });
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");
      /* harmony import */


      var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! rxjs */
      "qCKp");
      /* harmony import */


      var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! rxjs/operators */
      "kU1M");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var _login_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! ./login.service */
      "EFyh");
      /* harmony import */


      var _chat_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! ./chat.service */
      "sjK5");

      var TOKEN_HEADER_KEY = 'x-access-token';

      var ErrorInterceptor = /*#__PURE__*/function () {
        function ErrorInterceptor(router, loginService, signalRService) {
          _classCallCheck(this, ErrorInterceptor);

          this.router = router;
          this.loginService = loginService;
          this.signalRService = signalRService;
          this.isRefreshing = false;
          this.refreshTokenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](null);
        }

        _createClass(ErrorInterceptor, [{
          key: "intercept",
          value: function intercept(request, next) {
            var _this = this;

            var token = this.loginService.getData('accessToken') || 'undefined';

            if (token !== 'undefined') {
              request = this.addToken(request, token);
            }

            return next.handle(request).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (error) {
              if (error instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpErrorResponse"] && error.status === 401) {
                return _this.handle401Error(request, next);
              } else {
                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["throwError"])(error);
              }
            }));
          }
        }, {
          key: "addToken",
          value: function addToken(request, token) {
            return request.clone({
              setHeaders: {
                'Authorization': "Bearer ".concat(token)
              }
            }); // request = request.clone({
            //   setHeaders: { Authorization: `Bearer ${token}` }
            // });
          }
        }, {
          key: "handle401Error",
          value: function handle401Error(request, next) {
            var _this2 = this;

            if (!this.isRefreshing) {
              this.isRefreshing = true;
              this.refreshTokenSubject.next(null);
              var obj = {
                userID: sessionStorage['userID'],
                refreshToken: sessionStorage['refreshToken']
              };
              console.log("Refresh Token Request", obj);
              return this.loginService.refreshToken(obj).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])(function (token) {
                console.log("Refresh Token Response", token);
                _this2.isRefreshing = false;

                if (token.result === 'Success') {
                  _this2.loginService.setData('accessToken', token.accessToken);

                  _this2.refreshTokenSubject.next(token.accessToken);

                  return next.handle(_this2.addToken(request, token.accessToken));
                } else {
                  _this2.signalRService.removeFromGroup();

                  _this2.loginService.redirect();

                  return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["throwError"])(token.message);
                }
              }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (err) {
                _this2.isRefreshing = false;

                _this2.signalRService.removeFromGroup();

                _this2.loginService.redirect();

                return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["throwError"])(err);
              }));
            }

            return this.refreshTokenSubject.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["filter"])(function (token) {
              return token != null;
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])(function (token) {
              console.log("Refresh Token 1", token);
              return next.handle(_this2.addToken(request, token));
            }));
          }
        }, {
          key: "logOut",
          value: function logOut() {
            var _this3 = this;

            var obj = {
              customerID: localStorage['customerID'],
              userID: localStorage['userID']
            };
            this.loginService.logout(obj).subscribe(function (res) {
              _this3.signalRService.removeFromGroup();

              _this3.loginService.redirect();
            }, function (err) {
              console.log(err);
            });
          }
        }]);

        return ErrorInterceptor;
      }();

      ErrorInterceptor.ɵfac = function ErrorInterceptor_Factory(t) {
        return new (t || ErrorInterceptor)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_login_service__WEBPACK_IMPORTED_MODULE_5__["LoginService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_chat_service__WEBPACK_IMPORTED_MODULE_6__["SignalRService"]));
      };

      ErrorInterceptor.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
        token: ErrorInterceptor,
        factory: ErrorInterceptor.ɵfac,
        providedIn: 'root'
      });
      /***/
    },

    /***/
    0:
    /*!***************************!*\
      !*** multi ./src/main.ts ***!
      \***************************/

    /*! no static exports found */

    /***/
    function _(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(
      /*! D:\Projects\ManagerApp\src\main.ts */
      "zUnb");
      /***/
    },

    /***/
    "8Ek8":
    /*!*****************************************!*\
      !*** ./src/app/services/login.guard.ts ***!
      \*****************************************/

    /*! exports provided: LoginGuard */

    /***/
    function Ek8(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "LoginGuard", function () {
        return LoginGuard;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _login_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./login.service */
      "EFyh");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");

      var LoginGuard = /*#__PURE__*/function () {
        function LoginGuard(loginService, router) {
          _classCallCheck(this, LoginGuard);

          this.loginService = loginService;
          this.router = router;
        }

        _createClass(LoginGuard, [{
          key: "canActivate",
          value: function canActivate(route, state) {
            if (this.loginService.isAuthenticated()) {
              this.router.navigate(['/pages']);
              return false;
            }

            return true;
          }
        }]);

        return LoginGuard;
      }();

      LoginGuard.ɵfac = function LoginGuard_Factory(t) {
        return new (t || LoginGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_login_service__WEBPACK_IMPORTED_MODULE_1__["LoginService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]));
      };

      LoginGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
        token: LoginGuard,
        factory: LoginGuard.ɵfac,
        providedIn: 'root'
      });
      /***/
    },

    /***/
    "AytR":
    /*!*****************************************!*\
      !*** ./src/environments/environment.ts ***!
      \*****************************************/

    /*! exports provided: environment */

    /***/
    function AytR(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "environment", function () {
        return environment;
      }); // This file can be replaced during build by using the `fileReplacements` array.
      // `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
      // The list of file replacements can be found in `angular.json`.


      var environment = {
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

      /***/
    },

    /***/
    "EFyh":
    /*!*******************************************!*\
      !*** ./src/app/services/login.service.ts ***!
      \*******************************************/

    /*! exports provided: LoginService */

    /***/
    function EFyh(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "LoginService", function () {
        return LoginService;
      });
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");
      /* harmony import */


      var _constants_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ../constants/constants */
      "bl9C");
      /* harmony import */


      var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! rxjs */
      "qCKp");
      /* harmony import */


      var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! rxjs/operators */
      "kU1M");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");

      var LoginService = /*#__PURE__*/function () {
        function LoginService(http, router) {
          _classCallCheck(this, LoginService);

          this.http = http;
          this.router = router;
          this.headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpHeaders"]({
            'Content-Type': 'application/json'
          });
        }

        _createClass(LoginService, [{
          key: "login",
          value: function login(user) {
            return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/Login/LoginUser', user, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "refreshToken",
          value: function refreshToken(data) {
            return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/Login/RefreshToken', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "registerClient",
          value: function registerClient(data) {
            return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/DialService/RegisterClient', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "registerSupervisor",
          value: function registerSupervisor(data) {
            return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/DialService/RegisterSupervisor', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "getSecretQuestion",
          value: function getSecretQuestion(data) {
            return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/Login/GetSecretQuestion', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "verifySecretAnswer",
          value: function verifySecretAnswer(data) {
            return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/Login/verifySecretAnswer', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "logout",
          value: function logout(data) {
            return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_1__["API_URL"] + '/api/Login/LogoutUser', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "redirect",
          value: function redirect() {
            localStorage.clear();
            this.router.navigate(['/']);
          }
        }, {
          key: "setSession",
          value: function setSession(key, val) {
            sessionStorage[key] = val;
          }
        }, {
          key: "setData",
          value: function setData(key, val) {
            sessionStorage[key] = val;
          }
        }, {
          key: "getData",
          value: function getData(key) {
            return sessionStorage[key];
          }
        }, {
          key: "gotoNotFound",
          value: function gotoNotFound() {
            this.router.navigate(['/403']);
          }
        }, {
          key: "isAuthenticated",
          value: function isAuthenticated() {
            return sessionStorage.userID != null;
          }
        }, {
          key: "handleError",
          value: function handleError(error) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["throwError"])(error.message || error);
          }
        }]);

        return LoginService;
      }();

      LoginService.ɵfac = function LoginService_Factory(t) {
        return new (t || LoginService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]));
      };

      LoginService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
        token: LoginService,
        factory: LoginService.ɵfac,
        providedIn: 'root'
      });
      /***/
    },

    /***/
    "Sy1n":
    /*!**********************************!*\
      !*** ./src/app/app.component.ts ***!
      \**********************************/

    /*! exports provided: AppComponent */

    /***/
    function Sy1n(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AppComponent", function () {
        return AppComponent;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");

      var AppComponent = function AppComponent() {
        _classCallCheck(this, AppComponent);

        this.title = 'SpitFire';
      };

      AppComponent.ɵfac = function AppComponent_Factory(t) {
        return new (t || AppComponent)();
      };

      AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
        type: AppComponent,
        selectors: [["app-root"]],
        decls: 1,
        vars: 0,
        template: function AppComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "router-outlet");
          }
        },
        directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterOutlet"]],
        encapsulation: 2
      });
      /***/
    },

    /***/
    "Z5rb":
    /*!*****************************************!*\
      !*** ./src/app/services/pages.guard.ts ***!
      \*****************************************/

    /*! exports provided: PagesGuard */

    /***/
    function Z5rb(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "PagesGuard", function () {
        return PagesGuard;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _login_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./login.service */
      "EFyh");

      var PagesGuard = /*#__PURE__*/function () {
        function PagesGuard(loginService) {
          _classCallCheck(this, PagesGuard);

          this.loginService = loginService;
        }

        _createClass(PagesGuard, [{
          key: "canActivate",
          value: function canActivate(route, state) {
            if (!this.loginService.isAuthenticated()) {
              this.loginService.redirect();
              return false;
            }

            return true;
          }
        }]);

        return PagesGuard;
      }();

      PagesGuard.ɵfac = function PagesGuard_Factory(t) {
        return new (t || PagesGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_login_service__WEBPACK_IMPORTED_MODULE_1__["LoginService"]));
      };

      PagesGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
        token: PagesGuard,
        factory: PagesGuard.ɵfac,
        providedIn: 'root'
      });
      /***/
    },

    /***/
    "ZAI4":
    /*!*******************************!*\
      !*** ./src/app/app.module.ts ***!
      \*******************************/

    /*! exports provided: AppModule */

    /***/
    function ZAI4(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AppModule", function () {
        return AppModule;
      });
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/platform-browser */
      "jhN1");
      /* harmony import */


      var _app_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./app-routing.module */
      "vY5A");
      /* harmony import */


      var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./app.component */
      "Sy1n");
      /* harmony import */


      var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/platform-browser/animations */
      "R1ws");
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");
      /* harmony import */


      var _services_error_interceptor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! ./services/error-interceptor */
      "+U99");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");

      var AppModule = function AppModule() {
        _classCallCheck(this, AppModule);
      };

      AppModule.ɵfac = function AppModule_Factory(t) {
        return new (t || AppModule)();
      };

      AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
        type: AppModule,
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]]
      });
      AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({
        providers: [{
          provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HTTP_INTERCEPTORS"],
          useClass: _services_error_interceptor__WEBPACK_IMPORTED_MODULE_5__["ErrorInterceptor"],
          multi: true
        }],
        imports: [[_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_1__["AppRoutingModule"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"]]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](AppModule, {
          declarations: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]],
          imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"], _app_routing_module__WEBPACK_IMPORTED_MODULE_1__["AppRoutingModule"], _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_3__["BrowserAnimationsModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"]]
        });
      })();
      /***/

    },

    /***/
    "bl9C":
    /*!****************************************!*\
      !*** ./src/app/constants/constants.ts ***!
      \****************************************/

    /*! exports provided: API_URL, CAMPAIGN_STATS_INTERVAL, COUNTRIES */

    /***/
    function bl9C(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "API_URL", function () {
        return API_URL;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "CAMPAIGN_STATS_INTERVAL", function () {
        return CAMPAIGN_STATS_INTERVAL;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "COUNTRIES", function () {
        return COUNTRIES;
      });
      /* harmony import */


      var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./../../environments/environment */
      "AytR");

      var API_URL = _environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].API_URL;
      var CAMPAIGN_STATS_INTERVAL = _environments_environment__WEBPACK_IMPORTED_MODULE_0__["environment"].CAMPAIGN_STATS_INTERVAL;
      var COUNTRIES = [{
        id: 1,
        name: 'Russia',
        flag: 'f/f3/Flag_of_Russia.svg',
        area: 17075200,
        population: 146989754
      }, {
        id: 2,
        name: 'France',
        flag: 'c/c3/Flag_of_France.svg',
        area: 640679,
        population: 64979548
      }, {
        id: 3,
        name: 'Germany',
        flag: 'b/ba/Flag_of_Germany.svg',
        area: 357114,
        population: 82114224
      }, {
        id: 4,
        name: 'Portugal',
        flag: '5/5c/Flag_of_Portugal.svg',
        area: 92090,
        population: 10329506
      }, {
        id: 5,
        name: 'Canada',
        flag: 'c/cf/Flag_of_Canada.svg',
        area: 9976140,
        population: 36624199
      }, {
        id: 6,
        name: 'Vietnam',
        flag: '2/21/Flag_of_Vietnam.svg',
        area: 331212,
        population: 95540800
      }, {
        id: 7,
        name: 'Brazil',
        flag: '0/05/Flag_of_Brazil.svg',
        area: 8515767,
        population: 209288278
      }, {
        id: 8,
        name: 'Mexico',
        flag: 'f/fc/Flag_of_Mexico.svg',
        area: 1964375,
        population: 129163276
      }, {
        id: 9,
        name: 'United States',
        flag: 'a/a4/Flag_of_the_United_States.svg',
        area: 9629091,
        population: 324459463
      }, {
        id: 10,
        name: 'India',
        flag: '4/41/Flag_of_India.svg',
        area: 3287263,
        population: 1324171354
      }, {
        id: 11,
        name: 'Indonesia',
        flag: '9/9f/Flag_of_Indonesia.svg',
        area: 1910931,
        population: 263991379
      }, {
        id: 12,
        name: 'Tuvalu',
        flag: '3/38/Flag_of_Tuvalu.svg',
        area: 26,
        population: 11097
      }, {
        id: 13,
        name: 'China',
        flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
        area: 9596960,
        population: 1409517397
      }];
      /***/
    },

    /***/
    "sjK5":
    /*!******************************************!*\
      !*** ./src/app/services/chat.service.ts ***!
      \******************************************/

    /*! exports provided: SignalRService */

    /***/
    function sjK5(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "SignalRService", function () {
        return SignalRService;
      });
      /* harmony import */


      var _aspnet_signalr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @aspnet/signalr */
      "Gpoy");
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");
      /* harmony import */


      var _constants_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ../constants/constants */
      "bl9C");
      /* harmony import */


      var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! rxjs/operators */
      "kU1M");
      /* harmony import */


      var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! rxjs */
      "qCKp");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! @angular/core */
      "fXoL"); // or from "@microsoft/signalr" if you are using a new library


      var SignalRService = /*#__PURE__*/function () {
        function SignalRService(http) {
          var _this4 = this;

          _classCallCheck(this, SignalRService);

          this.http = http;
          this.headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
            'Content-Type': 'application/json'
          });

          this.startConnection = function () {
            _this4.groupName = JSON.parse(sessionStorage['user']).userName; //this.groupName = sessionStorage['userID'];

            _this4.hubConnection = new _aspnet_signalr__WEBPACK_IMPORTED_MODULE_0__["HubConnectionBuilder"]().withUrl(_constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/chatsocket', {
              skipNegotiation: true,
              transport: _aspnet_signalr__WEBPACK_IMPORTED_MODULE_0__["HttpTransportType"].WebSockets
            }).build();

            _this4.hubConnection.start().then(function () {
              return console.log('Connection started');
            }).then(function () {
              return _this4.getConnectionId();
            }).then(function () {
              return _this4.addToGroup(_this4.groupName);
            })["catch"](function (err) {
              return console.log(err, _constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/chatsocket');
            });
          };

          this.addToGroup = function (groupName) {
            console.log(sessionStorage.userID);

            _this4.hubConnection.invoke('AddToGroup', groupName).then(function () {
              console.log("AddToGroup", groupName);
            })["catch"](function (err) {
              return console.log("AddToGroup Error", err);
            });
          }; //Called Directly from the Page.ts

          /*   public receiveManagerMessageListener = () => {
              this.hubConnection.on('ReceiveManagerMessage', (data: any[]) => {
                this.data = data;
                console.log(data);
              });
            } */


          this.getConnectionId = function () {
            _this4.hubConnection.invoke('getconnectionid').then(function (data) {
              console.log("ConnectionId", data);
            });
          };

          this.removeFromGroup = function () {
            if (_this4.hubConnection) {
              console.log("RemoveFromALLGroup");

              _this4.hubConnection.invoke('RemoveFromALLGroup', JSON.parse(localStorage['user']).userName)["catch"](function (err) {
                return console.log("RemoveAllFromGroup Error", err);
              });
            }
          };
        }

        _createClass(SignalRService, [{
          key: "getAllAgent",
          value: function getAllAgent() {
            return this.http.get(_constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/api/Agent/GetAllAgents', {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "getAllManagers",
          value: function getAllManagers() {
            return this.http.get(_constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/api/Users/GetAllManagers', {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "sendChatMessage",
          value: function sendChatMessage(data) {
            return this.http.post(_constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/api/Chat/SendChatMessage', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "getImage",
          value: function getImage(name) {
            return this.http.get(_constants_constants__WEBPACK_IMPORTED_MODULE_2__["API_URL"] + '/api/FileUpload/GetImage/' + name, {
              responseType: "blob"
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "handleError",
          value: function handleError(error) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["throwError"])(error.message || error);
          }
        }]);

        return SignalRService;
      }();

      SignalRService.ɵfac = function SignalRService_Factory(t) {
        return new (t || SignalRService)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]));
      };

      SignalRService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
        token: SignalRService,
        factory: SignalRService.ɵfac,
        providedIn: 'root'
      });
      /***/
    },

    /***/
    "vY5A":
    /*!***************************************!*\
      !*** ./src/app/app-routing.module.ts ***!
      \***************************************/

    /*! exports provided: AppRoutingModule */

    /***/
    function vY5A(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function () {
        return AppRoutingModule;
      });
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var _services_login_guard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./services/login.guard */
      "8Ek8");
      /* harmony import */


      var _services_pages_guard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./services/pages.guard */
      "Z5rb");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");

      var routes = [{
        path: '',
        canActivate: [_services_login_guard__WEBPACK_IMPORTED_MODULE_1__["LoginGuard"]],
        loadChildren: function loadChildren() {
          return Promise.all(
          /*! import() | auth-auth-module */
          [__webpack_require__.e("default~auth-auth-module~pages-pages-module"), __webpack_require__.e("auth-auth-module")]).then(__webpack_require__.bind(null,
          /*! ./auth/auth.module */
          "Yj9t")).then(function (m) {
            return m.AuthModule;
          });
        }
      }, {
        path: 'pages',
        canActivate: [_services_pages_guard__WEBPACK_IMPORTED_MODULE_2__["PagesGuard"]],
        loadChildren: function loadChildren() {
          return Promise.all(
          /*! import() | pages-pages-module */
          [__webpack_require__.e("default~auth-auth-module~pages-pages-module"), __webpack_require__.e("pages-pages-module")]).then(__webpack_require__.bind(null,
          /*! ./pages/pages.module */
          "dgmN")).then(function (m) {
            return m.PagesModule;
          });
        }
      }];

      var AppRoutingModule = function AppRoutingModule() {
        _classCallCheck(this, AppRoutingModule);
      };

      AppRoutingModule.ɵfac = function AppRoutingModule_Factory(t) {
        return new (t || AppRoutingModule)();
      };

      AppRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
        type: AppRoutingModule
      });
      AppRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
        imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](AppRoutingModule, {
          imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]],
          exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]]
        });
      })();
      /***/

    },

    /***/
    "zUnb":
    /*!*********************!*\
      !*** ./src/main.ts ***!
      \*********************/

    /*! no exports provided */

    /***/
    function zUnb(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/platform-browser */
      "jhN1");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./app/app.module */
      "ZAI4");
      /* harmony import */


      var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./environments/environment */
      "AytR");

      if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
      }

      _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])["catch"](function (err) {
        return console.error(err);
      });
      /***/

    },

    /***/
    "zn8P":
    /*!******************************************************!*\
      !*** ./$$_lazy_route_resource lazy namespace object ***!
      \******************************************************/

    /*! no static exports found */

    /***/
    function zn8P(module, exports) {
      function webpackEmptyAsyncContext(req) {
        // Here Promise.resolve().then() is used instead of new Promise() to prevent
        // uncaught exception popping up in devtools
        return Promise.resolve().then(function () {
          var e = new Error("Cannot find module '" + req + "'");
          e.code = 'MODULE_NOT_FOUND';
          throw e;
        });
      }

      webpackEmptyAsyncContext.keys = function () {
        return [];
      };

      webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
      module.exports = webpackEmptyAsyncContext;
      webpackEmptyAsyncContext.id = "zn8P";
      /***/
    }
  }, [[0, "runtime", "vendor"]]]);
})();
//# sourceMappingURL=main-es5.js.map