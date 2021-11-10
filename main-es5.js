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
      /* harmony import */


      var _common_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
      /*! ./common.service */
      "OlR4");

      var TOKEN_HEADER_KEY = 'x-access-token';

      var ErrorInterceptor = /*#__PURE__*/function () {
        function ErrorInterceptor(router, loginService, signalRService, CommonService) {
          _classCallCheck(this, ErrorInterceptor);

          this.router = router;
          this.loginService = loginService;
          this.signalRService = signalRService;
          this.CommonService = CommonService;
          this.isRefreshing = false;
          this.refreshTokenSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](null);
        }

        _createClass(ErrorInterceptor, [{
          key: "intercept",
          value: function intercept(request, next) {
            var _this = this;

            var token = this.CommonService.getData('accessToken') || 'undefined';

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
                userID: this.CommonService.getData('userID'),
                refreshToken: this.CommonService.getData('refreshToken')
              };
              console.log("Refresh Token Request", obj);
              return this.loginService.refreshToken(obj).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])(function (token) {
                console.log("Refresh Token Response", token);
                _this2.isRefreshing = false;

                if (token.result === 'Success') {
                  _this2.CommonService.setData('accessToken', token.accessToken);

                  _this2.refreshTokenSubject.next(token.accessToken); // return next.handle(this.addToken(request, token.accessToken));

                } else {
                  console.log("Else");

                  _this2.signalRService.removeFromGroup();

                  _this2.CommonService.clearStorage();

                  _this2.router.navigate(['/']); //this.loginService.redirect();
                  //return throwError(token.message);

                }

                return next.handle(_this2.addToken(request, token.accessToken));
              }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(function (err) {
                console.log("catch Error");

                _this2.CommonService.clearStorage();

                _this2.router.navigate(['/']);

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
              customerID: this.CommonService.getData('customerID'),
              userID: this.CommonService.getData('userID')
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
        return new (t || ErrorInterceptor)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_login_service__WEBPACK_IMPORTED_MODULE_5__["LoginService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_chat_service__WEBPACK_IMPORTED_MODULE_6__["SignalRService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_common_service__WEBPACK_IMPORTED_MODULE_7__["CommonService"]));
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


      var _common_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./common.service */
      "OlR4");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");

      var LoginGuard = /*#__PURE__*/function () {
        function LoginGuard(CommonService, router) {
          _classCallCheck(this, LoginGuard);

          this.CommonService = CommonService;
          this.router = router;
        }

        _createClass(LoginGuard, [{
          key: "canActivate",
          value: function canActivate(route, state) {
            if (this.CommonService.isAuthenticated()) {
              this.router.navigate(['/pages']);
              return false;
            }

            return true;
          }
        }]);

        return LoginGuard;
      }();

      LoginGuard.ɵfac = function LoginGuard_Factory(t) {
        return new (t || LoginGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_common_service__WEBPACK_IMPORTED_MODULE_1__["CommonService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]));
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
        //appConfig.API_URL: 'http://localhost:62188',
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


      var _services_config_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./../services/config.service */
      "r4Kj");
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
      /* harmony import */


      var _common_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! ./common.service */
      "OlR4");

      var LoginService = /*#__PURE__*/function () {
        function LoginService(http, router, CommonService) {
          _classCallCheck(this, LoginService);

          this.http = http;
          this.router = router;
          this.CommonService = CommonService;
          this.headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpHeaders"]({
            'Content-Type': 'application/json'
          });
        }

        _createClass(LoginService, [{
          key: "login",
          value: function login(user) {
            return this.http.post(_services_config_service__WEBPACK_IMPORTED_MODULE_1__["appConfig"].API_URL + '/api/Login/LoginUser', user, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "refreshToken",
          value: function refreshToken(data) {
            return this.http.post(_services_config_service__WEBPACK_IMPORTED_MODULE_1__["appConfig"].API_URL + '/api/Login/RefreshToken', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "registerClient",
          value: function registerClient(data) {
            return this.http.post(_services_config_service__WEBPACK_IMPORTED_MODULE_1__["appConfig"].API_URL + '/api/DialService/RegisterClient', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "registerSupervisor",
          value: function registerSupervisor(data) {
            return this.http.post(_services_config_service__WEBPACK_IMPORTED_MODULE_1__["appConfig"].API_URL + '/api/DialService/RegisterSupervisor', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "getSecretQuestion",
          value: function getSecretQuestion(data) {
            return this.http.post(_services_config_service__WEBPACK_IMPORTED_MODULE_1__["appConfig"].API_URL + '/api/Login/GetSecretQuestion', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "verifySecretAnswer",
          value: function verifySecretAnswer(data) {
            return this.http.post(_services_config_service__WEBPACK_IMPORTED_MODULE_1__["appConfig"].API_URL + '/api/Login/verifySecretAnswer', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "logout",
          value: function logout(data) {
            return this.http.post(_services_config_service__WEBPACK_IMPORTED_MODULE_1__["appConfig"].API_URL + '/api/Login/LogoutUser', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "redirect",
          value: function redirect() {
            this.CommonService.clearStorage();
            this.router.navigate(['/']);
          }
        }, {
          key: "gotoNotFound",
          value: function gotoNotFound() {
            this.router.navigate(['/403']);
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
        return new (t || LoginService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_common_service__WEBPACK_IMPORTED_MODULE_6__["CommonService"]));
      };

      LoginService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
        token: LoginService,
        factory: LoginService.ɵfac,
        providedIn: 'root'
      });
      /***/
    },

    /***/
    "OlR4":
    /*!********************************************!*\
      !*** ./src/app/services/common.service.ts ***!
      \********************************************/

    /*! exports provided: CommonService */

    /***/
    function OlR4(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "CommonService", function () {
        return CommonService;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");

      var CommonService = /*#__PURE__*/function () {
        function CommonService() {
          _classCallCheck(this, CommonService);
        }

        _createClass(CommonService, [{
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
          key: "setLocalData",
          value: function setLocalData(key, val) {
            localStorage[key] = val;
          }
        }, {
          key: "getLocalData",
          value: function getLocalData(key) {
            return localStorage[key];
          }
        }, {
          key: "isAuthenticated",
          value: function isAuthenticated() {
            return sessionStorage.userID != null;
          }
        }, {
          key: "clearStorage",
          value: function clearStorage() {
            sessionStorage.clear();
          }
        }]);

        return CommonService;
      }();

      CommonService.ɵfac = function CommonService_Factory(t) {
        return new (t || CommonService)();
      };

      CommonService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
        token: CommonService,
        factory: CommonService.ɵfac,
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
      /* harmony import */


      var _common_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./common.service */
      "OlR4");

      var PagesGuard = /*#__PURE__*/function () {
        function PagesGuard(loginService, CommonService) {
          _classCallCheck(this, PagesGuard);

          this.loginService = loginService;
          this.CommonService = CommonService;
        }

        _createClass(PagesGuard, [{
          key: "canActivate",
          value: function canActivate(route, state) {
            if (!this.CommonService.isAuthenticated()) {
              this.loginService.redirect();
              return false;
            }

            return true;
          }
        }]);

        return PagesGuard;
      }();

      PagesGuard.ɵfac = function PagesGuard_Factory(t) {
        return new (t || PagesGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_login_service__WEBPACK_IMPORTED_MODULE_1__["LoginService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_common_service__WEBPACK_IMPORTED_MODULE_2__["CommonService"]));
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
      /* harmony import */


      var _services_config_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
      /*! ./services/config.service */
      "r4Kj");

      function initConfig(config) {
        return function () {
          return config.loadConfig();
        };
      }

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
        providers: [_services_config_service__WEBPACK_IMPORTED_MODULE_7__["ConfigService"], {
          provide: _angular_core__WEBPACK_IMPORTED_MODULE_6__["APP_INITIALIZER"],
          useFactory: initConfig,
          deps: [_services_config_service__WEBPACK_IMPORTED_MODULE_7__["ConfigService"]],
          multi: true
        }, {
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
    "r4Kj":
    /*!********************************************!*\
      !*** ./src/app/services/config.service.ts ***!
      \********************************************/

    /*! exports provided: appConfig, ConfigService */

    /***/
    function r4Kj(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "appConfig", function () {
        return appConfig;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "ConfigService", function () {
        return ConfigService;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");

      var appConfig;

      var ConfigService = /*#__PURE__*/function () {
        // public config: any;
        function ConfigService(http) {
          _classCallCheck(this, ConfigService);

          this.http = http;
        }

        _createClass(ConfigService, [{
          key: "loadConfig",
          value: function loadConfig() {
            return this.http.get("./assets/config.json").toPromise().then(function (res) {
              appConfig = res;
              console.log(appConfig.API_URL, "From Config");
            });
          }
        }, {
          key: "getConfig",
          value: function getConfig() {
            return appConfig;
          }
        }]);

        return ConfigService;
      }();

      ConfigService.ɵfac = function ConfigService_Factory(t) {
        return new (t || ConfigService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]));
      };

      ConfigService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
        token: ConfigService,
        factory: ConfigService.ɵfac
      });
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


      var _services_config_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./../services/config.service */
      "r4Kj");
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
      "fXoL");
      /* harmony import */


      var _common_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! ./common.service */
      "OlR4"); // or from "@microsoft/signalr" if you are using a new library


      var SignalRService = /*#__PURE__*/function () {
        function SignalRService(http, CommonService) {
          var _this4 = this;

          _classCallCheck(this, SignalRService);

          this.http = http;
          this.CommonService = CommonService;
          this.headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
            'Content-Type': 'application/json'
          });

          this.startConnection = function () {
            _this4.groupName = JSON.parse(_this4.CommonService.getData('user')).userName; //this.groupName = this.CommonService.getData('userID');

            _this4.hubConnection = new _aspnet_signalr__WEBPACK_IMPORTED_MODULE_0__["HubConnectionBuilder"]().withUrl(_services_config_service__WEBPACK_IMPORTED_MODULE_2__["appConfig"].API_URL + '/chatsocket', {
              skipNegotiation: true,
              transport: _aspnet_signalr__WEBPACK_IMPORTED_MODULE_0__["HttpTransportType"].WebSockets
            }).build();

            _this4.hubConnection.start().then(function () {
              return console.log('Connection started');
            }).then(function () {
              return _this4.getConnectionId();
            }).then(function () {
              return _this4.removeFromGroup();
            }).then(function () {
              return _this4.addToGroup(_this4.groupName);
            })["catch"](function (err) {
              return console.log(err, _services_config_service__WEBPACK_IMPORTED_MODULE_2__["appConfig"].API_URL + '/chatsocket');
            });
          };

          this.addToGroup = function (groupName) {
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

              _this4.hubConnection.invoke('RemoveFromALLGroup', JSON.parse(_this4.CommonService.getData('user')).userName)["catch"](function (err) {
                return console.log("RemoveAllFromGroup Error", err);
              });
            }
          };
        }

        _createClass(SignalRService, [{
          key: "getAllAgent",
          value: function getAllAgent() {
            return this.http.get(_services_config_service__WEBPACK_IMPORTED_MODULE_2__["appConfig"].API_URL + '/api/Agent/GetAllAgents', {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "getAllManagers",
          value: function getAllManagers() {
            return this.http.get(_services_config_service__WEBPACK_IMPORTED_MODULE_2__["appConfig"].API_URL + '/api/Users/GetAllManagers', {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "sendChatMessage",
          value: function sendChatMessage(data) {
            return this.http.post(_services_config_service__WEBPACK_IMPORTED_MODULE_2__["appConfig"].API_URL + '/api/Chat/SendChatMessage', data, {
              headers: this.headers
            }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["retry"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError));
          }
        }, {
          key: "getImage",
          value: function getImage(name) {
            return this.http.get(_services_config_service__WEBPACK_IMPORTED_MODULE_2__["appConfig"].API_URL + '/api/FileUpload/GetImage/' + name, {
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
        return new (t || SignalRService)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_common_service__WEBPACK_IMPORTED_MODULE_6__["CommonService"]));
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
        imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes, {
          onSameUrlNavigation: 'reload'
        })], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]]
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

    /*! exports provided: loadConfigService */

    /***/
    function zUnb(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "loadConfigService", function () {
        return loadConfigService;
      });
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

      function loadConfigService(configService) {
        return function () {
          return configService.loadConfig();
        };
      }

      if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
      }

      _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])["catch"](function (err) {
        return console.error(err);
      }); // (async () => {
      //   const response = await fetch('https://api.myjson.com/bins/lf0ns');
      //   const config = await response.json();
      //   environment['appConfig.API_URL'] = "holyshit";
      //   platformBrowserDynamic().bootstrapModule(AppModule)
      //     .catch(err => console.error(err));
      // })();

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