(function () {
  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

  function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["auth-auth-module"], {
    /***/
    "2tF/":
    /*!*************************************************************!*\
      !*** ./node_modules/rxjs/internal/scheduler/AsyncAction.js ***!
      \*************************************************************/

    /*! no static exports found */

    /***/
    function tF(module, exports, __webpack_require__) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var _extendStatics = function extendStatics(d, b) {
          _extendStatics = Object.setPrototypeOf || {
            __proto__: []
          } instanceof Array && function (d, b) {
            d.__proto__ = b;
          } || function (d, b) {
            for (var p in b) {
              if (b.hasOwnProperty(p)) d[p] = b[p];
            }
          };

          return _extendStatics(d, b);
        };

        return function (d, b) {
          _extendStatics(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var Action_1 = __webpack_require__(
      /*! ./Action */
      "Dz+M");

      var AsyncAction = function (_super) {
        __extends(AsyncAction, _super);

        function AsyncAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;

          _this.scheduler = scheduler;
          _this.work = work;
          _this.pending = false;
          return _this;
        }

        AsyncAction.prototype.schedule = function (state, delay) {
          if (delay === void 0) {
            delay = 0;
          }

          if (this.closed) {
            return this;
          }

          this.state = state;
          var id = this.id;
          var scheduler = this.scheduler;

          if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
          }

          this.pending = true;
          this.delay = delay;
          this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
          return this;
        };

        AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
            delay = 0;
          }

          return setInterval(scheduler.flush.bind(scheduler, this), delay);
        };

        AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
            delay = 0;
          }

          if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
          }

          clearInterval(id);
          return undefined;
        };

        AsyncAction.prototype.execute = function (state, delay) {
          if (this.closed) {
            return new Error('executing a cancelled action');
          }

          this.pending = false;

          var error = this._execute(state, delay);

          if (error) {
            return error;
          } else if (this.pending === false && this.id != null) {
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
          }
        };

        AsyncAction.prototype._execute = function (state, delay) {
          var errored = false;
          var errorValue = undefined;

          try {
            this.work(state);
          } catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
          }

          if (errored) {
            this.unsubscribe();
            return errorValue;
          }
        };

        AsyncAction.prototype._unsubscribe = function () {
          var id = this.id;
          var scheduler = this.scheduler;
          var actions = scheduler.actions;
          var index = actions.indexOf(this);
          this.work = null;
          this.state = null;
          this.pending = false;
          this.scheduler = null;

          if (index !== -1) {
            actions.splice(index, 1);
          }

          if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
          }

          this.delay = null;
        };

        return AsyncAction;
      }(Action_1.Action);

      exports.AsyncAction = AsyncAction; //# sourceMappingURL=AsyncAction.js.map

      /***/
    },

    /***/
    "4Zwr":
    /*!*******************************************************!*\
      !*** ./src/app/auth/login/dialog/dialog.component.ts ***!
      \*******************************************************/

    /*! exports provided: DialogComponent */

    /***/
    function Zwr(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "DialogComponent", function () {
        return DialogComponent;
      });
      /* harmony import */


      var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/material/dialog */
      "0IaG");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var src_app_services_common_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! src/app/services/common.service */
      "OlR4");
      /* harmony import */


      var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! @angular/material/button */
      "bTqV");

      var DialogComponent = /*#__PURE__*/function () {
        function DialogComponent(CommonService, dialogRef, data) {
          _classCallCheck(this, DialogComponent);

          this.CommonService = CommonService;
          this.dialogRef = dialogRef;
          this.data = data;
        }

        _createClass(DialogComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {}
        }, {
          key: "close",
          value: function close() {
            this.dialogRef.close(null);
          }
        }, {
          key: "onAgree",
          value: function onAgree() {
            this.dialogRef.close("yes");
          }
        }]);

        return DialogComponent;
      }();

      DialogComponent.??fac = function DialogComponent_Factory(t) {
        return new (t || DialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["????directiveInject"](src_app_services_common_service__WEBPACK_IMPORTED_MODULE_2__["CommonService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["????directiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__["MatDialogRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["????directiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__["MAT_DIALOG_DATA"]));
      };

      DialogComponent.??cmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["????defineComponent"]({
        type: DialogComponent,
        selectors: [["app-dialog"]],
        decls: 145,
        vars: 0,
        consts: [[1, "rework-dialog", "dialog"], [1, "dialog-header"], [1, "close", 3, "click"], [1, "material-icons"], [1, "dialog-body"], ["align", "center", 1, "rounded2"], [1, "footer"], ["mat-flat-button", "", 3, "click"], ["mat-flat-button", "", "color", "primary", 2, "margin-left", "12px", 3, "click"]],
        template: function DialogComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](0, "div", 0);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](1, "div", 1);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](2, "h4");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](3, "SpitFire Compliance Agreement:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](4, "div", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????listener"]("click", function DialogComponent_Template_div_click_4_listener() {
              return ctx.close();
            });

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](5, "span", 3);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](6, " close ");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](7, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](8, "div", 5);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](9, "ol");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](10, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](11, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](12, "Non-Exclusive Software License:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](13, " Upon receipt of the purchase price from Purchaser, OPC MARKETING, INC hereby grants Purchaser a limited, non-exclusive license to use the software described on Purchaser invoice during the period that this Agreement is in effect. Purchaser and Purchaser alone is the authorized user of the software and Purchaser may not allow any other person or entity (\u201CUnauthorized Users\u201D) to make any use of the software. Purchaser must immediately report to OPC MARKETING, INC any use or attempted use of the software by any Unauthorized Users. Purchaser may not, at any time, resell or re-license the software to any Unauthorized User. Upon termination by either party, this license shall immediately terminate and Purchaser shall make no further use of the software. Except as otherwise specifically permitted in this Agreement, Purchaser may not: (a) modify or create any derivative works of any software, service or documentation, including translation or localization (code written to published APIs (application programming interfaces) for the software shall not be deemed derivative works); (b) sublicense or permit simultaneous use of the software by more than one user; (c) reverse engineer, decompile, or disassemble or otherwise attempt to derive the source code for any software related to the software (except to the extent applicable laws specifically prohibit such restriction); (d) redistribute, encumber, sell, rent, lease, sublicense, use the software in a timesharing or service bureau arrangement, or otherwise transfer rights to any software; (e) remove or alter any trademark, logo, copyright or other proprietary notices, legends, symbols or labels in the software; (f) publish any results of benchmark tests run on any software to a third party without prior express written consent from OPC MARKETING, INC. Details of the SOFTWARE LICENSE are included in the \u201Cpreferences\u201D of Spitfire.exe. After the initial purchase, any updates (new versions) to the SpitFire Software are available free of charge if Purchaser has technical support time available. If Purchaser\u2019s technical support has expired or has been depleted, it will be necessary to purchase additional technical support at the going rate. If the Purchaser wants the software updates on a CD, there will be a charge of $25 each, plus shipping. OPC MARKETING, INC software is protected with a security key or dongle. Purchaser is responsible for the dongle. In the case of a lost dongle, Purchaser is responsible for replacement at the cost of the original software license. The software license shall immediately and automatically be suspended if at any time Purchaser defaults under its obligations under this Agreement or nonpayment according to the invoice. ");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](14, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](15, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](16, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](17, "Refund Policy:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](18, " This product purchase is non-refundable.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](19, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](20, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](21, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](22, "Compliance with Law:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](23, " Purchaser is required to use the software in full compliance with all applicable laws and regulations, including without limitation, all state, federal and international: (1) Do-Not-Call list prohibitions; (2) telemarketer licensing and bonding requirements; (3) consumer cancellation rights; (4) mandatory disclosures; (5) cell phone restrictions; (6) auto dialer and pre-recorded message restrictions; (7) internal DNC/opt-out rules; (8) recording of any calls or information, including but not limited to calls or information pertaining to or in any way related to the use of the software; and (9) all other applicable laws and regulations. OPC Marketing, Inc. shall in no way or manner be liable for any matter involving or relating to the recording of any calls or information. Additionally, should the software or any item sold to Purchaser by OPC Marketing, Inc. fail to record any calls or information for any reason whatsoever, OPC Marketing, Inc. shall not be liable to Purchaser or any other party for any damages or matters caused by such failure to record. By making any use of the software, Purchaser expressly warrants to us that Purchaser are and shall continue to act in full compliance with the law. All OPC MARKETING, INC offers are void where prohibited by law. Purchaser agrees that they have read and understand the FTC\u2019s Telemarketing Sales Rule (\u201CTSR\u201D) and the FCC\u2019s Telephone Consumer Protection Act (\u201CTCPA\u201D), and all other applicable laws and regulations. Purchaser should review these rules with Purchaser\u2019s own legal counsel to ensure that Purchaser understands and is fully compliant. OPC MARKETING, INC does not assume responsibility for ensuring that Purchaser marketing campaigns meet applicable legal requirements. OPC MARKETING, INC will not assume any liability if Purchaser is ever held guilty or liable for any law violation. Notwithstanding the foregoing, Purchaser acknowledges that OPC MARKETING, INC has and is taking active steps to ensure the compliance of its customers, including by having Purchaser agree to these terms. ");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](24, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](25, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](26, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](27, "SAN Numbers:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](28, " Purchaser acknowledges that sellers and telemarketers may be required to purchase their own Subscription Account Number (\u201CSAN\u201D) from the FCC, including all area codes into which they call or transmit messages. Therefore, Purchaser agrees, if applicable, that Purchaser will obtain Purchaser own SAN (or \u201Cexempt\u201D SAN if applicable) and purchase all applicable area codes as required by law. Even if Purchaser is exempt from DNC rules, Purchaser may be required to obtain an \u201Cexempt\u201D SAN if Purchaser chooses to voluntarily scrub against the DNC list. If applicable, Purchaser also agrees to purchase and scrub against any applicable state DNC list. OPC MARKETING, INC cannot and shall not maintain any SAN number for Purchaser or obtain one on Purchaser behalf.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](29, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](30, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](31, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](32, "Call Abandonment Rate/Drop Rate:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](33, " Purchaser understands and agrees that among other things, telemarketers who use automated dialers to initiate outbound calls are prohibited from abandoning (failing to connect to live operator within 2 seconds of the answer) more than 3% of all outgoing calls as measured on a successive 30-day basis per individual calling campaign. Purchaser are responsible (not OPC MARKETING INC) for ensuring that Purchaser\u2019s abandonment rate does not exceed the maximum amount allowed by law. Purchaser is required to actively monitor Purchaser\u2019s abandonment rate and to scale back call volumes or cease calling as necessary in order to comply. Purchaser also understands that certain disclosures are required by the FCC for all abandoned calls and Purchaser agrees to comply with the same.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](34, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](35, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](36, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](37, "Cell Phones:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](38, " Purchaser understands and acknowledges that it is generally a violation of the recently amended TCPA to transmit a prerecorded telemarketing message to a cell phone without prior express written consent. Purchaser will be responsible for ensuring that Purchaser does not transmit messages to cell numbers without the appropriate consent. If Purchaser does not have appropriate cell consent leads to call, Purchaser will purchase and timely scrub against a national list of wireless numbers and numbers ported from landlines to cell phones. OPC MARKETING, INC is not responsible for ensuring that Purchaser does not transmit messages to cell phones in violation of the cell consent rules.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](39, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](40, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](41, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](42, "Safe Harbor:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](43, " Purchasers who purchase OPC MARKETING, INC\u2019s software agree to create and enforce their own internal safe harbor and do not call policies and procedures in full compliance with the law. Federal regulations provide for a limited \u201Csafe harbor\u201D defense to certain Do-Not-Call (\u201CDNC\u201D) violations. Some of the elements of the safe harbor defense are: (1) establish and implement written procedures to comply with DNC restrictions; (2) train personnel, and any entity assisting in compliance, in the written procedures; (3) monitor and enforce compliance with the written procedures; (4) maintain an entity-specific DNC/opt-out list; (5) use a process to prevent telemarketing calls to numbers on the national and entity-specific internal DNC lists. A good safe harbor program and DNC policy is not a complete solution to telemarketing compliance; they are only one component of telemarketing compliance. Purchaser will remain responsible to maintain, follow and enforce good DNC procedures.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](44, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](45, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](46, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](47, "No Legal, Financial or Tax Advice Provided:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](48, " No financial, legal, or tax advice or counsel is given, or shall be deemed to have been given by OPC MARKETING, INC or its affiliates and contractors, or by the software.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](49, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](50, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](51, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](52, "Indemnification:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](53, " Purchaser shall assume, pay, indemnify, hold harmless and reimburse OPC MARKETING, INC and its owners, employees, agents, affiliates, contractors, successors and assigns for any and all liabilities, damages, claims, suits, settlements, judgments, costs, and expenses (including reasonable attorney\u2019s fees and court costs) directly or indirectly incurred by OPC MARKETING, INC to the extent the same are related in any way to Purchaser\u2019s use of the software or which are primarily attributable to the negligence or intentional acts or omissions by Purchaser, Purchaser owners, officers, employees, agents and representatives, including any authorized or unauthorized users. Notwithstanding the foregoing, nothing contained herein shall release OPC MARKETING, INC from any liability for its own gross negligence, except as allowed by law.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](54, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](55, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](56, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](57, "Limitation of Liability:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](58, " Neither party shall be liable for any consequential, incidental, special or indirect damages (including, but not limited to, loss of profits, goodwill, use, data, or other intangible items) even if the other party has been advised of the possibility of such damages or losses. OPC MARKETING, INC is not responsible for any failure of a DNC or wireless list provider to deliver its data accurately, completely or in a timely way, OPC MARKETING, INC is not responsible for damages resulting from improper or incomplete use by Purchaser of OPC MARKETING, INC\u2019s products and services. With respect to any other damages, OPC MARKETING, INC\u2019s liability hereunder shall in no event exceed an amount equal to the amount actually paid by Purchaser to OPC MARKETING, INC in the month prior to a claim being made, regardless of the basis for the claim. Purchaser understands that this is a significant limitation on Purchaser\u2019s right to sue OPC MARKETING, INC and Purchaser should not proceed if Purchaser does not agree. OPC MARKETING, INC shall not be bound by any typographical or other error or misprint in its marketing materials or online purchase websites, so long as OPC MARKETING, INC provides prompt notice of any such error and corrects the same.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](59, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](60, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](61, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](62, "Warranties:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](63, " Except as otherwise provided herein, THE SERVICES ARE PROVIDED \u201CAS IS\u201D WITHOUT ANY EXPRESS OR IMPLIED WARRANTY OF ANY KIND INCLUDING WARRANTIES OF MERCHANTABILITY OR FITNESS FOR ANY PARTICULAR PURPOSE. IN NO EVENT SHALL OPC MARKETING, INC OR ITS SUPPLIERS BE LIABLE FOR ANY DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF PROFITS, BUSINESS INTERRUPTION, LOSS OF INFORMATION) ARISING OUT OF THE USE OF OR INABILITY TO USE THE SOFTWARE, EVEN IF OPC MARKETING, INC HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. Computers, if purchased from OPC MARKETING, INC, are warranted for one (1) year from date of purchase, provided there has been no abuse or misuse. OPC MARKETING, INC warrants that its software and hardware will be free of any significant defects. OPC MARKETING, INC will correct or replace defective materials. This warranty is not valid if a surge protector and/or a battery backup (uninterruptible power supply) are not used to protect the system. OPC MARKETING, INC cannot be held responsible for any kind of physical damages, including lightning, to the hardware or software. Installing any third-party software onto system will void this warranty. Any contamination of the system by viruses will void this warranty. OPC MARKETING, INC cannot be responsible if Purchaser makes changes, misuses, or tampers with the software or hardware after Purchaser receives them. Any installation of other software or changes by Purchaser may void the warranty; any tech support required because of virus contamination will be at Purchaser\u2019s expense at the rate of $75 per hour. This warranty and the obligations and liabilities of OPC MARKETING, INC are in lieu of, and Purchaser waives, all other warranties, guarantees, conditions, or liabilities, expressed or implied, arising by law or otherwise, INCLUDING WITHOUT LIMITATION THE IMPLIED WARRANTY OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, and further including without limitation consequential damages, whether or not caused by OPC Marketing, Inc's negligence. This warranty shall not be extended, altered, or varied except by a written agreement signed by OPC MARKETING, INC and Purchaser.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](64, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](65, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](66, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](67, "Intellectual Property:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](68, " \u201COPC MARKETING,\u201D \u201CSpitFire,\u201D \u201CSpitFire Dialer,\u201D \u201CSpitFire 10\u201D, \u201CSpitFire X\u201D, \u201DSpitFire Hybrid\u201D, \u201CSpitFire Enterprise\u201D and \u201CSpitFire Software\u201D and all related trade and service marks are and shall remain the exclusive intellectual property of OPC MARKETING, INC. OPC MARKETING, INC and Purchaser specifically acknowledges that this Agreement does not confer upon the other party any interest in or right to use any trademark or service mark of the other party or its affiliates, unless the party wishing to use a trademark or service mark receives the prior written consent of the owning party, which the owning party may grant or withhold in its sole discretion. Purchaser acknowledges that the software is protected by state, federal and international copyright laws and treaties and Purchaser hereby prospectively waive any challenges to the existence, ownership and enforceability the same.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](69, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](70, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](71, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](72, "Legal Relationship:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](73, " By this Agreement, no partnership, joint venture, independent contractor or ownership relationship is formed beyond that of a product Purchaser and Seller and that of a software licensor and licensee.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](74, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](75, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](76, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](77, "Choice of Law:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](78, " This Agreement shall be governed by and construed according to the laws of the State of Texas, without giving effect to normal choice-of-law and conflict-of-law principles. Except for a suit by OPC MARKETING, INC to collect the purchase price or other fees owed by Purchaser pursuant to the Agreement, the parties agree that a party asserting any claim or dispute regarding this Agreement shall file and litigate such claim/dispute only in a court in Dallas County, State of Texas.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](79, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](80, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](81, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](82, "Other Important Disclaimers:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](83, " Purchaser is not purchasing a \"franchise\", \"business opportunity\", \u201Cstrategic or targeted marketing plan\u201D, or \"exclusive territory\" from OPC MARKETING, INC. Purchaser understands that computers and telecommunications are complex, and that it may take time, effort, and skill to install, understand, and operate these products. Purchaser must allow ample time to receive, set up, test, and understand his or her system before advertising or going on-line to the public. Purchaser is aware that there is a wide variety of computer hardware and software, as well as telephone companies and equipment. For this reason, OPC MARKETING, INC does not warrant that its products will function in every environment. It is the Purchaser's responsibility to obtain the necessary computer equipment to operate these products. It is the Purchaser's responsibility to become aware of the cost and availability of telephone and electrical requirements. Purchaser is responsible for any business and miscellaneous expenses necessary to operate these products, including telephone service, advertising, computers, etc. OPC MARKETING, INC will not be liable for these expenses for any reason. Even though Purchaser's system may be designed to operate 24 hours a day, Purchaser should be aware that the system may be out of service periodically for backups, maintenance, improvements, or difficulties such as power outages, telephone line problems, hardware/software malfunctions, etc. OPC MARKETING, INC will not be liable for any lost revenue, lost profits, advertising, or additional expenses due to loss of data, hardware/software problems, or for any reason. Purchaser will pay the shipping costs of returning any items for repair or replacement. Purchaser is aware there will be limitations as to the size of the software applications and to the number of telephone lines that can be used, due to hardware and software limitations. OPC MARKETING, INC does not make any claims or guarantees that Purchaser will bring in any revenue nor operate any profitable services or businesses by using the software or hardware sold by OPC MARKETING, INC. The suggestions, ideas, and techniques offered by OPC MARKETING, INC are not guaranteed to bring success. The success of the Purchaser will be affected by many factors, including, but not limited to, his or her efforts and competence. Purchaser is responsible for the security of the system and for obtaining property and liability insurance. Purchaser assumes total responsibility pertaining to the above regulations and holds OPC Marketing, Inc harmless from any litigation or claims against seller whatsoever. Purchaser is responsible for adherence to all laws pertaining with the National and State (if applicable) Do Not Call Registry at all times while system in use.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](84, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](85, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](86, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](87, "Minimum Requirements:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](88, " Bandwidth required per port is a minimum of 100 Kilobits per second (Kbps) upload and download, when the system uses G.711 codec. Purchaser must provide high-speed internet connection for training, updates and technical support. If agent stations are outside the network, a VPN connection to the network in which the Predictive Dialer is hosted is required. The Purchaser is responsible for Network Configuration, Antivirus, VPN, Router and Firewall, Installation, Configuration, and Setup. Agent IP information is required so Dialer knows which IP address to dial when the agent logs on. SIP Carrier testing is required. Minimum Requirements are subject to change at any time. Updates to this agreement will be posted on our website on the Terms & Conditions page.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](89, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](90, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](91, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](92, "Minimum Requirements for Dialer Server:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](93, " No Laptops. Specific Server requirements vary depending on the configuration of the dialer. Purchaser is responsible for network configuration & antivirus protection. Surge protector and/or battery backup is required. Dot net (.NET) 4.0 Framework is required for Enterprise software. Spitfire Enterprise comes with SQL Server 2008 R2 Express edition. This edition supports database sizes up to 10GB. If more storage capacity is required, Purchaser must purchase SQL Server 2008 R2 Standard edition or SQL Server 2012 Standard edition. Additional requirements can be found on website http://www.spitfiredialers.com/index.php/resources.html. * Server Requirements are subject to change at any time. Updates to this agreement will be posted on our website on the Terms & Conditions page.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](94, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](95, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](96, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](97, "Minimum Requirements for Agent Stations:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](98, " Agent station requirements can be found on our website http://www.spitfiredialers.com/index.php/resources.html ");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](99, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](100, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](101, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](102, "Technical Support:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](103, " Technical support is available Monday through Friday from 9 am to 6 p.m., CT. (These times are subject to change.) OPC MARKETING, INC will make every reasonable effort to resolve questions and problems on a timely basis, within the times listed above; however, OPC MARKETING, INC may not always be able to resolve every problem, nor respond to every call immediately. OPC MARKETING, INC and Purchaser each agree to pay for their own long distance calls placed to the other party for any assistance.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](104, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](105, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](106, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](107, "Support Contract:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](108, " One (1) year of technical support is included with the SpitFire Predictive Dialer purchase price. Thereafter, technical support is $200 per agent per year. It is Purchaser\u2019s option to renew Support. If Purchaser chooses to renew tech support, it is required that license for the total number of agents per system is purchased at time of renewing tech support. At the time of renewal, all updates and upgrades may be applied. SpitFire X Auto Dialer is $300 for 6 months of technical support. OPC Marketing\u2019s Technical Support agents will not be able to assist any customers with expired tech support contracts.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](109, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](110, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](111, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](112, "Particular Software to be provided to Purchaser:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](113, " See invoice for detailed equipment description.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](114, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](115, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](116, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](117, "SIP Service:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](118, " OPC MARKETING, Inc. is not responsible for any service fees provided by 3rd party SIP Companies. Purchaser is responsible for determining the cost of installation and the monthly rates of the necessary SIP service.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](119, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](120, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](121, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](122, "Shipping, Damage and Malfunctions:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](123, " OPC MARKETING, INC cannot be responsible for delays in shipping caused by the carrier, weather conditions, or strikes. Purchaser must cooperate with carrier for any insurance claims, and is responsible for noting any damage to shipment at time of delivery. Purchaser agrees to pay all shipping and insurance costs. On occasion, shipping may cause damage to the products. In addition, products occasionally become defective after working properly. OPC MARKETING, INC will repair or replace damaged or malfunctioning hardware and software at no charge, if within the warranty time limit and if there have been no modifications or misuse by the Purchaser. Purchaser must return any defective products prior to OPC MARKETING, INC shipping a replacement, or Purchaser must give a credit card number authorizing a charge if the defective product is not returned to OPC MARKETING, INC within 7 days.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](124, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](125, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](126, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](127, "Changes To System:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](128, " OPC MARKETING, INC cannot be responsible if Purchaser makes changes, misuses, or tampers with the software or hardware after Purchaser receives them. Any installation of other software or changes by Purchaser may void the warranty and Purchaser will be charged $295 reconfiguration fee. Static IP addresses are required for all SIP systems, any IP address changes after initial setup will incur $100 reconfiguration fee.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](129, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](130, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](131, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](132, "Backups:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](133, " Purchaser is responsible for making frequent backups of his or her system to protect against any loss of valuable data. OPC MARKETING, INC cannot be responsible for loss of data for any reason whatsoever.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](134, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](135, "li");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](136, "strong");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](137, "Entire Agreement:");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](138, " This Agreement constitutes the entire understanding and agreement of the parties with regard to the subject matter hereof and supersedes all prior and contemporaneous communications, understandings and agreements, either written or oral.");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????element"](139, "br");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](140, "div", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](141, "button", 7);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????listener"]("click", function DialogComponent_Template_button_click_141_listener() {
              return ctx.close();
            });

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](142, "Cancel");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementStart"](143, "button", 8);

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????listener"]("click", function DialogComponent_Template_button_click_143_listener() {
              return ctx.onAgree();
            });

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????text"](144, "Agree");

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_1__["????elementEnd"]();
          }
        },
        directives: [_angular_material_button__WEBPACK_IMPORTED_MODULE_3__["MatButton"]],
        styles: [".rounded2[_ngcontent-%COMP%] {\n  height: 460px;\n  overflow: auto;\n}\n\n.footer[_ngcontent-%COMP%] {\n  padding: 16px;\n  text-align: right;\n}\n\nli[_ngcontent-%COMP%] {\n  text-align: justify;\n  padding: 16px 24px 0 8px;\n}\n\n.dialog-header[_ngcontent-%COMP%] {\n  margin-bottom: 0 !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFwuLlxcZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsYUFBQTtFQUNBLGNBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7RUFDQSxpQkFBQTtBQUNGOztBQUVBO0VBQ0ksbUJBQUE7RUFDQSx3QkFBQTtBQUNKOztBQUVBO0VBQ0UsMkJBQUE7QUFDRiIsImZpbGUiOiJkaWFsb2cuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIucm91bmRlZDJ7XHJcbiAgaGVpZ2h0OiA0NjBweDtcclxuICBvdmVyZmxvdzogYXV0bztcclxufVxyXG5cclxuLmZvb3RlcntcclxuICBwYWRkaW5nOiAxNnB4O1xyXG4gIHRleHQtYWxpZ246IHJpZ2h0O1xyXG59XHJcblxyXG5saXtcclxuICAgIHRleHQtYWxpZ246IGp1c3RpZnk7XHJcbiAgICBwYWRkaW5nOiAxNnB4IDI0cHggMCA4cHg7XHJcbn1cclxuXHJcbi5kaWFsb2ctaGVhZGVye1xyXG4gIG1hcmdpbi1ib3R0b206IDAgIWltcG9ydGFudDtcclxufSJdfQ== */"]
      });
      /***/
    },

    /***/
    "6epW":
    /*!*********************************************!*\
      !*** ./src/app/auth/auth-routing.module.ts ***!
      \*********************************************/

    /*! exports provided: AuthRoutingModule */

    /***/
    function epW(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AuthRoutingModule", function () {
        return AuthRoutingModule;
      });
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var _auth_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./auth.component */
      "LS6v");
      /* harmony import */


      var _logout_logout_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./logout/logout.component */
      "iKpk");
      /* harmony import */


      var _login_login_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./login/login.component */
      "bsvf");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");

      var routes = [{
        path: '',
        component: _auth_component__WEBPACK_IMPORTED_MODULE_1__["AuthComponent"],
        children: [{
          path: '',
          component: _login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"]
        }, {
          path: 'logout',
          component: _logout_logout_component__WEBPACK_IMPORTED_MODULE_2__["LogoutComponent"]
        }]
      }];

      var AuthRoutingModule = function AuthRoutingModule() {
        _classCallCheck(this, AuthRoutingModule);
      };

      AuthRoutingModule.??fac = function AuthRoutingModule_Factory(t) {
        return new (t || AuthRoutingModule)();
      };

      AuthRoutingModule.??mod = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????defineNgModule"]({
        type: AuthRoutingModule
      });
      AuthRoutingModule.??inj = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????defineInjector"]({
        imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_4__["????setNgModuleScope"](AuthRoutingModule, {
          imports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]],
          exports: [_angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"]]
        });
      })();
      /***/

    },

    /***/
    "Dz+M":
    /*!********************************************************!*\
      !*** ./node_modules/rxjs/internal/scheduler/Action.js ***!
      \********************************************************/

    /*! no static exports found */

    /***/
    function DzM(module, exports, __webpack_require__) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var _extendStatics2 = function extendStatics(d, b) {
          _extendStatics2 = Object.setPrototypeOf || {
            __proto__: []
          } instanceof Array && function (d, b) {
            d.__proto__ = b;
          } || function (d, b) {
            for (var p in b) {
              if (b.hasOwnProperty(p)) d[p] = b[p];
            }
          };

          return _extendStatics2(d, b);
        };

        return function (d, b) {
          _extendStatics2(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var Subscription_1 = __webpack_require__(
      /*! ../Subscription */
      "zB/H");

      var Action = function (_super) {
        __extends(Action, _super);

        function Action(scheduler, work) {
          return _super.call(this) || this;
        }

        Action.prototype.schedule = function (state, delay) {
          if (delay === void 0) {
            delay = 0;
          }

          return this;
        };

        return Action;
      }(Subscription_1.Subscription);

      exports.Action = Action; //# sourceMappingURL=Action.js.map

      /***/
    },

    /***/
    "GMZp":
    /*!*****************************************************!*\
      !*** ./node_modules/rxjs/internal/util/isObject.js ***!
      \*****************************************************/

    /*! no static exports found */

    /***/
    function GMZp(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      function isObject(x) {
        return x !== null && typeof x === 'object';
      }

      exports.isObject = isObject; //# sourceMappingURL=isObject.js.map

      /***/
    },

    /***/
    "H0e8":
    /*!****************************************************************!*\
      !*** ./node_modules/rxjs/internal/scheduler/animationFrame.js ***!
      \****************************************************************/

    /*! no static exports found */

    /***/
    function H0e8(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var AnimationFrameAction_1 = __webpack_require__(
      /*! ./AnimationFrameAction */
      "O+eH");

      var AnimationFrameScheduler_1 = __webpack_require__(
      /*! ./AnimationFrameScheduler */
      "QY7M");

      exports.animationFrameScheduler = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);
      exports.animationFrame = exports.animationFrameScheduler; //# sourceMappingURL=animationFrame.js.map

      /***/
    },

    /***/
    "LBXl":
    /*!****************************************************************!*\
      !*** ./node_modules/rxjs/internal/util/UnsubscriptionError.js ***!
      \****************************************************************/

    /*! no static exports found */

    /***/
    function LBXl(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var UnsubscriptionErrorImpl = function () {
        function UnsubscriptionErrorImpl(errors) {
          Error.call(this);
          this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) {
            return i + 1 + ") " + err.toString();
          }).join('\n  ') : '';
          this.name = 'UnsubscriptionError';
          this.errors = errors;
          return this;
        }

        UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
        return UnsubscriptionErrorImpl;
      }();

      exports.UnsubscriptionError = UnsubscriptionErrorImpl; //# sourceMappingURL=UnsubscriptionError.js.map

      /***/
    },

    /***/
    "LS6v":
    /*!****************************************!*\
      !*** ./src/app/auth/auth.component.ts ***!
      \****************************************/

    /*! exports provided: AuthComponent */

    /***/
    function LS6v(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AuthComponent", function () {
        return AuthComponent;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var src_app_services_common_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! src/app/services/common.service */
      "OlR4");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");

      var AuthComponent = /*#__PURE__*/function () {
        function AuthComponent(CommonService) {
          _classCallCheck(this, AuthComponent);

          this.CommonService = CommonService;
        }

        _createClass(AuthComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {}
        }]);

        return AuthComponent;
      }();

      AuthComponent.??fac = function AuthComponent_Factory(t) {
        return new (t || AuthComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](src_app_services_common_service__WEBPACK_IMPORTED_MODULE_1__["CommonService"]));
      };

      AuthComponent.??cmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineComponent"]({
        type: AuthComponent,
        selectors: [["app-auth"]],
        decls: 1,
        vars: 0,
        template: function AuthComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????element"](0, "router-outlet");
          }
        },
        directives: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterOutlet"]],
        encapsulation: 2
      });
      /***/
    },

    /***/
    "NTcF":
    /*!****************************************************************!*\
      !*** ./node_modules/rxjs/internal/scheduler/AsyncScheduler.js ***!
      \****************************************************************/

    /*! no static exports found */

    /***/
    function NTcF(module, exports, __webpack_require__) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var _extendStatics3 = function extendStatics(d, b) {
          _extendStatics3 = Object.setPrototypeOf || {
            __proto__: []
          } instanceof Array && function (d, b) {
            d.__proto__ = b;
          } || function (d, b) {
            for (var p in b) {
              if (b.hasOwnProperty(p)) d[p] = b[p];
            }
          };

          return _extendStatics3(d, b);
        };

        return function (d, b) {
          _extendStatics3(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var Scheduler_1 = __webpack_require__(
      /*! ../Scheduler */
      "ffpz");

      var AsyncScheduler = function (_super) {
        __extends(AsyncScheduler, _super);

        function AsyncScheduler(SchedulerAction, now) {
          if (now === void 0) {
            now = Scheduler_1.Scheduler.now;
          }

          var _this = _super.call(this, SchedulerAction, function () {
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
              return AsyncScheduler.delegate.now();
            } else {
              return now();
            }
          }) || this;

          _this.actions = [];
          _this.active = false;
          _this.scheduled = undefined;
          return _this;
        }

        AsyncScheduler.prototype.schedule = function (work, delay, state) {
          if (delay === void 0) {
            delay = 0;
          }

          if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
            return AsyncScheduler.delegate.schedule(work, delay, state);
          } else {
            return _super.prototype.schedule.call(this, work, delay, state);
          }
        };

        AsyncScheduler.prototype.flush = function (action) {
          var actions = this.actions;

          if (this.active) {
            actions.push(action);
            return;
          }

          var error;
          this.active = true;

          do {
            if (error = action.execute(action.state, action.delay)) {
              break;
            }
          } while (action = actions.shift());

          this.active = false;

          if (error) {
            while (action = actions.shift()) {
              action.unsubscribe();
            }

            throw error;
          }
        };

        return AsyncScheduler;
      }(Scheduler_1.Scheduler);

      exports.AsyncScheduler = AsyncScheduler; //# sourceMappingURL=AsyncScheduler.js.map

      /***/
    },

    /***/
    "O+eH":
    /*!**********************************************************************!*\
      !*** ./node_modules/rxjs/internal/scheduler/AnimationFrameAction.js ***!
      \**********************************************************************/

    /*! no static exports found */

    /***/
    function OEH(module, exports, __webpack_require__) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var _extendStatics4 = function extendStatics(d, b) {
          _extendStatics4 = Object.setPrototypeOf || {
            __proto__: []
          } instanceof Array && function (d, b) {
            d.__proto__ = b;
          } || function (d, b) {
            for (var p in b) {
              if (b.hasOwnProperty(p)) d[p] = b[p];
            }
          };

          return _extendStatics4(d, b);
        };

        return function (d, b) {
          _extendStatics4(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var AsyncAction_1 = __webpack_require__(
      /*! ./AsyncAction */
      "2tF/");

      var AnimationFrameAction = function (_super) {
        __extends(AnimationFrameAction, _super);

        function AnimationFrameAction(scheduler, work) {
          var _this = _super.call(this, scheduler, work) || this;

          _this.scheduler = scheduler;
          _this.work = work;
          return _this;
        }

        AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
            delay = 0;
          }

          if (delay !== null && delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
          }

          scheduler.actions.push(this);
          return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () {
            return scheduler.flush(null);
          }));
        };

        AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
          if (delay === void 0) {
            delay = 0;
          }

          if (delay !== null && delay > 0 || delay === null && this.delay > 0) {
            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
          }

          if (scheduler.actions.length === 0) {
            cancelAnimationFrame(id);
            scheduler.scheduled = undefined;
          }

          return undefined;
        };

        return AnimationFrameAction;
      }(AsyncAction_1.AsyncAction);

      exports.AnimationFrameAction = AnimationFrameAction; //# sourceMappingURL=AnimationFrameAction.js.map

      /***/
    },

    /***/
    "QY7M":
    /*!*************************************************************************!*\
      !*** ./node_modules/rxjs/internal/scheduler/AnimationFrameScheduler.js ***!
      \*************************************************************************/

    /*! no static exports found */

    /***/
    function QY7M(module, exports, __webpack_require__) {
      "use strict";

      var __extends = this && this.__extends || function () {
        var _extendStatics5 = function extendStatics(d, b) {
          _extendStatics5 = Object.setPrototypeOf || {
            __proto__: []
          } instanceof Array && function (d, b) {
            d.__proto__ = b;
          } || function (d, b) {
            for (var p in b) {
              if (b.hasOwnProperty(p)) d[p] = b[p];
            }
          };

          return _extendStatics5(d, b);
        };

        return function (d, b) {
          _extendStatics5(d, b);

          function __() {
            this.constructor = d;
          }

          d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
      }();

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var AsyncScheduler_1 = __webpack_require__(
      /*! ./AsyncScheduler */
      "NTcF");

      var AnimationFrameScheduler = function (_super) {
        __extends(AnimationFrameScheduler, _super);

        function AnimationFrameScheduler() {
          return _super !== null && _super.apply(this, arguments) || this;
        }

        AnimationFrameScheduler.prototype.flush = function (action) {
          this.active = true;
          this.scheduled = undefined;
          var actions = this.actions;
          var error;
          var index = -1;
          var count = actions.length;
          action = action || actions.shift();

          do {
            if (error = action.execute(action.state, action.delay)) {
              break;
            }
          } while (++index < count && (action = actions.shift()));

          this.active = false;

          if (error) {
            while (++index < count && (action = actions.shift())) {
              action.unsubscribe();
            }

            throw error;
          }
        };

        return AnimationFrameScheduler;
      }(AsyncScheduler_1.AsyncScheduler);

      exports.AnimationFrameScheduler = AnimationFrameScheduler; //# sourceMappingURL=AnimationFrameScheduler.js.map

      /***/
    },

    /***/
    "Yj9t":
    /*!*************************************!*\
      !*** ./src/app/auth/auth.module.ts ***!
      \*************************************/

    /*! exports provided: AuthModule */

    /***/
    function Yj9t(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "AuthModule", function () {
        return AuthModule;
      });
      /* harmony import */


      var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/common */
      "ofXK");
      /* harmony import */


      var _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./auth-routing.module */
      "6epW");
      /* harmony import */


      var _auth_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./auth.component */
      "LS6v");
      /* harmony import */


      var _logout_logout_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./logout/logout.component */
      "iKpk");
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/forms */
      "3Pt+");
      /* harmony import */


      var _angular_material_input__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! @angular/material/input */
      "qFsG");
      /* harmony import */


      var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! @angular/material/button */
      "bTqV");
      /* harmony import */


      var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
      /*! @angular/material/grid-list */
      "zkoq");
      /* harmony import */


      var _angular_material_card__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
      /*! @angular/material/card */
      "Wp6s");
      /* harmony import */


      var _login_login_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
      /*! ./login/login.component */
      "bsvf");
      /* harmony import */


      var _angular_common_http__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
      /*! @angular/common/http */
      "tk/3");
      /* harmony import */


      var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
      /*! @angular/material/progress-bar */
      "bv9b");
      /* harmony import */


      var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
      /*! @angular/material/checkbox */
      "bSwM");
      /* harmony import */


      var _ciri_ngx_carousel__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
      /*! @ciri/ngx-carousel */
      "k0Pq");
      /* harmony import */


      var _login_dialog_dialog_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
      /*! ./login/dialog/dialog.component */
      "4Zwr");
      /* harmony import */


      var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(
      /*! @angular/material/dialog */
      "0IaG");
      /* harmony import */


      var ngx_captcha__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(
      /*! ngx-captcha */
      "sjCC");
      /* harmony import */


      var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(
      /*! @angular/material/snack-bar */
      "dNgK");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");

      var AuthModule = function AuthModule() {
        _classCallCheck(this, AuthModule);
      };

      AuthModule.??fac = function AuthModule_Factory(t) {
        return new (t || AuthModule)();
      };

      AuthModule.??mod = _angular_core__WEBPACK_IMPORTED_MODULE_18__["????defineNgModule"]({
        type: AuthModule
      });
      AuthModule.??inj = _angular_core__WEBPACK_IMPORTED_MODULE_18__["????defineInjector"]({
        imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__["AuthRoutingModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"], _angular_material_input__WEBPACK_IMPORTED_MODULE_5__["MatInputModule"], _angular_material_button__WEBPACK_IMPORTED_MODULE_6__["MatButtonModule"], _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_7__["MatGridListModule"], _angular_material_card__WEBPACK_IMPORTED_MODULE_8__["MatCardModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_10__["HttpClientModule"], _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_11__["MatProgressBarModule"], _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_12__["MatCheckboxModule"], _ciri_ngx_carousel__WEBPACK_IMPORTED_MODULE_13__["CarouselModule"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_15__["MatDialogModule"], ngx_captcha__WEBPACK_IMPORTED_MODULE_16__["NgxCaptchaModule"], _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__["MatSnackBarModule"]]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_18__["????setNgModuleScope"](AuthModule, {
          declarations: [_auth_component__WEBPACK_IMPORTED_MODULE_2__["AuthComponent"], _logout_logout_component__WEBPACK_IMPORTED_MODULE_3__["LogoutComponent"], _login_login_component__WEBPACK_IMPORTED_MODULE_9__["LoginComponent"], _login_dialog_dialog_component__WEBPACK_IMPORTED_MODULE_14__["DialogComponent"]],
          imports: [_angular_common__WEBPACK_IMPORTED_MODULE_0__["CommonModule"], _auth_routing_module__WEBPACK_IMPORTED_MODULE_1__["AuthRoutingModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"], _angular_material_input__WEBPACK_IMPORTED_MODULE_5__["MatInputModule"], _angular_material_button__WEBPACK_IMPORTED_MODULE_6__["MatButtonModule"], _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_7__["MatGridListModule"], _angular_material_card__WEBPACK_IMPORTED_MODULE_8__["MatCardModule"], _angular_common_http__WEBPACK_IMPORTED_MODULE_10__["HttpClientModule"], _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_11__["MatProgressBarModule"], _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_12__["MatCheckboxModule"], _ciri_ngx_carousel__WEBPACK_IMPORTED_MODULE_13__["CarouselModule"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_15__["MatDialogModule"], ngx_captcha__WEBPACK_IMPORTED_MODULE_16__["NgxCaptchaModule"], _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__["MatSnackBarModule"]]
        });
      })();
      /***/

    },

    /***/
    "bsvf":
    /*!***********************************************!*\
      !*** ./src/app/auth/login/login.component.ts ***!
      \***********************************************/

    /*! exports provided: LoginComponent */

    /***/
    function bsvf(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "LoginComponent", function () {
        return LoginComponent;
      });
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/forms */
      "3Pt+");
      /* harmony import */


      var _dialog_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! ./dialog/dialog.component */
      "4Zwr");
      /* harmony import */


      var src_app_pages_dialogs_delete_delete_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! src/app/pages/dialogs/delete/delete.component */
      "bGBl");
      /* harmony import */


      var _services_config_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! ./../../services/config.service */
      "r4Kj");
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! @angular/router */
      "tyNb");
      /* harmony import */


      var _services_login_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! ./../../services/login.service */
      "EFyh");
      /* harmony import */


      var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
      /*! @angular/material/dialog */
      "0IaG");
      /* harmony import */


      var src_app_services_common_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
      /*! src/app/services/common.service */
      "OlR4");
      /* harmony import */


      var src_app_services_shared_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
      /*! src/app/services/shared.service */
      "zuHl");
      /* harmony import */


      var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
      /*! @angular/material/snack-bar */
      "dNgK");
      /* harmony import */


      var src_app_services_settings_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
      /*! src/app/services/settings.service */
      "6nr9");
      /* harmony import */


      var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
      /*! @angular/common */
      "ofXK");
      /* harmony import */


      var _angular_material_card__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
      /*! @angular/material/card */
      "Wp6s");
      /* harmony import */


      var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
      /*! @angular/material/progress-bar */
      "bv9b");
      /* harmony import */


      var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(
      /*! @angular/material/form-field */
      "kmnG");
      /* harmony import */


      var _angular_material_input__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(
      /*! @angular/material/input */
      "qFsG");
      /* harmony import */


      var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(
      /*! @angular/material/checkbox */
      "bSwM");
      /* harmony import */


      var ngx_captcha__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(
      /*! ngx-captcha */
      "sjCC");
      /* harmony import */


      var _angular_material_button__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(
      /*! @angular/material/button */
      "bTqV");

      function LoginComponent_mat_progress_bar_1_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????element"](0, "mat-progress-bar", 12);
        }
      }

      function LoginComponent_div_12_span_9_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Required");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_12_span_10_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Invalid");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_12_span_16_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Required");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_12_span_17_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Incorrect Password!");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_12_span_26_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "span", 31);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Required");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_12_mat_error_30_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "mat-error", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }

        if (rf & 2) {
          var ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????textInterpolate"](ctx_r10.errorMessage);
        }
      }

      function LoginComponent_div_12_Template(rf, ctx) {
        if (rf & 1) {
          var _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????getCurrentView"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "div", 13);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](1, "form", 14);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????listener"]("ngSubmit", function LoginComponent_div_12_Template_form_ngSubmit_1_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????restoreView"](_r12);

            var ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"]();

            return ctx_r11.onSubmit();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](2, "h3", 15);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](3, "Account Login");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](4, "mat-form-field", 16);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](5, "mat-label");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](6, "Username");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????element"](7, "input", 17);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](8, "mat-error");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](9, LoginComponent_div_12_span_9_Template, 2, 0, "span", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](10, LoginComponent_div_12_span_10_Template, 2, 0, "span", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](11, "mat-form-field", 16);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](12, "mat-label");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](13, "Password");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????element"](14, "input", 19);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](15, "mat-error");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](16, LoginComponent_div_12_span_16_Template, 2, 0, "span", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](17, LoginComponent_div_12_span_17_Template, 2, 0, "span", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](18, "div", 20);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](19, "a", 21);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????listener"]("click", function LoginComponent_div_12_Template_a_click_19_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????restoreView"](_r12);

            var ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"]();

            return ctx_r13.forgotPassword();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](20, "Forgot Password?");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](21, "div", 22);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](22, "a", 23);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????listener"]("click", function LoginComponent_div_12_Template_a_click_22_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????restoreView"](_r12);

            var ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"]();

            return ctx_r14.openDialog();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](23, "SpitFire Compliance Agreement");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](24, "mat-checkbox", 24);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????listener"]("change", function LoginComponent_div_12_Template_mat_checkbox_change_24_listener($event) {
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????restoreView"](_r12);

            var ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"]();

            return ctx_r15.checkstate($event);
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](25, "I have read and agree with the Agreement");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](26, LoginComponent_div_12_span_26_Template, 2, 0, "span", 25);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????element"](27, "ngx-recaptcha2", 26, 27);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](29, "div", 28);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](30, LoginComponent_div_12_mat_error_30_Template, 2, 1, "mat-error", 29);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](31, "button", 30);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](32, "Login");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }

        if (rf & 2) {
          var ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"]();

          var tmp_1_0 = null;
          var tmp_2_0 = null;
          var tmp_3_0 = null;
          var tmp_4_0 = null;
          var tmp_5_0 = null;

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("formGroup", ctx_r1.loginForm);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](8);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ((tmp_1_0 = ctx_r1.loginForm.get("username")) == null ? null : tmp_1_0.invalid) && !((tmp_1_0 = ctx_r1.loginForm.get("username")) == null ? null : tmp_1_0.value));

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ((tmp_2_0 = ctx_r1.loginForm.get("username")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx_r1.loginForm.get("username")) == null ? null : tmp_2_0.value));

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](6);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ((tmp_3_0 = ctx_r1.loginForm.get("password")) == null ? null : tmp_3_0.invalid) && !((tmp_3_0 = ctx_r1.loginForm.get("password")) == null ? null : tmp_3_0.value));

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ((tmp_4_0 = ctx_r1.loginForm.get("password")) == null ? null : tmp_4_0.errors) && ctx_r1.incorectPassword && ((tmp_4_0 = ctx_r1.loginForm.get("password")) == null ? null : tmp_4_0.value));

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](9);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", !((tmp_5_0 = ctx_r1.loginForm.get("agreement")) == null ? null : tmp_5_0.value) && ctx_r1.isSubmit);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("siteKey", ctx_r1.siteKey);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ctx_r1.isError);
        }
      }

      function LoginComponent_div_13_mat_form_field_4_span_5_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Required");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_13_mat_form_field_4_span_6_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Invalid");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_13_mat_form_field_4_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "mat-form-field", 16);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](1, "mat-label");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](2, "Username");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????element"](3, "input", 17);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](4, "mat-error");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](5, LoginComponent_div_13_mat_form_field_4_span_5_Template, 2, 0, "span", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](6, LoginComponent_div_13_mat_form_field_4_span_6_Template, 2, 0, "span", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }

        if (rf & 2) {
          var ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"](2);

          var tmp_0_0 = null;
          var tmp_1_0 = null;

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](5);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ((tmp_0_0 = ctx_r16.forgotForm.get("username")) == null ? null : tmp_0_0.invalid) && !((tmp_0_0 = ctx_r16.forgotForm.get("username")) == null ? null : tmp_0_0.value));

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ((tmp_1_0 = ctx_r16.forgotForm.get("username")) == null ? null : tmp_1_0.invalid) && ((tmp_1_0 = ctx_r16.forgotForm.get("username")) == null ? null : tmp_1_0.value));
        }
      }

      function LoginComponent_div_13_mat_form_field_5_span_5_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Required");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_13_mat_form_field_5_span_6_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Invalid");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_13_mat_form_field_5_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "mat-form-field", 16);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](1, "mat-label");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](2, "Secret Question");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????element"](3, "input", 35);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](4, "mat-error");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](5, LoginComponent_div_13_mat_form_field_5_span_5_Template, 2, 0, "span", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](6, LoginComponent_div_13_mat_form_field_5_span_6_Template, 2, 0, "span", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }

        if (rf & 2) {
          var ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"](2);

          var tmp_1_0 = null;
          var tmp_2_0 = null;

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("readonly", true);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ((tmp_1_0 = ctx_r17.forgotForm.get("question")) == null ? null : tmp_1_0.invalid) && !((tmp_1_0 = ctx_r17.forgotForm.get("question")) == null ? null : tmp_1_0.value));

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ((tmp_2_0 = ctx_r17.forgotForm.get("question")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx_r17.forgotForm.get("question")) == null ? null : tmp_2_0.value));
        }
      }

      function LoginComponent_div_13_button_6_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "button", 30);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Get Secret Question");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_13_mat_form_field_8_span_5_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Required");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_13_mat_form_field_8_span_6_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "span");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Invalid");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_13_mat_form_field_8_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "mat-form-field", 16);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](1, "mat-label");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](2, "Answer");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????element"](3, "input", 36);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](4, "mat-error");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](5, LoginComponent_div_13_mat_form_field_8_span_5_Template, 2, 0, "span", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](6, LoginComponent_div_13_mat_form_field_8_span_6_Template, 2, 0, "span", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }

        if (rf & 2) {
          var ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"](2);

          var tmp_0_0 = null;
          var tmp_1_0 = null;

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](5);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ((tmp_0_0 = ctx_r19.verifytForm.get("answer")) == null ? null : tmp_0_0.invalid) && !((tmp_0_0 = ctx_r19.verifytForm.get("answer")) == null ? null : tmp_0_0.value));

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ((tmp_1_0 = ctx_r19.verifytForm.get("answer")) == null ? null : tmp_1_0.invalid) && ((tmp_1_0 = ctx_r19.verifytForm.get("answer")) == null ? null : tmp_1_0.value));
        }
      }

      function LoginComponent_div_13_button_9_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "button", 30);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](1, "Verify Answer");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }
      }

      function LoginComponent_div_13_Template(rf, ctx) {
        if (rf & 1) {
          var _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????getCurrentView"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "div", 13);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](1, "form", 14);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????listener"]("ngSubmit", function LoginComponent_div_13_Template_form_ngSubmit_1_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????restoreView"](_r28);

            var ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"]();

            return ctx_r27.onForgotSubmit();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](2, "h3", 15);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](3, "Forgot Password");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](4, LoginComponent_div_13_mat_form_field_4_Template, 7, 2, "mat-form-field", 32);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](5, LoginComponent_div_13_mat_form_field_5_Template, 7, 3, "mat-form-field", 32);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](6, LoginComponent_div_13_button_6_Template, 2, 0, "button", 33);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](7, "form", 14);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????listener"]("ngSubmit", function LoginComponent_div_13_Template_form_ngSubmit_7_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????restoreView"](_r28);

            var ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"]();

            return ctx_r29.onVerifySubmit();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](8, LoginComponent_div_13_mat_form_field_8_Template, 7, 2, "mat-form-field", 32);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](9, LoginComponent_div_13_button_9_Template, 2, 0, "button", 33);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](10, "button", 34);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????listener"]("click", function LoginComponent_div_13_Template_button_click_10_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????restoreView"](_r28);

            var ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"]();

            return ctx_r30.backToLogin();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](11, "Back");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }

        if (rf & 2) {
          var ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("formGroup", ctx_r2.forgotForm);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", !ctx_r2.isForgotSubmit);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ctx_r2.isForgotSubmit);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", !ctx_r2.isForgotSubmit);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("formGroup", ctx_r2.verifytForm);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ctx_r2.isForgotSubmit);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ctx_r2.isForgotSubmit);
        }
      }

      function LoginComponent_div_14_Template(rf, ctx) {
        if (rf & 1) {
          var _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????getCurrentView"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "div", 13);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](1, "div", 37);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](2, "p", 38);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](4, "button", 39);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????listener"]("click", function LoginComponent_div_14_Template_button_click_4_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????restoreView"](_r32);

            var ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"]();

            return ctx_r31.backToLogin();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](5, "Login");

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
        }

        if (rf & 2) {
          var ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????nextContext"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_4__["????textInterpolate1"](" ", ctx_r3.password, " ");
        }
      }

      var LoginComponent = /*#__PURE__*/function () {
        function LoginComponent(router, loginService, dialog, formBuilder, CommonService, sharedService, _snackBar, settingsService) {
          _classCallCheck(this, LoginComponent);

          this.router = router;
          this.loginService = loginService;
          this.dialog = dialog;
          this.formBuilder = formBuilder;
          this.CommonService = CommonService;
          this.sharedService = sharedService;
          this._snackBar = _snackBar;
          this.settingsService = settingsService;
          this.isSubmit = false;
          this.isLoading = false;
          this.isVerifySubmit = false;
          this.isLoginPage = true;
          this.isForgotSubmit = false;
          this.isError = false;
          this.errorMessage = '';
          this.incorectPassword = false;
          this.checked = false;
          this.isForgot = false;
          this.siteKey = _services_config_service__WEBPACK_IMPORTED_MODULE_3__["appConfig"].captchaKey;
          this.setting = {
            allAccess: false,
            callbackAccess: false,
            chatAccess: false,
            cloneAccess: false,
            createCampaign: false,
            createUser: false,
            dncMgmt: false,
            editCampaign: false,
            exportHistory: false,
            groupAccess: false,
            importDNC: false,
            importList: false,
            listMgmt: false,
            reportAccess: false,
            reworkAccess: false,
            supervisorAccess: false,
            userAccess: false,
            viewHistory: false
          };
          this.message = '';
          this.loginForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroup"]({
            username: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required]),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required]),
            appType: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"](4, [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required]),
            agreement: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"](false),
            keepLogin: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"](false),
            recaptcha: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required])
          });
          this.forgotForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroup"]({
            username: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required]),
            question: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('')
          });
          this.verifytForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroup"]({
            answer: new _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required])
          });
        }

        _createClass(LoginComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {
            var _this2 = this;

            this.subscription = this.sharedService.currentMessage.subscribe(function (message) {
              if (message) {
                _this2.message = message;

                _this2.showSnackBar(message, true);
              }
            }); // this.configService.getJSON().subscribe(data => {
            //   this.siteKey = data.captchaKey
            //   console.log(data.captchaKey, "from Config file");
            // });
            // this.config = this.configService.loadJSON("./assets/config.json")
            // console.log(this.config, "from Config file");
          }
        }, {
          key: "onSubmit",
          value: function onSubmit() {
            var _this3 = this;

            this.isSubmit = true;
            if (!this.loginForm.value.agreement) return;

            if (this.loginForm.valid) {
              this.isLoading = true;
              this.CommonService.setData("setting", JSON.stringify(this.setting));
              this.loginService.login(this.loginForm.value).subscribe(function (res) {
                _this3.isLoading = false;
                _this3.isSubmit = false;
                console.log(res);

                if (res.loginResult.result === 'Success') {
                  _this3.CommonService.setData("allowedRole", res.loginResult.allowedRole);

                  _this3.CommonService.setData("customerID", res.loginResult.customerID);

                  _this3.CommonService.setData("encryptedTicket", res.loginResult.encryptedTicket);

                  _this3.CommonService.setData("accessToken", res.loginResult.accessToken);

                  _this3.CommonService.setData("refreshToken", res.loginResult.refreshToken);

                  _this3.CommonService.setData("hmpServicePath", res.loginResult.hmpServicePath);

                  _this3.CommonService.setData("userID", res.loginResult.userID);

                  _this3.registerClient();
                }

                if (res.loginResult.result === 'Error') {
                  _this3.isLoading = false;
                  _this3.isError = true;
                  _this3.errorMessage = "Incorrect Username or Password";
                  setTimeout(function () {
                    _this3.isError = false;
                  }, 4000);
                }

                if (res.loginResult.result === 'Failed') {
                  _this3.isLoading = false;
                  _this3.incorectPassword = true;

                  _this3.loginForm.controls['password'].setErrors({
                    invalid: true
                  });
                }
              }, function (err) {
                _this3.isLoading = false;
                _this3.isError = true;
                setTimeout(function () {
                  _this3.isError = false;
                }, 4000);
                _this3.errorMessage = "Service Issue, Contact Support";
              });
            }
          }
        }, {
          key: "onForgotSubmit",
          value: function onForgotSubmit() {
            var _this4 = this;

            if (this.forgotForm.valid) {
              var obj = {
                userName: this.forgotForm.value.username,
                secretAnswer: ''
              };
              this.loginService.getSecretQuestion(obj).subscribe(function (res) {
                _this4.isForgotSubmit = true;

                _this4.forgotForm.patchValue({
                  question: res.baseResult
                });
              }, function (err) {
                console.log(err);
              });
            }
          }
        }, {
          key: "onVerifySubmit",
          value: function onVerifySubmit() {
            var _this5 = this;

            if (this.verifytForm.valid) {
              var obj = {
                userName: this.forgotForm.value.username,
                secretAnswer: this.verifytForm.value.answer
              };
              this.loginService.verifySecretAnswer(obj).subscribe(function (res) {
                _this5.isVerifySubmit = true;
                _this5.isForgotSubmit = false;
                _this5.isForgot = false;
                _this5.isLoginPage = false;
                _this5.password = res.baseResult;
              }, function (err) {
                console.log(err);
              });
            }
          }
        }, {
          key: "registerClient",
          value: function registerClient() {
            var _this6 = this;

            var type = 'Manager';
            if (this.CommonService.getData("allowedRole") == 16) type = "Admin";
            var obj = {
              customerID: this.CommonService.getData("customerID"),
              userID: this.CommonService.getData("userID"),
              userType: type,
              encryptedTicket: this.CommonService.getData("encryptedTicket")
            };
            console.log(obj, "registerClient object");
            this.loginService.registerClient(obj).subscribe(function (res) {
              console.log(res, "registerClient response");

              if (res.baseResult.result === 'Success') {
                _this6.user = res.baseResult.user;
                delete _this6.user.password;

                _this6.CommonService.setData("isOnline", true);

                _this6.CommonService.setData("user", JSON.stringify(_this6.user));

                _this6.CommonService.setData("setting", JSON.stringify(res.baseResult.setting));

                _this6.getExportFolder();

                if (res.baseResult.setting.supervisorAccess) _this6.registerSupervisor();

                _this6.router.navigateByUrl('/pages');
              } else {
                console.log(res.baseResult.result); // error message will be on screen
                // this.loginService.redirect();

                _this6.CommonService.clearStorage(); /// Show Error Message


                _this6.showMessage();
              }
            }, function (err) {
              console.log(err);
            });
          }
        }, {
          key: "registerSupervisor",
          value: function registerSupervisor() {
            var obj = {
              customerID: this.CommonService.getData("customerID"),
              userID: this.CommonService.getData("userID")
            };
            this.loginService.registerSupervisor(obj).subscribe(function (res) {
              console.log(res);
            }, function (err) {
              console.log(err);
            });
          }
        }, {
          key: "checkstate",
          value: function checkstate(event) {
            var _a, _b, _c;

            if (!event.checked) {
              (_a = this.loginForm.controls["agreement"]) === null || _a === void 0 ? void 0 : _a.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required);
            } else {
              (_b = this.loginForm.controls["agreement"]) === null || _b === void 0 ? void 0 : _b.clearValidators();
            }

            (_c = this.loginForm.controls["agreement"]) === null || _c === void 0 ? void 0 : _c.updateValueAndValidity();
          }
        }, {
          key: "forgotPassword",
          value: function forgotPassword() {
            this.isForgot = true;
            this.isLoginPage = false;
          }
        }, {
          key: "backToLogin",
          value: function backToLogin() {
            this.isVerifySubmit = false;
            this.isForgotSubmit = false;
            this.isForgot = false;
            this.isLoginPage = true;
            this.isSubmit = false;
          }
        }, {
          key: "openDialog",
          value: function openDialog() {
            var _this7 = this;

            var dialogRef = this.dialog.open(_dialog_dialog_component__WEBPACK_IMPORTED_MODULE_1__["DialogComponent"], {
              width: '700px',
              height: 'auto',
              data: {
                ss: "jj"
              }
            });
            dialogRef.afterClosed().subscribe(function (res) {
              if (res === 'yes') {
                _this7.loginForm.patchValue({
                  agreement: true
                });
              } else {
                _this7.loginForm.patchValue({
                  agreement: false
                });
              }
            });
          }
        }, {
          key: "resolved",
          value: function resolved(captchaResponse) {
            console.log("Resolved captcha with response: ".concat(captchaResponse));
          }
        }, {
          key: "ngOnDestroy",
          value: function ngOnDestroy() {
            this.subscription.unsubscribe();
          }
        }, {
          key: "showSnackBar",
          value: function showSnackBar(message, error) {
            var status = [];
            if (error === true) status = ['mat-toolbar', 'mat-warn'];

            this._snackBar.open(message, '', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 6000,
              panelClass: status
            });
          }
        }, {
          key: "showMessage",
          value: function showMessage() {
            var _this8 = this;

            var dialogRef = this.dialog.open(src_app_pages_dialogs_delete_delete_component__WEBPACK_IMPORTED_MODULE_2__["DialogDeleteComponent"], {
              width: '300px',
              height: 'auto',
              data: {
                text: "Duplicate Logins Detected.",
                event: "login"
              }
            });
            dialogRef.afterClosed().subscribe(function (result) {
              _this8.onSubmit();
            });
          }
        }, {
          key: "getExportFolder",
          value: function getExportFolder() {
            var _this9 = this;

            var obj = {
              customerID: +this.CommonService.getData('customerID'),
              userID: +this.CommonService.getData('userID')
            };
            this.settingsService.getCustomer(obj).subscribe(function (res) {
              _this9.CommonService.setData("exportFolder", res.baseResult.customerSettings.exportFolder);
            }, function (err) {
              _this9.isLoading = false;
              console.log(err);
            });
          }
        }]);

        return LoginComponent;
      }();

      LoginComponent.??fac = function LoginComponent_Factory(t) {
        return new (t || LoginComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["????directiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["????directiveInject"](_services_login_service__WEBPACK_IMPORTED_MODULE_6__["LoginService"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["????directiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_7__["MatDialog"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["????directiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormBuilder"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["????directiveInject"](src_app_services_common_service__WEBPACK_IMPORTED_MODULE_8__["CommonService"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["????directiveInject"](src_app_services_shared_service__WEBPACK_IMPORTED_MODULE_9__["SharedService"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["????directiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_10__["MatSnackBar"]), _angular_core__WEBPACK_IMPORTED_MODULE_4__["????directiveInject"](src_app_services_settings_service__WEBPACK_IMPORTED_MODULE_11__["SettingsService"]));
      };

      LoginComponent.??cmp = _angular_core__WEBPACK_IMPORTED_MODULE_4__["????defineComponent"]({
        type: LoginComponent,
        selectors: [["app-login"]],
        decls: 15,
        vars: 4,
        consts: [[1, "page-wrapper"], ["mode", "indeterminate", "style", "position: fixed; top: 0; width: 100%; z-index: 99;", 4, "ngIf"], [1, "login", "center"], [1, "login-card"], [1, "slider"], ["width", "100%", "autoplay", "", "loop", "", "id", "myVideo"], ["src", "assets/videos/world_full.mp4", "type", "video/mp4"], [1, "landing-form"], [2, "width", "80%"], [1, "center"], ["src", "assets/img/logo.png", 1, "menu-icon", "logo-icon"], ["style", "min-height: 346px;", 4, "ngIf"], ["mode", "indeterminate", 2, "position", "fixed", "top", "0", "width", "100%", "z-index", "99"], [2, "min-height", "346px"], ["novalidate", "", 3, "formGroup", "ngSubmit"], [1, "form-heading"], [1, "full-width"], ["matInput", "", "formControlName", "username"], [4, "ngIf"], ["type", "password", "matInput", "", "formControlName", "password"], [1, "space-between"], [1, "forgot-password", 3, "click"], [1, "agreement"], [1, "agree", 3, "click"], ["formControlName", "agreement", 1, "agree", 3, "change"], ["class", "error", 4, "ngIf"], ["formControlName", "recaptcha", 3, "siteKey"], ["captchaElem", ""], [2, "margin", "16px"], ["class", "center", 4, "ngIf"], ["type", "submit", "mat-raised-button", "", "color", "primary", 1, "login-btn"], [1, "error"], ["class", "full-width", 4, "ngIf"], ["class", "login-btn", "type", "submit", "mat-raised-button", "", "color", "primary", 4, "ngIf"], ["mat-flat-button", "", 1, "back-to-login", 3, "click"], ["matInput", "", "formControlName", "question", 3, "readonly"], ["matInput", "", "formControlName", "answer"], [2, "padding-top", "20px"], [2, "color", "#00467A", "font-size", "15px"], ["mat-flat-button", "", "color", "primary", 3, "click"]],
        template: function LoginComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](0, "div", 0);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](1, LoginComponent_mat_progress_bar_1_Template, 1, 0, "mat-progress-bar", 1);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](2, "div", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](3, "mat-card", 3);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](4, "div", 4);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](5, "video", 5);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????element"](6, "source", 6);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????text"](7, " Your browser does not support the video tag. ");

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](8, "div", 7);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](9, "div", 8);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementStart"](10, "div", 9);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????element"](11, "img", 10);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](12, LoginComponent_div_12_Template, 33, 8, "div", 11);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](13, LoginComponent_div_13_Template, 12, 7, "div", 11);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????template"](14, LoginComponent_div_14_Template, 6, 1, "div", 11);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????elementEnd"]();
          }

          if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ctx.isLoading);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](11);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ctx.isLoginPage);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ctx.isForgot);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????advance"](1);

            _angular_core__WEBPACK_IMPORTED_MODULE_4__["????property"]("ngIf", ctx.isVerifySubmit);
          }
        },
        directives: [_angular_common__WEBPACK_IMPORTED_MODULE_12__["NgIf"], _angular_material_card__WEBPACK_IMPORTED_MODULE_13__["MatCard"], _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_14__["MatProgressBar"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["??angular_packages_forms_forms_ba"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroupDirective"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__["MatLabel"], _angular_material_input__WEBPACK_IMPORTED_MODULE_16__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControlName"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_15__["MatError"], _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_17__["MatCheckbox"], ngx_captcha__WEBPACK_IMPORTED_MODULE_18__["ReCaptcha2Component"], _angular_material_button__WEBPACK_IMPORTED_MODULE_19__["MatButton"]],
        styles: [".login-card[_ngcontent-%COMP%] {\n  width: 100%;\n  margin: 0 auto;\n  padding: 0;\n  display: flex;\n  height: 100vh;\n}\n\n.login-form[_ngcontent-%COMP%] {\n  margin-top: 40px;\n  padding: 40px;\n}\n\n.slider[_ngcontent-%COMP%] {\n  position: relative;\n  background-color: #02C0F3;\n  width: 65%;\n}\n\n.demo-content[_ngcontent-%COMP%] {\n  height: 100vh;\n  width: 100%;\n}\n\n.login[_ngcontent-%COMP%] {\n  height: 100vh;\n}\n\n.card-footer[_ngcontent-%COMP%] {\n  background-color: #f1f5f8;\n  padding: 16px;\n}\n\n.card-footer[_ngcontent-%COMP%]   div[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.logo[_ngcontent-%COMP%] {\n  padding: 30px;\n}\n\n.logo-icon[_ngcontent-%COMP%] {\n  width: 300px;\n  margin-bottom: 30px;\n}\n\n.card-footer[_ngcontent-%COMP%] {\n  text-align: right;\n}\n\n.mat-progress-bar[_ngcontent-%COMP%] {\n  position: fixed;\n}\n\na[_ngcontent-%COMP%] {\n  color: #000;\n  text-decoration: none;\n}\n\n.space-between[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n  margin-top: 16px;\n}\n\n.form-heading[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n  font-family: poppins-medium !important;\n  text-align: left;\n  cursor: pointer;\n}\n\n.mat-raised-button[_ngcontent-%COMP%], .mat-flat-button[_ngcontent-%COMP%] {\n  min-width: 100px !important;\n  line-height: 36px !important;\n}\n\n.agree[_ngcontent-%COMP%], .forgot-password[_ngcontent-%COMP%], .back-to-login[_ngcontent-%COMP%] {\n  color: #00467A;\n  font-family: poppins-medium !important;\n  cursor: pointer;\n}\n\n.back-to-login[_ngcontent-%COMP%] {\n  margin-top: 16px;\n}\n\n.agreement[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: baseline;\n  margin: 12px 0 0;\n  min-height: 70px;\n}\n\n.agreement[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  margin-bottom: 12px;\n}\n\n.landing-form[_ngcontent-%COMP%] {\n  width: 35%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.custom-indicator[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  padding: 0 10px;\n  background: rgba(0, 0, 0, 0.3);\n  color: #fff;\n}\n\n#myVideo[_ngcontent-%COMP%] {\n  object-fit: fill;\n  position: absolute;\n  right: 0;\n  bottom: 0;\n  min-width: 100%;\n  min-height: 100%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFxsb2dpbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLFdBQUE7RUFDQSxjQUFBO0VBQ0EsVUFBQTtFQUNBLGFBQUE7RUFDQSxhQUFBO0FBQ0o7O0FBRUE7RUFDSSxnQkFBQTtFQUNBLGFBQUE7QUFDSjs7QUFFQTtFQUNJLGtCQUFBO0VBRUEseUJBQUE7RUFDQSxVQUFBO0FBQUo7O0FBR0E7RUFDSSxhQUFBO0VBQ0EsV0FBQTtBQUFKOztBQUdBO0VBQ0ksYUFBQTtBQUFKOztBQUdBO0VBQ0kseUJBQUE7RUFDQSxhQUFBO0FBQUo7O0FBR0E7RUFDSSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtBQUFKOztBQUdBO0VBQ0ksYUFBQTtBQUFKOztBQUdBO0VBQ0ksWUFBQTtFQUNBLG1CQUFBO0FBQUo7O0FBR0E7RUFDSSxpQkFBQTtBQUFKOztBQUdBO0VBQ0ksZUFBQTtBQUFKOztBQUdBO0VBQ0ksV0FBQTtFQUNBLHFCQUFBO0FBQUo7O0FBR0E7RUFDSSxtQkFBQTtFQUNBLGdCQUFBO0FBQUo7O0FBR0E7RUFDSSxtQkFBQTtFQUNBLHNDQUFBO0VBRUEsZ0JBQUE7RUFDQSxlQUFBO0FBREo7O0FBSUE7RUFDSSwyQkFBQTtFQUNBLDRCQUFBO0FBREo7O0FBSUE7RUFDSSxjQUFBO0VBQ0Esc0NBQUE7RUFDQSxlQUFBO0FBREo7O0FBSUE7RUFDSSxnQkFBQTtBQURKOztBQVFBO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EscUJBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0FBTEo7O0FBUUE7RUFDSSxtQkFBQTtBQUxKOztBQVFBO0VBQ0ksVUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0FBTEo7O0FBU0E7RUFDSSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxRQUFBO0VBQ0EsZUFBQTtFQUNBLDhCQUFBO0VBQ0EsV0FBQTtBQU5KOztBQVNFO0VBQ0UsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLFFBQUE7RUFDQSxTQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0FBTkoiLCJmaWxlIjoibG9naW4uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubG9naW4tY2FyZHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgbWFyZ2luOiAwIGF1dG87XHJcbiAgICBwYWRkaW5nOiAwO1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGhlaWdodDogMTAwdmg7XHJcbn1cclxuXHJcbi5sb2dpbi1mb3Jte1xyXG4gICAgbWFyZ2luLXRvcDogNDBweDtcclxuICAgIHBhZGRpbmc6IDQwcHg7XHJcbn1cclxuXHJcbi5zbGlkZXJ7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICAvLyBoZWlnaHQ6IDQyMHB4O1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzAyQzBGMztcclxuICAgIHdpZHRoOiA2NSU7XHJcbn1cclxuXHJcbi5kZW1vLWNvbnRlbnR7XHJcbiAgICBoZWlnaHQ6IDEwMHZoO1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5sb2dpbntcclxuICAgIGhlaWdodDogMTAwdmg7XHJcbn1cclxuXHJcbi5jYXJkLWZvb3RlcntcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmMWY1Zjg7XHJcbiAgICBwYWRkaW5nOiAxNnB4O1xyXG59XHJcblxyXG4uY2FyZC1mb290ZXIgZGl2e1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbn1cclxuXHJcbi5sb2dve1xyXG4gICAgcGFkZGluZzogMzBweDtcclxufVxyXG5cclxuLmxvZ28taWNvbntcclxuICAgIHdpZHRoOiAzMDBweDtcclxuICAgIG1hcmdpbi1ib3R0b206IDMwcHg7XHJcbn1cclxuXHJcbi5jYXJkLWZvb3RlcntcclxuICAgIHRleHQtYWxpZ246IHJpZ2h0O1xyXG59XHJcblxyXG4ubWF0LXByb2dyZXNzLWJhcntcclxuICAgIHBvc2l0aW9uOiBmaXhlZDtcclxufVxyXG5cclxuYXtcclxuICAgIGNvbG9yOiAjMDAwO1xyXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG59XHJcblxyXG4uc3BhY2UtYmV0d2VlbntcclxuICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XHJcbiAgICBtYXJnaW4tdG9wOiAxNnB4O1xyXG59XHJcblxyXG4uZm9ybS1oZWFkaW5ne1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMTJweDtcclxuICAgIGZvbnQtZmFtaWx5OiBwb3BwaW5zLW1lZGl1bSAhaW1wb3J0YW50O1xyXG4gICAgLy8gY29sb3I6ICMwMDQ2N0E7XHJcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4ubWF0LXJhaXNlZC1idXR0b24sIC5tYXQtZmxhdC1idXR0b257XHJcbiAgICBtaW4td2lkdGg6IDEwMHB4ICFpbXBvcnRhbnQ7XHJcbiAgICBsaW5lLWhlaWdodDogMzZweCAhaW1wb3J0YW50XHJcbn1cclxuXHJcbi5hZ3JlZSwgLmZvcmdvdC1wYXNzd29yZCwgLmJhY2stdG8tbG9naW57XHJcbiAgICBjb2xvcjogIzAwNDY3QTtcclxuICAgIGZvbnQtZmFtaWx5OiBwb3BwaW5zLW1lZGl1bSAhaW1wb3J0YW50O1xyXG4gICAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4uYmFjay10by1sb2dpbntcclxuICAgIG1hcmdpbi10b3A6IDE2cHg7XHJcbn1cclxuXHJcbi8vIC5sb2dpbi1idG57XHJcbi8vICAgICBtYXJnaW4tdG9wOiAxNnB4O1xyXG4vLyB9XHJcblxyXG4uYWdyZWVtZW50e1xyXG4gICAgZGlzcGxheTogZmxleDtcclxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICBhbGlnbi1pdGVtczogYmFzZWxpbmU7XHJcbiAgICBtYXJnaW46IDEycHggMCAwO1xyXG4gICAgbWluLWhlaWdodDogNzBweDtcclxufVxyXG5cclxuLmFncmVlbWVudCBhe1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMTJweDtcclxufVxyXG5cclxuLmxhbmRpbmctZm9ybXtcclxuICAgIHdpZHRoOiAzNSU7XHJcbiAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG59XHJcblxyXG5cclxuLmN1c3RvbS1pbmRpY2F0b3Ige1xyXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBwYWRkaW5nOiAwIDEwcHg7XHJcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMyk7XHJcbiAgICBjb2xvcjogI2ZmZjtcclxuICB9XHJcblxyXG4gICNteVZpZGVve1xyXG4gICAgb2JqZWN0LWZpdDogZmlsbDtcclxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgIHJpZ2h0OiAwO1xyXG4gICAgYm90dG9tOiAwO1xyXG4gICAgbWluLXdpZHRoOiAxMDAlOyBcclxuICAgIG1pbi1oZWlnaHQ6IDEwMCU7XHJcbiAgfSAiXX0= */"]
      });
      /***/
    },

    /***/
    "ffpz":
    /*!*************************************************!*\
      !*** ./node_modules/rxjs/internal/Scheduler.js ***!
      \*************************************************/

    /*! no static exports found */

    /***/
    function ffpz(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var Scheduler = function () {
        function Scheduler(SchedulerAction, now) {
          if (now === void 0) {
            now = Scheduler.now;
          }

          this.SchedulerAction = SchedulerAction;
          this.now = now;
        }

        Scheduler.prototype.schedule = function (work, delay, state) {
          if (delay === void 0) {
            delay = 0;
          }

          return new this.SchedulerAction(this, work).schedule(state, delay);
        };

        Scheduler.now = function () {
          return Date.now();
        };

        return Scheduler;
      }();

      exports.Scheduler = Scheduler; //# sourceMappingURL=Scheduler.js.map

      /***/
    },

    /***/
    "iKpk":
    /*!*************************************************!*\
      !*** ./src/app/auth/logout/logout.component.ts ***!
      \*************************************************/

    /*! exports provided: LogoutComponent */

    /***/
    function iKpk(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "LogoutComponent", function () {
        return LogoutComponent;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var src_app_services_common_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! src/app/services/common.service */
      "OlR4");
      /* harmony import */


      var _services_login_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! ./../../services/login.service */
      "EFyh");
      /* harmony import */


      var src_app_services_chat_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! src/app/services/chat.service */
      "sjK5");

      var LogoutComponent = /*#__PURE__*/function () {
        function LogoutComponent(CommonService, loginService, signalRService) {
          _classCallCheck(this, LogoutComponent);

          this.CommonService = CommonService;
          this.loginService = loginService;
          this.signalRService = signalRService;
        }

        _createClass(LogoutComponent, [{
          key: "ngOnInit",
          value: function ngOnInit() {
            var _this10 = this;

            var obj = {
              customerID: this.CommonService.getData("customerID"),
              userID: this.CommonService.getData("userID")
            };
            this.loginService.logout(obj).subscribe(function (res) {
              _this10.signalRService.removeFromGroup();

              _this10.loginService.redirect();
            }, function (err) {
              console.log(err);
            });
          }
        }]);

        return LogoutComponent;
      }();

      LogoutComponent.??fac = function LogoutComponent_Factory(t) {
        return new (t || LogoutComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](src_app_services_common_service__WEBPACK_IMPORTED_MODULE_1__["CommonService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_services_login_service__WEBPACK_IMPORTED_MODULE_2__["LoginService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](src_app_services_chat_service__WEBPACK_IMPORTED_MODULE_3__["SignalRService"]));
      };

      LogoutComponent.??cmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineComponent"]({
        type: LogoutComponent,
        selectors: [["app-logout"]],
        decls: 0,
        vars: 0,
        template: function LogoutComponent_Template(rf, ctx) {},
        encapsulation: 2
      });
      /***/
    },

    /***/
    "k0Pq":
    /*!************************************************************************************!*\
      !*** ./node_modules/@ciri/ngx-carousel/__ivy_ngcc__/fesm2015/ciri-ngx-carousel.js ***!
      \************************************************************************************/

    /*! exports provided: CarouselComponent, CarouselItemComponent, CarouselModule, LazyRenderDirective, ??a */

    /***/
    function k0Pq(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "CarouselComponent", function () {
        return CarouselComponent;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "CarouselItemComponent", function () {
        return CarouselItemComponent;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "CarouselModule", function () {
        return CarouselModule;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "LazyRenderDirective", function () {
        return LazyRenderDirective;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "??a", function () {
        return HammerConfig;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! rxjs */
      "qCKp");
      /* harmony import */


      var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! rxjs/operators */
      "kU1M");
      /* harmony import */


      var rxjs_internal_scheduler_animationFrame__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
      /*! rxjs/internal/scheduler/animationFrame */
      "H0e8");
      /* harmony import */


      var rxjs_internal_scheduler_animationFrame__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(rxjs_internal_scheduler_animationFrame__WEBPACK_IMPORTED_MODULE_3__);
      /* harmony import */


      var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
      /*! @angular/platform-browser */
      "jhN1");
      /* harmony import */


      var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
      /*! @angular/common */
      "ofXK");
      /* harmony import */


      var hammerjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
      /*! hammerjs */
      "yLV6");
      /* harmony import */


      var hammerjs__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_6__);
      /**
       * @fileoverview added by tsickle
       * Generated from: lib/lazy-render.directive.ts
       * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
       */


      function CarouselItemComponent_ng_container_0_ng_template_1_Template(rf, ctx) {}

      function CarouselItemComponent_ng_container_0_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????elementContainerStart"](0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????template"](1, CarouselItemComponent_ng_container_0_ng_template_1_Template, 0, 0, "ng-template", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????projection"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????elementContainerEnd"]();
        }

        if (rf & 2) {
          var ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????nextContext"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????property"]("ngTemplateOutlet", ctx_r0.lazyContent && ctx_r0.lazyContent.content);
        }
      }

      var _c0 = ["*"];
      var _c1 = ["track"];

      function CarouselComponent_div_3_div_1_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????element"](0, "div");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????pipe"](1, "async");
        }

        if (rf & 2) {
          var i_r5 = ctx.index;

          var ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????nextContext"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????classProp"]("active", i_r5 === _angular_core__WEBPACK_IMPORTED_MODULE_0__["????pipeBind1"](1, 2, ctx_r3.active$));
        }
      }

      function CarouselComponent_div_3_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????elementStart"](0, "div", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????template"](1, CarouselComponent_div_3_div_1_Template, 2, 4, "div", 5);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????elementEnd"]();
        }

        if (rf & 2) {
          var ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????nextContext"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????advance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????property"]("ngForOf", ctx_r1.items);
        }
      }

      function CarouselComponent_ng_container_4_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["????elementContainer"](0);
        }
      }

      var _c2 = function _c2(a0) {
        return {
          $implicit: a0
        };
      };

      var LazyRenderDirective =
      /**
       * @param {?} content
       */
      function LazyRenderDirective(content) {
        _classCallCheck(this, LazyRenderDirective);

        this.content = content;
      };

      LazyRenderDirective.??fac = function LazyRenderDirective_Factory(t) {
        return new (t || LazyRenderDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]));
      };

      LazyRenderDirective.??dir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineDirective"]({
        type: LazyRenderDirective,
        selectors: [["", "lazyRender", ""]]
      });
      /** @nocollapse */

      LazyRenderDirective.ctorParameters = function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]
        }];
      };

      (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["??setClassMetadata"](LazyRenderDirective, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"],
          args: [{
            selector: '[lazyRender]'
          }]
        }], function () {
          return [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["TemplateRef"]
          }];
        }, null);
      })();

      if (false) {}
      /**
       * @fileoverview added by tsickle
       * Generated from: lib/carousel-item/carousel-item.component.ts
       * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
       */


      var CarouselItemComponent = /*#__PURE__*/function () {
        /**
         * @param {?} elRef
         * @param {?} parent
         * @param {?} sanitizer
         */
        function CarouselItemComponent(elRef, parent, sanitizer) {
          _classCallCheck(this, CarouselItemComponent);

          this.elRef = elRef;
          this.parent = parent;
          this.sanitizer = sanitizer;
          this.rendered = false;
          this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
        }
        /**
         * @return {?}
         */


        _createClass(CarouselItemComponent, [{
          key: "style",
          get: function get() {
            var width = this.parent.width;
            return this.sanitizer.bypassSecurityTrustStyle("\n      width: ".concat(width, "px;\n    "));
          }
          /**
           * @return {?}
           */

        }, {
          key: "isLazyRender",
          get: function get() {
            return !!this.lazyContent;
          }
          /**
           * @return {?}
           */

        }, {
          key: "ngOnInit",
          value: function ngOnInit() {}
          /**
           * @return {?}
           */

        }, {
          key: "ngAfterViewInit",
          value: function ngAfterViewInit() {
            var _this11 = this;

            setTimeout(
            /**
            * @return {?}
            */
            function () {
              _this11.parent.active$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(_this11.destroy$)).subscribe(
              /**
              * @param {?} res
              * @return {?}
              */
              function (res) {
                _this11.rendered = _this11.rendered || _this11.index === res;
              });
            }, 0);
          }
          /**
           * @return {?}
           */

        }, {
          key: "ngOnDestroy",
          value: function ngOnDestroy() {
            this.destroy$.next();
            this.destroy$.complete();
          }
        }]);

        return CarouselItemComponent;
      }();

      CarouselItemComponent.??fac = function CarouselItemComponent_Factory(t) {
        return new (t || CarouselItemComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](CarouselComponent), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["DomSanitizer"]));
      };

      CarouselItemComponent.??cmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineComponent"]({
        type: CarouselItemComponent,
        selectors: [["ngx-carousel-item"]],
        contentQueries: function CarouselItemComponent_ContentQueries(rf, ctx, dirIndex) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????contentQuery"](dirIndex, LazyRenderDirective, 1);
          }

          if (rf & 2) {
            var _t;

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????queryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????loadQuery"]()) && (ctx.lazyContent = _t.first);
          }
        },
        hostVars: 4,
        hostBindings: function CarouselItemComponent_HostBindings(rf, ctx) {
          if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????styleMap"](ctx.style);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????classProp"]("ngx-carousel__item", true);
          }
        },
        ngContentSelectors: _c0,
        decls: 1,
        vars: 1,
        consts: [[4, "ngIf"], [3, "ngTemplateOutlet"]],
        template: function CarouselItemComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????projectionDef"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????template"](0, CarouselItemComponent_ng_container_0_Template, 3, 1, "ng-container", 0);
          }

          if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????property"]("ngIf", !ctx.isLazyRender || ctx.rendered);
          }
        },
        directives: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgTemplateOutlet"]],
        styles: [".ngx-carousel__item{display:inline-block;vertical-align:top}.ngx-carousel__item.pre-mirror-node{position:absolute;left:0;transform:translateX(-100%)}.ngx-carousel__item.post-mirror-node{position:absolute;right:0;transform:translateX(100%)}"],
        encapsulation: 2
      });
      /** @nocollapse */

      CarouselItemComponent.ctorParameters = function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]
        }, {
          type: CarouselComponent
        }, {
          type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["DomSanitizer"]
        }];
      };

      CarouselItemComponent.propDecorators = {
        lazyContent: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ContentChild"],
          args: [LazyRenderDirective, {
            "static": false
          }]
        }],
        style: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"],
          args: ['style']
        }]
      };

      (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["??setClassMetadata"](CarouselItemComponent, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
          args: [{
            selector: 'ngx-carousel-item',
            template: "<ng-container *ngIf=\"!isLazyRender || rendered\">\n  <ng-template [ngTemplateOutlet]=\"lazyContent && lazyContent.content\"></ng-template>\n  <ng-content></ng-content>\n</ng-container>\n",
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None,
            host: {
              '[class.ngx-carousel__item]': "true"
            },
            styles: [".ngx-carousel__item{display:inline-block;vertical-align:top}.ngx-carousel__item.pre-mirror-node{position:absolute;left:0;transform:translateX(-100%)}.ngx-carousel__item.post-mirror-node{position:absolute;right:0;transform:translateX(100%)}"]
          }]
        }], function () {
          return [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]
          }, {
            type: CarouselComponent
          }, {
            type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["DomSanitizer"]
          }];
        }, {
          style: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["HostBinding"],
            args: ['style']
          }],
          lazyContent: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ContentChild"],
            args: [LazyRenderDirective, {
              "static": false
            }]
          }]
        });
      })();

      if (false) {}
      /**
       * @fileoverview added by tsickle
       * Generated from: utils.ts
       * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
       */

      /**
       * @param {?} value
       * @param {?} min
       * @param {?} max
       * @return {?}
       */


      function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
      }
      /**
       * @fileoverview added by tsickle
       * Generated from: lib/carousel/carousel.component.ts
       * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
       */


      var CarouselComponent = /*#__PURE__*/function () {
        // ???????????????

        /**
         * @param {?} render
         * @param {?} hostElRef
         * @param {?} cdr
         */
        function CarouselComponent(render, hostElRef, cdr) {
          _classCallCheck(this, CarouselComponent);

          this.render = render;
          this.hostElRef = hostElRef;
          this.cdr = cdr;
          /**
           * ????????????????????????
           */

          this.loop = false;
          /**
           * ???????????????ms???
           */

          this.speed = 300;
          /**
           * ???????????????????????????0 ????????????????????????
           */

          this.autoplay = 0;
          /**
           * ????????????????????????
           */

          this.followFinger = true;
          /**
           * ????????????????????????????????? false ?????????????????? api ??????
           */

          this.allowTouchMove = true;
          /**
           * ???????????????
           */

          this.initialIndex = 0;
          /**
           * ?????????????????????
           */

          this.change = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
          this.active$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](null);
          this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__["Subject"]();
          this.percent = 0; // ?????????????????????????????????????????????
          // ?????????????????????????????????????????????

          this.offset = 0; // ????????????%???
          // ????????????%???

          this.animating = false; // ???????????????????????????
        }
        /**
         * @return {?}
         */


        _createClass(CarouselComponent, [{
          key: "count",
          get: function get() {
            return this.items.length;
          }
          /**
           * @return {?}
           */

        }, {
          key: "width",
          get: function get() {
            return this.hostElRef.nativeElement.offsetWidth;
          }
          /**
           * @return {?}
           */

        }, {
          key: "canMove",
          get: function get() {
            return this.allowTouchMove && !this.animating;
          }
          /**
           * @return {?}
           */

        }, {
          key: "data",
          get: function get() {
            return {
              active: this.active$.value,
              count: this.count,
              offset: this.offset,
              animating: this.animating
            };
          }
          /**
           * @return {?}
           */

        }, {
          key: "ngOnInit",
          value: function ngOnInit() {}
          /**
           * @return {?}
           */

        }, {
          key: "ngAfterViewInit",
          value: function ngAfterViewInit() {
            var _this12 = this;

            this.active$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroy$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["filter"])(
            /**
            * @param {?} v
            * @return {?}
            */
            function (v) {
              return v !== null && v >= 0 && v <= _this12.count - 1;
            }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["distinctUntilChanged"])(), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["skip"])(1)).subscribe(
            /**
            * @param {?} res
            * @return {?}
            */
            function (res) {
              _this12.change.emit(res);
            });
            Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])(window, 'resize').pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroy$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(60, rxjs_internal_scheduler_animationFrame__WEBPACK_IMPORTED_MODULE_3__["animationFrame"])).subscribe(
            /**
            * @return {?}
            */
            function () {
              _this12.resize();
            });
            this.items.changes.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroy$), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["startWith"])(null), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(60, rxjs_internal_scheduler_animationFrame__WEBPACK_IMPORTED_MODULE_3__["animationFrame"])).subscribe(
            /**
            * @return {?}
            */
            function () {
              _this12.init();
            });
          }
          /**
           * @param {?} changes
           * @return {?}
           */

        }, {
          key: "ngOnChanges",
          value: function ngOnChanges(changes) {}
          /**
           * @return {?}
           */

        }, {
          key: "ngOnDestroy",
          value: function ngOnDestroy() {
            this.destroy$.next();
            this.destroy$.complete();
          }
          /**
           * @param {?} e
           * @return {?}
           */

        }, {
          key: "onPanStart",
          value: function onPanStart(e) {
            this.stopAutoplay();
          }
          /**
           * @param {?} e
           * @return {?}
           */

        }, {
          key: "onPanMove",
          value: function onPanMove(e) {
            if (!this.canMove) {
              return;
            }
            /** @type {?} */


            var deltaX = this.getSafeDeltaX(e.deltaX);
            this.percent = 100 / this.count * deltaX / this.width;

            if (this.followFinger) {
              /** @type {?} */
              var offset = this.percent - 100 / this.count * this.active$.value;
              this.move(offset, true);
            }
          }
          /**
           * @param {?} e
           * @return {?}
           */

        }, {
          key: "onPanEnd",
          value: function onPanEnd(e) {
            if (!this.canMove) {
              return;
            } // ????????????????????????????????????????????????????????? 50% ???????????????

            /** @type {?} */


            var newActive = this.active$.value;
            /** @type {?} */

            var isSwipeLeft = e.direction === Hammer.DIRECTION_LEFT && e.velocityX < -0.3;
            /** @type {?} */

            var isSwipeRight = e.direction === Hammer.DIRECTION_RIGHT && e.velocityX > 0.3;

            if (isSwipeLeft || this.percent <= -50 / this.count) {
              newActive++;
            } else if (isSwipeRight || this.percent >= 50 / this.count) {
              newActive--;
            }

            this.goTo(newActive);
            this.startAutoplay();
          }
          /**
           * ??????????????????
           * @param {?=} target ????????????
           * @param {?=} immediate ??????????????????????????????
           * @return {?}
           */

        }, {
          key: "goTo",
          value: function goTo() {
            var _this13 = this;

            var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var immediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (this.animating) {
              return;
            }
            /** @type {?} */


            var active = this.getSafeActive(target);
            /** @type {?} */

            var realActive = this.getRealActive(active);
            this.active$.next(realActive); // ???????????????????????????????????????????????????

            if (this.loop && (realActive === 0 || realActive === this.count - 1)) {
              this.handleMirrorNodes();
            }

            this.animating = true;
            this.move(-(100 / this.count) * active, immediate).subscribe(
            /**
            * @return {?}
            */
            function () {
              _this13.animating = false;

              if (active === -1 || active === _this13.count) {
                _this13.goTo(realActive, true);
              }
            });
          }
          /**
           * ??????????????????
           * @return {?}
           */

        }, {
          key: "prev",
          value: function prev() {
            this.goTo(this.active$.value - 1);
          }
          /**
           * ??????????????????
           * @return {?}
           */

        }, {
          key: "next",
          value: function next() {
            this.goTo(this.active$.value + 1);
          }
          /**
           * ????????????????????????
           * @return {?}
           */

        }, {
          key: "resize",
          value: function resize() {
            this.cdr.detectChanges();
          }
          /**
           * @private
           * @return {?}
           */

        }, {
          key: "init",
          value: function init() {
            var _this14 = this;

            if (this.items.length === 0) {
              return;
            }

            this.items.forEach(
            /**
            * @param {?} el
            * @param {?} index
            * @return {?}
            */
            function (el, index) {
              return el.index = index;
            });

            if (this.loop) {
              this.handleMirrorNodes();
            }

            setTimeout(
            /**
            * @return {?}
            */
            function () {
              _this14.goTo(_this14.getSafeActive(_this14.initialIndex, true), true);
            }, 0);
            this.startAutoplay();
          }
          /**
           * @private
           * @param {?} deltaX
           * @return {?}
           */

        }, {
          key: "getSafeDeltaX",
          value: function getSafeDeltaX(deltaX) {
            return clamp(deltaX, -this.width, this.width);
          }
          /**
           * @private
           * @param {?} active
           * @param {?=} strict
           * @return {?}
           */

        }, {
          key: "getSafeActive",
          value: function getSafeActive(active) {
            var strict = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            /** @type {?} */
            var min = this.loop && !strict ? -1 : 0;
            /** @type {?} */

            var max = this.loop && !strict ? this.count : this.count - 1;
            return clamp(active, min, max);
          } // ??????????????????
          // ?????? loop ???????????????????????????????????? active ?????????
          // ?????????????????????????????? active ??? loop ???????????? 0 ??? 2???loop ???????????? -1 ??? 3

          /**
           * @private
           * @param {?} active
           * @return {?}
           */

        }, {
          key: "getRealActive",
          value: function getRealActive(active) {
            return (active + this.count) % this.count;
          } // loop ??????????????????????????????????????????????????????
          // 0 1 2 => 2 0 1 2 0
          // TODO: ??????????????????????????????????????? dom??????????????????????????????????????????

          /**
           * @private
           * @return {?}
           */

        }, {
          key: "handleMirrorNodes",
          value: function handleMirrorNodes() {
            /** @type {?} */
            var trackEl = this.track.nativeElement // ??????????????????
            ; // ??????????????????

            try {
              this.render.removeChild(trackEl, this.preMirrorNode);
              this.render.removeChild(trackEl, this.postMirrorNode);
            } catch (e) {}

            var _this$items = this.items,
                first = _this$items.first,
                last = _this$items.last;
            this.preMirrorNode = last.elRef.nativeElement.cloneNode(true);
            this.postMirrorNode = first.elRef.nativeElement.cloneNode(true);
            this.render.addClass(this.preMirrorNode, 'pre-mirror-node');
            this.render.addClass(this.postMirrorNode, 'post-mirror-node');
            this.render.insertBefore(trackEl, this.preMirrorNode, first.elRef.nativeElement);
            this.render.appendChild(trackEl, this.postMirrorNode);
          }
          /**
           * @private
           * @param {?} offset
           * @param {?=} immediate
           * @return {?}
           */

        }, {
          key: "move",
          value: function move(offset) {
            var immediate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            /** @type {?} */
            var el = this.track.nativeElement;
            /** @type {?} */

            var oldOffset = this.offset;
            /** @type {?} */

            var newOffset = this.offset = offset;
            this.render.setStyle(el, 'transition', immediate ? 'none' : "transform ".concat(this.speed, "ms"));
            this.render.setStyle(el, 'transform', "translate3d(".concat(offset, "%, 0, 0)"));
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["timer"])(immediate || newOffset === oldOffset ? 0 : this.speed).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroy$));
          }
          /**
           * @private
           * @return {?}
           */

        }, {
          key: "startAutoplay",
          value: function startAutoplay() {
            var _this15 = this;

            if (!this.autoplay || this.count <= 1) {
              return;
            }

            this.stopAutoplay();
            this.intervalSub = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["interval"])(this.autoplay + this.speed).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["takeUntil"])(this.destroy$)).subscribe(
            /**
            * @return {?}
            */
            function () {
              /** @type {?} */
              var oldActive = _this15.active$.value;
              /** @type {?} */

              var newActive = _this15.loop ? oldActive + 1 : _this15.getRealActive(oldActive + 1);

              _this15.goTo(newActive);
            });
          }
          /**
           * @private
           * @return {?}
           */

        }, {
          key: "stopAutoplay",
          value: function stopAutoplay() {
            this.intervalSub && this.intervalSub.unsubscribe();
          }
        }]);

        return CarouselComponent;
      }();

      CarouselComponent.??fac = function CarouselComponent_Factory(t) {
        return new (t || CarouselComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]));
      };

      CarouselComponent.??cmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineComponent"]({
        type: CarouselComponent,
        selectors: [["ngx-carousel"]],
        contentQueries: function CarouselComponent_ContentQueries(rf, ctx, dirIndex) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????contentQuery"](dirIndex, CarouselItemComponent, 0);
          }

          if (rf & 2) {
            var _t;

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????queryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????loadQuery"]()) && (ctx.items = _t);
          }
        },
        viewQuery: function CarouselComponent_Query(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????viewQuery"](_c1, 1);
          }

          if (rf & 2) {
            var _t;

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????queryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????loadQuery"]()) && (ctx.track = _t.first);
          }
        },
        hostVars: 2,
        hostBindings: function CarouselComponent_HostBindings(rf, ctx) {
          if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????classProp"]("ngx-carousel", true);
          }
        },
        inputs: {
          loop: "loop",
          speed: "speed",
          autoplay: "autoplay",
          followFinger: "followFinger",
          allowTouchMove: "allowTouchMove",
          initialIndex: "initialIndex",
          indicator: "indicator"
        },
        outputs: {
          change: "change"
        },
        features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["????NgOnChangesFeature"]],
        ngContentSelectors: _c0,
        decls: 5,
        vars: 5,
        consts: [[1, "ngx-carousel__track", 3, "dragstart", "panstart", "panmove", "panend", "pancancel"], ["track", ""], ["class", "ngx-carousel__indicator", 4, "ngIf"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "ngx-carousel__indicator"], [3, "active", 4, "ngFor", "ngForOf"]],
        template: function CarouselComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????projectionDef"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????elementStart"](0, "div", 0, 1);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????listener"]("dragstart", function CarouselComponent_Template_div_dragstart_0_listener($event) {
              return $event.preventDefault();
            })("panstart", function CarouselComponent_Template_div_panstart_0_listener($event) {
              return ctx.onPanStart($event);
            })("panmove", function CarouselComponent_Template_div_panmove_0_listener($event) {
              return ctx.onPanMove($event);
            })("panend", function CarouselComponent_Template_div_panend_0_listener($event) {
              return ctx.onPanEnd($event);
            })("pancancel", function CarouselComponent_Template_div_pancancel_0_listener($event) {
              return ctx.onPanEnd($event);
            });

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????projection"](2);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????elementEnd"]();

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????template"](3, CarouselComponent_div_3_Template, 2, 1, "div", 2);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????template"](4, CarouselComponent_ng_container_4_Template, 1, 0, "ng-container", 3);
          }

          if (rf & 2) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????advance"](3);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????property"]("ngIf", !ctx.indicator);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????advance"](1);

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????property"]("ngTemplateOutlet", ctx.indicator)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_0__["????pureFunction1"](3, _c2, ctx.data));
          }
        },
        directives: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgTemplateOutlet"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgForOf"]],
        pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["AsyncPipe"]],
        styles: [".ngx-carousel{position:relative;display:block;overflow:hidden}.ngx-carousel__track{position:relative;display:inline-block;white-space:nowrap}.ngx-carousel__indicator{position:absolute;bottom:10px;width:100%;text-align:center;white-space:nowrap;font-size:0;pointer-events:none}.ngx-carousel__indicator div{display:inline-block;width:6px;height:6px;margin:0 3px;border-radius:50%;background:rgba(0,0,0,.25);pointer-events:auto}.ngx-carousel__indicator div.active{background:rgba(0,0,0,.75)}"],
        encapsulation: 2
      });
      /** @nocollapse */

      CarouselComponent.ctorParameters = function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]
        }];
      };

      CarouselComponent.propDecorators = {
        loop: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        speed: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        autoplay: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        followFinger: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        allowTouchMove: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        indicator: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        initialIndex: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        change: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        track: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
          args: ['track', {
            "static": false
          }]
        }],
        items: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ContentChildren"],
          args: [CarouselItemComponent]
        }]
      };

      (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["??setClassMetadata"](CarouselComponent, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
          args: [{
            selector: 'ngx-carousel',
            template: "<div\n  class=\"ngx-carousel__track\"\n  #track\n  (dragstart)=\"$event.preventDefault()\"\n  (panstart)=\"onPanStart($event)\"\n  (panmove)=\"onPanMove($event)\"\n  (panend)=\"onPanEnd($event)\"\n  (pancancel)=\"onPanEnd($event)\"\n>\n  <ng-content></ng-content>\n</div>\n\n<div class=\"ngx-carousel__indicator\" *ngIf=\"!indicator\">\n  <div\n    *ngFor=\"let item of items; let i = index\"\n    [class.active]=\"i === (active$ | async)\"\n  ></div>\n</div>\n\n<ng-container *ngTemplateOutlet=\"indicator; context: { $implicit: data }\"></ng-container>\n",
            encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None,
            host: {
              '[class.ngx-carousel]': "true"
            },
            styles: [".ngx-carousel{position:relative;display:block;overflow:hidden}.ngx-carousel__track{position:relative;display:inline-block;white-space:nowrap}.ngx-carousel__indicator{position:absolute;bottom:10px;width:100%;text-align:center;white-space:nowrap;font-size:0;pointer-events:none}.ngx-carousel__indicator div{display:inline-block;width:6px;height:6px;margin:0 3px;border-radius:50%;background:rgba(0,0,0,.25);pointer-events:auto}.ngx-carousel__indicator div.active{background:rgba(0,0,0,.75)}"]
          }]
        }], function () {
          return [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]
          }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]
          }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectorRef"]
          }];
        }, {
          loop: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          speed: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          autoplay: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          followFinger: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          allowTouchMove: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          initialIndex: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          change: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
          }],
          indicator: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          track: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['track', {
              "static": false
            }]
          }],
          items: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ContentChildren"],
            args: [CarouselItemComponent]
          }]
        });
      })();

      if (false) {}
      /**
       * @fileoverview added by tsickle
       * Generated from: lib/hammer.config.ts
       * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
       */


      var HammerConfig = /*#__PURE__*/function (_angular_platform_bro) {
        _inherits(HammerConfig, _angular_platform_bro);

        var _super2 = _createSuper(HammerConfig);

        function HammerConfig() {
          _classCallCheck(this, HammerConfig);

          return _super2.apply(this, arguments);
        }

        _createClass(HammerConfig, [{
          key: "buildHammer",
          value:
          /**
           * @param {?} element
           * @return {?}
           */
          function buildHammer(element) {
            /** @type {?} */
            var mc = new Hammer(element, {
              inputClass: Hammer.TouchMouseInput
            });
            return mc;
          }
        }]);

        return HammerConfig;
      }(_angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["HammerGestureConfig"]);

      HammerConfig.??fac = function HammerConfig_Factory(t) {
        return ??HammerConfig_BaseFactory(t || HammerConfig);
      };

      HammerConfig.??prov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineInjectable"]({
        token: HammerConfig,
        factory: HammerConfig.??fac
      });

      var ??HammerConfig_BaseFactory = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["????getInheritedFactory"](HammerConfig);
      /**
       * @fileoverview added by tsickle
       * Generated from: lib/carousel.module.ts
       * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
       */


      var CarouselModule = function CarouselModule() {
        _classCallCheck(this, CarouselModule);
      };

      CarouselModule.??fac = function CarouselModule_Factory(t) {
        return new (t || CarouselModule)();
      };

      CarouselModule.??mod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineNgModule"]({
        type: CarouselModule
      });
      CarouselModule.??inj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineInjector"]({
        providers: [{
          provide: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["HAMMER_GESTURE_CONFIG"],
          useClass: HammerConfig
        }],
        imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"]]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["????setNgModuleScope"](CarouselModule, {
          declarations: function declarations() {
            return [CarouselComponent, CarouselItemComponent, LazyRenderDirective];
          },
          imports: function imports() {
            return [_angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"]];
          },
          exports: function exports() {
            return [CarouselComponent, CarouselItemComponent, LazyRenderDirective];
          }
        });
      })();

      (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["??setClassMetadata"](CarouselModule, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
          args: [{
            declarations: [CarouselComponent, CarouselItemComponent, LazyRenderDirective],
            imports: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"]],
            exports: [CarouselComponent, CarouselItemComponent, LazyRenderDirective],
            providers: [{
              provide: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_4__["HAMMER_GESTURE_CONFIG"],
              useClass: HammerConfig
            }]
          }]
        }], null, null);
      })();
      /**
       * @fileoverview added by tsickle
       * Generated from: public-api.ts
       * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
       */

      /**
       * @fileoverview added by tsickle
       * Generated from: ciri-ngx-carousel.ts
       * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
       */
      //# sourceMappingURL=ciri-ngx-carousel.js.map

      /***/

    },

    /***/
    "mbIT":
    /*!****************************************************!*\
      !*** ./node_modules/rxjs/internal/util/isArray.js ***!
      \****************************************************/

    /*! no static exports found */

    /***/
    function mbIT(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      exports.isArray = function () {
        return Array.isArray || function (x) {
          return x && typeof x.length === 'number';
        };
      }(); //# sourceMappingURL=isArray.js.map

      /***/

    },

    /***/
    "pshJ":
    /*!*******************************************************!*\
      !*** ./node_modules/rxjs/internal/util/isFunction.js ***!
      \*******************************************************/

    /*! no static exports found */

    /***/
    function pshJ(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      function isFunction(x) {
        return typeof x === 'function';
      }

      exports.isFunction = isFunction; //# sourceMappingURL=isFunction.js.map

      /***/
    },

    /***/
    "sjCC":
    /*!***********************************************************************!*\
      !*** ./node_modules/ngx-captcha/__ivy_ngcc__/fesm2015/ngx-captcha.js ***!
      \***********************************************************************/

    /*! exports provided: BaseReCaptchaComponent, InvisibleReCaptchaComponent, NgxCaptchaModule, ReCaptcha2Component, ReCaptchaType, ReCaptchaV3Service, ScriptService */

    /***/
    function sjCC(module, __webpack_exports__, __webpack_require__) {
      "use strict";

      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "BaseReCaptchaComponent", function () {
        return BaseReCaptchaComponent;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "InvisibleReCaptchaComponent", function () {
        return InvisibleReCaptchaComponent;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "NgxCaptchaModule", function () {
        return NgxCaptchaModule;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "ReCaptcha2Component", function () {
        return ReCaptcha2Component;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "ReCaptchaType", function () {
        return ReCaptchaType;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "ReCaptchaV3Service", function () {
        return ReCaptchaV3Service;
      });
      /* harmony export (binding) */


      __webpack_require__.d(__webpack_exports__, "ScriptService", function () {
        return ScriptService;
      });
      /* harmony import */


      var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! @angular/core */
      "fXoL");
      /* harmony import */


      var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
      /*! @angular/forms */
      "3Pt+");
      /* harmony import */


      var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
      /*! @angular/common */
      "ofXK");

      var _c0 = ["captchaWrapperElem"];

      var ScriptService = /*#__PURE__*/function () {
        function ScriptService(zone) {
          _classCallCheck(this, ScriptService);

          this.zone = zone;
          /**
           * Name of the global google recaptcha script
           */

          this.windowGrecaptcha = 'grecaptcha';
          /**
          * Name of the global callback
          */

          this.windowOnLoadCallbackProperty = 'ngx_captcha_onload_callback';
          this.globalDomain = 'recaptcha.net';
          this.defaultDomain = 'google.com';
        }

        _createClass(ScriptService, [{
          key: "registerCaptchaScript",
          value: function registerCaptchaScript(useGlobalDomain, render, onLoad, language) {
            var _this16 = this;

            if (this.grecaptchaScriptLoaded()) {
              // recaptcha script is already loaded
              // just call the callback
              this.zone.run(function () {
                onLoad(window[_this16.windowGrecaptcha]);
              });
              return;
            } // we need to patch the callback through global variable, otherwise callback is not accessible
            // note: https://github.com/Enngage/ngx-captcha/issues/2


            window[this.windowOnLoadCallbackProperty] = function () {
              return _this16.zone.run(onLoad.bind(_this16, window[_this16.windowGrecaptcha]));
            }; // prepare script elem


            var scriptElem = document.createElement('script');
            scriptElem.innerHTML = '';
            scriptElem.src = this.getCaptchaScriptUrl(useGlobalDomain, render, language);
            scriptElem.async = true;
            scriptElem.defer = true; // add script to header

            document.getElementsByTagName('head')[0].appendChild(scriptElem);
          }
        }, {
          key: "cleanup",
          value: function cleanup() {
            window[this.windowOnLoadCallbackProperty] = undefined;
            window[this.windowGrecaptcha] = undefined;
          }
          /**
           * Indicates if google recaptcha script is available and ready to be used
           */

        }, {
          key: "grecaptchaScriptLoaded",
          value: function grecaptchaScriptLoaded() {
            if (window[this.windowOnLoadCallbackProperty] && window[this.windowGrecaptcha]) {
              return true;
            }

            return false;
          }
          /**
           * Gets language param used in script url
           */

        }, {
          key: "getLanguageParam",
          value: function getLanguageParam(hl) {
            if (!hl) {
              return '';
            }

            return "&hl=".concat(hl);
          }
          /**
          * Url to google api script
          */

        }, {
          key: "getCaptchaScriptUrl",
          value: function getCaptchaScriptUrl(useGlobalDomain, render, language) {
            var domain = useGlobalDomain ? this.globalDomain : this.defaultDomain; // tslint:disable-next-line:max-line-length

            return "https://www.".concat(domain, "/recaptcha/api.js?onload=").concat(this.windowOnLoadCallbackProperty, "&render=").concat(render).concat(this.getLanguageParam(language));
          }
        }]);

        return ScriptService;
      }();

      ScriptService.??fac = function ScriptService_Factory(t) {
        return new (t || ScriptService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["????inject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]));
      };

      ScriptService.??prov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineInjectable"]({
        token: ScriptService,
        factory: ScriptService.??fac
      });
      /** @nocollapse */

      ScriptService.ctorParameters = function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
        }];
      };

      (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["??setClassMetadata"](ScriptService, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
        }], function () {
          return [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
          }];
        }, null);
      })();

      var BaseReCaptchaComponent = /*#__PURE__*/function () {
        function BaseReCaptchaComponent(renderer, zone, injector, scriptService) {
          _classCallCheck(this, BaseReCaptchaComponent);

          this.renderer = renderer;
          this.zone = zone;
          this.injector = injector;
          this.scriptService = scriptService;
          /**
          * Prefix of the captcha element
          */

          this.captchaElemPrefix = 'ngx_captcha_id_';
          this.setupCaptcha = true;
          /**
           * Indicates if global domain 'recaptcha.net' should be used instead of default domain ('google.com')
           */

          this.useGlobalDomain = false;
          /**
          * Type
          */

          this.type = 'image';
          /**
          * Tab index
          */

          this.tabIndex = 0;
          /**
          * Called when captcha receives successful response.
          * Captcha response token is passed to event.
          */

          this.success = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
          /**
          * Called when captcha is loaded. Event receives id of the captcha
          */

          this.load = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
          /**
          * Called when captcha is reset.
          */

          this.reset = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
          /**
          * Called when captcha is loaded & ready. I.e. when you need to execute captcha on component load.
          */

          this.ready = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
          /**
          * Error callback
          */

          this.error = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
          /**
          * Expired callback
          */

          this.expire = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
          /**
          * Indicates if captcha should be set on load
          */

          this.setupAfterLoad = false;
          /**
          * If enabled, captcha will reset after receiving success response. This is useful
          * when invisible captcha need to be resolved multiple times on same page
          */

          this.resetCaptchaAfterSuccess = false;
          /**
          * Indicates if captcha is loaded
          */

          this.isLoaded = false;
        }

        _createClass(BaseReCaptchaComponent, [{
          key: "ngAfterViewInit",
          value: function ngAfterViewInit() {
            var _a;

            this.control = (_a = this.injector.get(_angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControl"], undefined, _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectFlags"].Optional)) === null || _a === void 0 ? void 0 : _a.control;
          }
        }, {
          key: "ngAfterViewChecked",
          value: function ngAfterViewChecked() {
            if (this.setupCaptcha) {
              this.setupCaptcha = false;
              this.setupComponent();
            }
          }
        }, {
          key: "ngOnChanges",
          value: function ngOnChanges(changes) {
            // cleanup scripts if language changed because they need to be reloaded
            if (changes && changes.hl) {
              // cleanup scripts when language changes
              if (!changes.hl.firstChange && changes.hl.currentValue !== changes.hl.previousValue) {
                this.scriptService.cleanup();
              }
            }

            if (changes && changes.useGlobalDomain) {
              // cleanup scripts when domain changes
              if (!changes.useGlobalDomain.firstChange && changes.useGlobalDomain.currentValue !== changes.useGlobalDomain.previousValue) {
                this.scriptService.cleanup();
              }
            }

            this.setupCaptcha = true;
          }
          /**
          * Gets captcha response as per reCaptcha docs
          */

        }, {
          key: "getResponse",
          value: function getResponse() {
            return this.reCaptchaApi.getResponse(this.captchaId);
          }
          /**
          * Gets Id of captcha widget
          */

        }, {
          key: "getCaptchaId",
          value: function getCaptchaId() {
            return this.captchaId;
          }
          /**
          * Resets captcha
          */

        }, {
          key: "resetCaptcha",
          value: function resetCaptcha() {
            var _this17 = this;

            this.zone.run(function () {
              // reset captcha using Google js api
              _this17.reCaptchaApi.reset(); // required due to forms


              _this17.onChange(undefined);

              _this17.onTouched(undefined); // trigger reset event


              _this17.reset.next();
            });
          }
          /**
          * Gets last submitted captcha response
          */

        }, {
          key: "getCurrentResponse",
          value: function getCurrentResponse() {
            return this.currentResponse;
          }
          /**
          * Reload captcha. Useful when properties (i.e. theme) changed and captcha need to reflect them
          */

        }, {
          key: "reloadCaptcha",
          value: function reloadCaptcha() {
            this.setupComponent();
          }
        }, {
          key: "ensureCaptchaElem",
          value: function ensureCaptchaElem(captchaElemId) {
            var captchaElem = document.getElementById(captchaElemId);

            if (!captchaElem) {
              throw Error("Captcha element with id '".concat(captchaElemId, "' was not found"));
            } // assign captcha alem


            this.captchaElem = captchaElem;
          }
          /**
          * Responsible for instantiating captcha element
          */

        }, {
          key: "renderReCaptcha",
          value: function renderReCaptcha() {
            var _this18 = this;

            // run outside angular zone due to timeout issues when testing
            // details: https://github.com/Enngage/ngx-captcha/issues/26
            this.zone.runOutsideAngular(function () {
              // to fix reCAPTCHA placeholder element must be an element or id
              // https://github.com/Enngage/ngx-captcha/issues/96
              setTimeout(function () {
                _this18.captchaId = _this18.reCaptchaApi.render(_this18.captchaElemId, _this18.getCaptchaProperties());

                _this18.ready.next();
              }, 0);
            });
          }
          /**
          * Called when captcha receives response
          * @param callback Callback
          */

        }, {
          key: "handleCallback",
          value: function handleCallback(callback) {
            var _this19 = this;

            this.currentResponse = callback;
            this.success.next(callback);
            this.zone.run(function () {
              _this19.onChange(callback);

              _this19.onTouched(callback);
            });

            if (this.resetCaptchaAfterSuccess) {
              this.resetCaptcha();
            }
          }
        }, {
          key: "getPseudoUniqueNumber",
          value: function getPseudoUniqueNumber() {
            return new Date().getUTCMilliseconds() + Math.floor(Math.random() * 9999);
          }
        }, {
          key: "setupComponent",
          value: function setupComponent() {
            var _this20 = this;

            // captcha specific setup
            this.captchaSpecificSetup(); // create captcha wrapper

            this.createAndSetCaptchaElem();
            this.scriptService.registerCaptchaScript(this.useGlobalDomain, 'explicit', function (grecaptcha) {
              _this20.onloadCallback(grecaptcha);
            }, this.hl);
          }
          /**
          * Called when google's recaptcha script is ready
          */

        }, {
          key: "onloadCallback",
          value: function onloadCallback(grecapcha) {
            // assign reference to reCaptcha Api once its loaded
            this.reCaptchaApi = grecapcha;

            if (!this.reCaptchaApi) {
              throw Error("ReCaptcha Api was not initialized correctly");
            } // loaded flag


            this.isLoaded = true; // fire load event

            this.load.next(); // render captcha

            this.renderReCaptcha(); // setup component if it was flagged as such

            if (this.setupAfterLoad) {
              this.setupAfterLoad = false;
              this.setupComponent();
            }
          }
        }, {
          key: "generateNewElemId",
          value: function generateNewElemId() {
            return this.captchaElemPrefix + this.getPseudoUniqueNumber();
          }
        }, {
          key: "createAndSetCaptchaElem",
          value: function createAndSetCaptchaElem() {
            var _this21 = this;

            // generate new captcha id
            this.captchaElemId = this.generateNewElemId();

            if (!this.captchaElemId) {
              throw Error("Captcha elem Id is not set");
            }

            if (!this.captchaWrapperElem) {
              throw Error("Captcha DOM element is not initialized");
            } // remove old html


            this.captchaWrapperElem.nativeElement.innerHTML = ''; // create new wrapper for captcha

            var newElem = this.renderer.createElement('div');
            newElem.id = this.captchaElemId;
            this.renderer.appendChild(this.captchaWrapperElem.nativeElement, newElem); // when use captcha in cdk stepper then throwing error Captcha element with id 'ngx_captcha_id_XXXX' not found
            // to fix it checking ensureCaptchaElem in timeout so that its check in next call and its able to find element

            setTimeout(function () {
              // update captcha elem
              if (_this21.captchaElemId) {
                _this21.ensureCaptchaElem(_this21.captchaElemId);
              }
            }, 0);
          }
          /**
           * To be aligned with the ControlValueAccessor interface we need to implement this method
           * However as we don't want to update the recaptcha, this doesn't need to be implemented
           */

        }, {
          key: "writeValue",
          value: function writeValue(obj) {}
          /**
           * This method helps us tie together recaptcha and our formControl values
           */

        }, {
          key: "registerOnChange",
          value: function registerOnChange(fn) {
            this.onChange = fn;
          }
          /**
          * At some point we might be interested whether the user has touched our component
          */

        }, {
          key: "registerOnTouched",
          value: function registerOnTouched(fn) {
            this.onTouched = fn;
          }
          /**
          * Handles error callback
          */

        }, {
          key: "handleErrorCallback",
          value: function handleErrorCallback() {
            var _this22 = this;

            this.zone.run(function () {
              _this22.onChange(undefined);

              _this22.onTouched(undefined);
            });
            this.error.next();
          }
          /**
          * Handles expired callback
          */

        }, {
          key: "handleExpireCallback",
          value: function handleExpireCallback() {
            this.expire.next(); // reset captcha on expire callback

            this.resetCaptcha();
          }
        }]);

        return BaseReCaptchaComponent;
      }();

      BaseReCaptchaComponent.??fac = function BaseReCaptchaComponent_Factory(t) {
        return new (t || BaseReCaptchaComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](ScriptService));
      };

      BaseReCaptchaComponent.??dir = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineDirective"]({
        type: BaseReCaptchaComponent,
        inputs: {
          useGlobalDomain: "useGlobalDomain",
          type: "type",
          tabIndex: "tabIndex",
          siteKey: "siteKey",
          hl: "hl"
        },
        outputs: {
          success: "success",
          load: "load",
          reset: "reset",
          ready: "ready",
          error: "error",
          expire: "expire"
        },
        features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["????NgOnChangesFeature"]]
      });
      /** @nocollapse */

      BaseReCaptchaComponent.ctorParameters = function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]
        }, {
          type: ScriptService
        }];
      };

      BaseReCaptchaComponent.propDecorators = {
        siteKey: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        useGlobalDomain: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        type: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        hl: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        tabIndex: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        success: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        load: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        reset: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        ready: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        error: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        expire: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }]
      };

      (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["??setClassMetadata"](BaseReCaptchaComponent, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"]
        }], function () {
          return [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]
          }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
          }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]
          }, {
            type: ScriptService
          }];
        }, {
          useGlobalDomain: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          type: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          tabIndex: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          success: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
          }],
          load: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
          }],
          reset: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
          }],
          ready: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
          }],
          error: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
          }],
          expire: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
          }],
          siteKey: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          hl: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }]
        });
      })();

      var ReCaptchaType;

      (function (ReCaptchaType) {
        ReCaptchaType[ReCaptchaType["InvisibleReCaptcha"] = 0] = "InvisibleReCaptcha";
        ReCaptchaType[ReCaptchaType["ReCaptcha2"] = 1] = "ReCaptcha2";
      })(ReCaptchaType || (ReCaptchaType = {}));

      var InvisibleReCaptchaComponent = /*#__PURE__*/function (_BaseReCaptchaCompone) {
        _inherits(InvisibleReCaptchaComponent, _BaseReCaptchaCompone);

        var _super3 = _createSuper(InvisibleReCaptchaComponent);

        function InvisibleReCaptchaComponent(renderer, zone, injector, scriptService) {
          var _this23;

          _classCallCheck(this, InvisibleReCaptchaComponent);

          _this23 = _super3.call(this, renderer, zone, injector, scriptService);
          _this23.renderer = renderer;
          _this23.zone = zone;
          _this23.injector = injector;
          _this23.scriptService = scriptService;
          /**
           * This size representing invisible captcha
           */

          _this23.size = 'invisible';
          /**
           * Theme
           */

          _this23.theme = 'light';
          /**
           * Badge
           */

          _this23.badge = 'bottomright';
          _this23.recaptchaType = ReCaptchaType.InvisibleReCaptcha;
          return _this23;
        }

        _createClass(InvisibleReCaptchaComponent, [{
          key: "ngOnChanges",
          value: function ngOnChanges(changes) {
            _get(_getPrototypeOf(InvisibleReCaptchaComponent.prototype), "ngOnChanges", this).call(this, changes);
          }
          /**
           * Programatically invoke the reCAPTCHA check. Used if the invisible reCAPTCHA is on a div instead of a button.
           */

        }, {
          key: "execute",
          value: function execute() {
            var _this24 = this;

            // execute captcha
            this.zone.runOutsideAngular(function () {
              return _this24.reCaptchaApi.execute(_this24.captchaId);
            });
          }
        }, {
          key: "captchaSpecificSetup",
          value: function captchaSpecificSetup() {}
          /**
          * Gets reCaptcha properties
          */

        }, {
          key: "getCaptchaProperties",
          value: function getCaptchaProperties() {
            var _this25 = this;

            return {
              'sitekey': this.siteKey,
              'callback': function callback(response) {
                return _this25.zone.run(function () {
                  return _this25.handleCallback(response);
                });
              },
              'expired-callback': function expiredCallback() {
                return _this25.zone.run(function () {
                  return _this25.handleExpireCallback();
                });
              },
              'error-callback': function errorCallback() {
                return _this25.zone.run(function () {
                  return _this25.handleErrorCallback();
                });
              },
              'badge': this.badge,
              'type': this.type,
              'tabindex': this.tabIndex,
              'size': this.size,
              'theme': this.theme
            };
          }
        }]);

        return InvisibleReCaptchaComponent;
      }(BaseReCaptchaComponent);

      InvisibleReCaptchaComponent.??fac = function InvisibleReCaptchaComponent_Factory(t) {
        return new (t || InvisibleReCaptchaComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](ScriptService));
      };

      InvisibleReCaptchaComponent.??cmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineComponent"]({
        type: InvisibleReCaptchaComponent,
        selectors: [["ngx-invisible-recaptcha"]],
        viewQuery: function InvisibleReCaptchaComponent_Query(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????viewQuery"](_c0, 1);
          }

          if (rf & 2) {
            var _t;

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????queryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????loadQuery"]()) && (ctx.captchaWrapperElem = _t.first);
          }
        },
        inputs: {
          theme: "theme",
          badge: "badge",
          hl: "hl"
        },
        features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["????ProvidersFeature"]([{
          provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALUE_ACCESSOR"],
          useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(function () {
            return InvisibleReCaptchaComponent;
          }),
          multi: true
        }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????InheritDefinitionFeature"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["????NgOnChangesFeature"]],
        decls: 2,
        vars: 0,
        consts: [["captchaWrapperElem", ""]],
        template: function InvisibleReCaptchaComponent_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????element"](0, "div", null, 0);
          }
        },
        encapsulation: 2
      });
      /** @nocollapse */

      InvisibleReCaptchaComponent.ctorParameters = function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]
        }, {
          type: ScriptService
        }];
      };

      InvisibleReCaptchaComponent.propDecorators = {
        theme: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        badge: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        hl: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        captchaWrapperElem: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
          args: ['captchaWrapperElem', {
            "static": false
          }]
        }]
      };

      (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["??setClassMetadata"](InvisibleReCaptchaComponent, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
          args: [{
            selector: 'ngx-invisible-recaptcha',
            template: "\n  <div #captchaWrapperElem></div>",
            providers: [{
              provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALUE_ACCESSOR"],
              useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(function () {
                return InvisibleReCaptchaComponent;
              }),
              multi: true
            }]
          }]
        }], function () {
          return [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]
          }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
          }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]
          }, {
            type: ScriptService
          }];
        }, {
          theme: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          badge: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          hl: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          captchaWrapperElem: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['captchaWrapperElem', {
              "static": false
            }]
          }]
        });
      })();

      var ReCaptcha2Component = /*#__PURE__*/function (_BaseReCaptchaCompone2) {
        _inherits(ReCaptcha2Component, _BaseReCaptchaCompone2);

        var _super4 = _createSuper(ReCaptcha2Component);

        function ReCaptcha2Component(renderer, zone, injector, scriptService) {
          var _this26;

          _classCallCheck(this, ReCaptcha2Component);

          _this26 = _super4.call(this, renderer, zone, injector, scriptService);
          _this26.renderer = renderer;
          _this26.zone = zone;
          _this26.injector = injector;
          _this26.scriptService = scriptService;
          /**
          * Name of the global expire callback
          */

          _this26.windowOnErrorCallbackProperty = 'ngx_captcha_error_callback';
          /**
          * Name of the global error callback
          */

          _this26.windowOnExpireCallbackProperty = 'ngx_captcha_expire_callback';
          /**
           * Theme
           */

          _this26.theme = 'light';
          /**
          * Size
          */

          _this26.size = 'normal';
          _this26.recaptchaType = ReCaptchaType.ReCaptcha2;
          return _this26;
        }

        _createClass(ReCaptcha2Component, [{
          key: "ngOnChanges",
          value: function ngOnChanges(changes) {
            _get(_getPrototypeOf(ReCaptcha2Component.prototype), "ngOnChanges", this).call(this, changes);
          }
        }, {
          key: "ngOnDestroy",
          value: function ngOnDestroy() {
            window[this.windowOnErrorCallbackProperty] = {};
            window[this.windowOnExpireCallbackProperty] = {};
          }
        }, {
          key: "captchaSpecificSetup",
          value: function captchaSpecificSetup() {
            this.registerCallbacks();
          }
          /**
           * Gets reCaptcha properties
          */

        }, {
          key: "getCaptchaProperties",
          value: function getCaptchaProperties() {
            var _this27 = this;

            return {
              'sitekey': this.siteKey,
              'callback': function callback(response) {
                return _this27.zone.run(function () {
                  return _this27.handleCallback(response);
                });
              },
              'expired-callback': function expiredCallback() {
                return _this27.zone.run(function () {
                  return _this27.handleExpireCallback();
                });
              },
              'error-callback': function errorCallback() {
                return _this27.zone.run(function () {
                  return _this27.handleErrorCallback();
                });
              },
              'theme': this.theme,
              'type': this.type,
              'size': this.size,
              'tabindex': this.tabIndex
            };
          }
          /**
           * Registers global callbacks
          */

        }, {
          key: "registerCallbacks",
          value: function registerCallbacks() {
            window[this.windowOnErrorCallbackProperty] = _get(_getPrototypeOf(ReCaptcha2Component.prototype), "handleErrorCallback", this).bind(this);
            window[this.windowOnExpireCallbackProperty] = _get(_getPrototypeOf(ReCaptcha2Component.prototype), "handleExpireCallback", this).bind(this);
          }
        }]);

        return ReCaptcha2Component;
      }(BaseReCaptchaComponent);

      ReCaptcha2Component.??fac = function ReCaptcha2Component_Factory(t) {
        return new (t || ReCaptcha2Component)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????directiveInject"](ScriptService));
      };

      ReCaptcha2Component.??cmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineComponent"]({
        type: ReCaptcha2Component,
        selectors: [["ngx-recaptcha2"]],
        viewQuery: function ReCaptcha2Component_Query(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????viewQuery"](_c0, 1);
          }

          if (rf & 2) {
            var _t;

            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????queryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????loadQuery"]()) && (ctx.captchaWrapperElem = _t.first);
          }
        },
        inputs: {
          theme: "theme",
          size: "size",
          hl: "hl"
        },
        features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["????ProvidersFeature"]([{
          provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALUE_ACCESSOR"],
          useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(function () {
            return ReCaptcha2Component;
          }),
          multi: true
        }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????InheritDefinitionFeature"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["????NgOnChangesFeature"]],
        decls: 2,
        vars: 0,
        consts: [["captchaWrapperElem", ""]],
        template: function ReCaptcha2Component_Template(rf, ctx) {
          if (rf & 1) {
            _angular_core__WEBPACK_IMPORTED_MODULE_0__["????element"](0, "div", null, 0);
          }
        },
        encapsulation: 2
      });
      /** @nocollapse */

      ReCaptcha2Component.ctorParameters = function () {
        return [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]
        }, {
          type: ScriptService
        }];
      };

      ReCaptcha2Component.propDecorators = {
        theme: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        size: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        hl: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        captchaWrapperElem: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
          args: ['captchaWrapperElem', {
            "static": false
          }]
        }]
      };

      (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["??setClassMetadata"](ReCaptcha2Component, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
          args: [{
            selector: 'ngx-recaptcha2',
            template: "\n  <div #captchaWrapperElem></div>",
            providers: [{
              provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALUE_ACCESSOR"],
              useExisting: Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["forwardRef"])(function () {
                return ReCaptcha2Component;
              }),
              multi: true
            }]
          }]
        }], function () {
          return [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Renderer2"]
          }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
          }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injector"]
          }, {
            type: ScriptService
          }];
        }, {
          theme: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          size: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          hl: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
          }],
          captchaWrapperElem: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['captchaWrapperElem', {
              "static": false
            }]
          }]
        });
      })();

      var ReCaptchaV3Service = /*#__PURE__*/function () {
        function ReCaptchaV3Service(scriptService, zone) {
          _classCallCheck(this, ReCaptchaV3Service);

          this.scriptService = scriptService;
          this.zone = zone;
        }
        /**
         * Executes reCaptcha v3 with given action and passes token via callback. You need to verify
         * this callback in your backend to get meaningful results.
         *
         * For more information see https://developers.google.com/recaptcha/docs/v3
         *
         * @param siteKey Site key found in your google admin panel
         * @param action Action to log
         * @param callback Callback function to to handle token
         * @param config Optional configuration like useGlobalDomain to be provided
         * @param errorCallback Optional Callback function to handle errors
         */


        _createClass(ReCaptchaV3Service, [{
          key: "execute",
          value: function execute(siteKey, action, callback, config, errorCallback) {
            this.executeAsPromise(siteKey, action, config).then(callback)["catch"](function (error) {
              return errorCallback ? errorCallback(error) : console.error(error);
            });
          }
          /**
           * Executes reCaptcha v3 with given action and returns token via Promise. You need to verify
           * this token in your backend to get meaningful results.
           *
           * For more information see https://developers.google.com/recaptcha/docs/v3
           *
           * @param siteKey Site key found in your google admin panel
           * @param action Action to log
           */

        }, {
          key: "executeAsPromise",
          value: function executeAsPromise(siteKey, action, config) {
            var _this28 = this;

            return new Promise(function (resolve, reject) {
              var useGlobalDomain = config && config.useGlobalDomain ? true : false;

              var onRegister = function onRegister(grecaptcha) {
                _this28.zone.runOutsideAngular(function () {
                  try {
                    grecaptcha.execute(siteKey, {
                      action: action
                    }).then(function (token) {
                      return _this28.zone.run(function () {
                        return resolve(token);
                      });
                    });
                  } catch (error) {
                    reject(error);
                  }
                });
              };

              _this28.scriptService.registerCaptchaScript(useGlobalDomain, siteKey, onRegister);
            });
          }
        }]);

        return ReCaptchaV3Service;
      }();

      ReCaptchaV3Service.??fac = function ReCaptchaV3Service_Factory(t) {
        return new (t || ReCaptchaV3Service)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["????inject"](ScriptService), _angular_core__WEBPACK_IMPORTED_MODULE_0__["????inject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]));
      };

      ReCaptchaV3Service.??prov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineInjectable"]({
        token: ReCaptchaV3Service,
        factory: ReCaptchaV3Service.??fac
      });
      /** @nocollapse */

      ReCaptchaV3Service.ctorParameters = function () {
        return [{
          type: ScriptService
        }, {
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
        }];
      };

      (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["??setClassMetadata"](ReCaptchaV3Service, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
        }], function () {
          return [{
            type: ScriptService
          }, {
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"]
          }];
        }, null);
      })();

      var NgxCaptchaModule = function NgxCaptchaModule() {
        _classCallCheck(this, NgxCaptchaModule);
      };

      NgxCaptchaModule.??fac = function NgxCaptchaModule_Factory(t) {
        return new (t || NgxCaptchaModule)();
      };

      NgxCaptchaModule.??mod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineNgModule"]({
        type: NgxCaptchaModule
      });
      NgxCaptchaModule.??inj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["????defineInjector"]({
        providers: [ScriptService, ReCaptchaV3Service],
        imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]]]
      });

      (function () {
        (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["????setNgModuleScope"](NgxCaptchaModule, {
          declarations: function declarations() {
            return [ReCaptcha2Component, InvisibleReCaptchaComponent];
          },
          imports: function imports() {
            return [_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]];
          },
          exports: function exports() {
            return [ReCaptcha2Component, InvisibleReCaptchaComponent];
          }
        });
      })();

      (function () {
        (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["??setClassMetadata"](NgxCaptchaModule, [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
          args: [{
            imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]],
            declarations: [ReCaptcha2Component, InvisibleReCaptchaComponent],
            providers: [ScriptService, ReCaptchaV3Service],
            exports: [ReCaptcha2Component, InvisibleReCaptchaComponent]
          }]
        }], null, null);
      })();
      /*
       * Public API
       */

      /**
       * Generated bundle index. Do not edit.
       */
      //# sourceMappingURL=ngx-captcha.js.map

      /***/

    },

    /***/
    "yLV6":
    /*!*****************************************!*\
      !*** ./node_modules/hammerjs/hammer.js ***!
      \*****************************************/

    /*! no static exports found */

    /***/
    function yLV6(module, exports, __webpack_require__) {
      var __WEBPACK_AMD_DEFINE_RESULT__;
      /*! Hammer.JS - v2.0.7 - 2016-04-22
      * http://hammerjs.github.io/
      *
      * Copyright (c) 2016 Jorik Tangelder;
      * Licensed under the MIT license */


      (function (window, document, exportName, undefined) {
        'use strict';

        var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
        var TEST_ELEMENT = document.createElement('div');
        var TYPE_FUNCTION = 'function';
        var round = Math.round;
        var abs = Math.abs;
        var now = Date.now;
        /**
         * set a timeout with a given scope
         * @param {Function} fn
         * @param {Number} timeout
         * @param {Object} context
         * @returns {number}
         */

        function setTimeoutContext(fn, timeout, context) {
          return setTimeout(bindFn(fn, context), timeout);
        }
        /**
         * if the argument is an array, we want to execute the fn on each entry
         * if it aint an array we don't want to do a thing.
         * this is used by all the methods that accept a single and array argument.
         * @param {*|Array} arg
         * @param {String} fn
         * @param {Object} [context]
         * @returns {Boolean}
         */


        function invokeArrayArg(arg, fn, context) {
          if (Array.isArray(arg)) {
            each(arg, context[fn], context);
            return true;
          }

          return false;
        }
        /**
         * walk objects and arrays
         * @param {Object} obj
         * @param {Function} iterator
         * @param {Object} context
         */


        function each(obj, iterator, context) {
          var i;

          if (!obj) {
            return;
          }

          if (obj.forEach) {
            obj.forEach(iterator, context);
          } else if (obj.length !== undefined) {
            i = 0;

            while (i < obj.length) {
              iterator.call(context, obj[i], i, obj);
              i++;
            }
          } else {
            for (i in obj) {
              obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
            }
          }
        }
        /**
         * wrap a method with a deprecation warning and stack trace
         * @param {Function} method
         * @param {String} name
         * @param {String} message
         * @returns {Function} A new function wrapping the supplied method.
         */


        function deprecate(method, name, message) {
          var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
          return function () {
            var e = new Error('get-stack-trace');
            var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '').replace(/^\s+at\s+/gm, '').replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';
            var log = window.console && (window.console.warn || window.console.log);

            if (log) {
              log.call(window.console, deprecationMessage, stack);
            }

            return method.apply(this, arguments);
          };
        }
        /**
         * extend object.
         * means that properties in dest will be overwritten by the ones in src.
         * @param {Object} target
         * @param {...Object} objects_to_assign
         * @returns {Object} target
         */


        var assign;

        if (typeof Object.assign !== 'function') {
          assign = function assign(target) {
            if (target === undefined || target === null) {
              throw new TypeError('Cannot convert undefined or null to object');
            }

            var output = Object(target);

            for (var index = 1; index < arguments.length; index++) {
              var source = arguments[index];

              if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                  if (source.hasOwnProperty(nextKey)) {
                    output[nextKey] = source[nextKey];
                  }
                }
              }
            }

            return output;
          };
        } else {
          assign = Object.assign;
        }
        /**
         * extend object.
         * means that properties in dest will be overwritten by the ones in src.
         * @param {Object} dest
         * @param {Object} src
         * @param {Boolean} [merge=false]
         * @returns {Object} dest
         */


        var extend = deprecate(function extend(dest, src, merge) {
          var keys = Object.keys(src);
          var i = 0;

          while (i < keys.length) {
            if (!merge || merge && dest[keys[i]] === undefined) {
              dest[keys[i]] = src[keys[i]];
            }

            i++;
          }

          return dest;
        }, 'extend', 'Use `assign`.');
        /**
         * merge the values from src in the dest.
         * means that properties that exist in dest will not be overwritten by src
         * @param {Object} dest
         * @param {Object} src
         * @returns {Object} dest
         */

        var merge = deprecate(function merge(dest, src) {
          return extend(dest, src, true);
        }, 'merge', 'Use `assign`.');
        /**
         * simple class inheritance
         * @param {Function} child
         * @param {Function} base
         * @param {Object} [properties]
         */

        function inherit(child, base, properties) {
          var baseP = base.prototype,
              childP;
          childP = child.prototype = Object.create(baseP);
          childP.constructor = child;
          childP._super = baseP;

          if (properties) {
            assign(childP, properties);
          }
        }
        /**
         * simple function bind
         * @param {Function} fn
         * @param {Object} context
         * @returns {Function}
         */


        function bindFn(fn, context) {
          return function boundFn() {
            return fn.apply(context, arguments);
          };
        }
        /**
         * let a boolean value also be a function that must return a boolean
         * this first item in args will be used as the context
         * @param {Boolean|Function} val
         * @param {Array} [args]
         * @returns {Boolean}
         */


        function boolOrFn(val, args) {
          if (typeof val == TYPE_FUNCTION) {
            return val.apply(args ? args[0] || undefined : undefined, args);
          }

          return val;
        }
        /**
         * use the val2 when val1 is undefined
         * @param {*} val1
         * @param {*} val2
         * @returns {*}
         */


        function ifUndefined(val1, val2) {
          return val1 === undefined ? val2 : val1;
        }
        /**
         * addEventListener with multiple events at once
         * @param {EventTarget} target
         * @param {String} types
         * @param {Function} handler
         */


        function addEventListeners(target, types, handler) {
          each(splitStr(types), function (type) {
            target.addEventListener(type, handler, false);
          });
        }
        /**
         * removeEventListener with multiple events at once
         * @param {EventTarget} target
         * @param {String} types
         * @param {Function} handler
         */


        function removeEventListeners(target, types, handler) {
          each(splitStr(types), function (type) {
            target.removeEventListener(type, handler, false);
          });
        }
        /**
         * find if a node is in the given parent
         * @method hasParent
         * @param {HTMLElement} node
         * @param {HTMLElement} parent
         * @return {Boolean} found
         */


        function hasParent(node, parent) {
          while (node) {
            if (node == parent) {
              return true;
            }

            node = node.parentNode;
          }

          return false;
        }
        /**
         * small indexOf wrapper
         * @param {String} str
         * @param {String} find
         * @returns {Boolean} found
         */


        function inStr(str, find) {
          return str.indexOf(find) > -1;
        }
        /**
         * split string on whitespace
         * @param {String} str
         * @returns {Array} words
         */


        function splitStr(str) {
          return str.trim().split(/\s+/g);
        }
        /**
         * find if a array contains the object using indexOf or a simple polyFill
         * @param {Array} src
         * @param {String} find
         * @param {String} [findByKey]
         * @return {Boolean|Number} false when not found, or the index
         */


        function inArray(src, find, findByKey) {
          if (src.indexOf && !findByKey) {
            return src.indexOf(find);
          } else {
            var i = 0;

            while (i < src.length) {
              if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
                return i;
              }

              i++;
            }

            return -1;
          }
        }
        /**
         * convert array-like objects to real arrays
         * @param {Object} obj
         * @returns {Array}
         */


        function toArray(obj) {
          return Array.prototype.slice.call(obj, 0);
        }
        /**
         * unique array with objects based on a key (like 'id') or just by the array's value
         * @param {Array} src [{id:1},{id:2},{id:1}]
         * @param {String} [key]
         * @param {Boolean} [sort=False]
         * @returns {Array} [{id:1},{id:2}]
         */


        function uniqueArray(src, key, sort) {
          var results = [];
          var values = [];
          var i = 0;

          while (i < src.length) {
            var val = key ? src[i][key] : src[i];

            if (inArray(values, val) < 0) {
              results.push(src[i]);
            }

            values[i] = val;
            i++;
          }

          if (sort) {
            if (!key) {
              results = results.sort();
            } else {
              results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
              });
            }
          }

          return results;
        }
        /**
         * get the prefixed property
         * @param {Object} obj
         * @param {String} property
         * @returns {String|Undefined} prefixed
         */


        function prefixed(obj, property) {
          var prefix, prop;
          var camelProp = property[0].toUpperCase() + property.slice(1);
          var i = 0;

          while (i < VENDOR_PREFIXES.length) {
            prefix = VENDOR_PREFIXES[i];
            prop = prefix ? prefix + camelProp : property;

            if (prop in obj) {
              return prop;
            }

            i++;
          }

          return undefined;
        }
        /**
         * get a unique id
         * @returns {number} uniqueId
         */


        var _uniqueId = 1;

        function uniqueId() {
          return _uniqueId++;
        }
        /**
         * get the window object of an element
         * @param {HTMLElement} element
         * @returns {DocumentView|Window}
         */


        function getWindowForElement(element) {
          var doc = element.ownerDocument || element;
          return doc.defaultView || doc.parentWindow || window;
        }

        var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
        var SUPPORT_TOUCH = ('ontouchstart' in window);
        var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
        var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
        var INPUT_TYPE_TOUCH = 'touch';
        var INPUT_TYPE_PEN = 'pen';
        var INPUT_TYPE_MOUSE = 'mouse';
        var INPUT_TYPE_KINECT = 'kinect';
        var COMPUTE_INTERVAL = 25;
        var INPUT_START = 1;
        var INPUT_MOVE = 2;
        var INPUT_END = 4;
        var INPUT_CANCEL = 8;
        var DIRECTION_NONE = 1;
        var DIRECTION_LEFT = 2;
        var DIRECTION_RIGHT = 4;
        var DIRECTION_UP = 8;
        var DIRECTION_DOWN = 16;
        var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
        var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
        var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
        var PROPS_XY = ['x', 'y'];
        var PROPS_CLIENT_XY = ['clientX', 'clientY'];
        /**
         * create new input type manager
         * @param {Manager} manager
         * @param {Function} callback
         * @returns {Input}
         * @constructor
         */

        function Input(manager, callback) {
          var self = this;
          this.manager = manager;
          this.callback = callback;
          this.element = manager.element;
          this.target = manager.options.inputTarget; // smaller wrapper around the handler, for the scope and the enabled state of the manager,
          // so when disabled the input events are completely bypassed.

          this.domHandler = function (ev) {
            if (boolOrFn(manager.options.enable, [manager])) {
              self.handler(ev);
            }
          };

          this.init();
        }

        Input.prototype = {
          /**
           * should handle the inputEvent data and trigger the callback
           * @virtual
           */
          handler: function handler() {},

          /**
           * bind the events
           */
          init: function init() {
            this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
          },

          /**
           * unbind the events
           */
          destroy: function destroy() {
            this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
          }
        };
        /**
         * create new input type manager
         * called by the Manager constructor
         * @param {Hammer} manager
         * @returns {Input}
         */

        function createInputInstance(manager) {
          var Type;
          var inputClass = manager.options.inputClass;

          if (inputClass) {
            Type = inputClass;
          } else if (SUPPORT_POINTER_EVENTS) {
            Type = PointerEventInput;
          } else if (SUPPORT_ONLY_TOUCH) {
            Type = TouchInput;
          } else if (!SUPPORT_TOUCH) {
            Type = MouseInput;
          } else {
            Type = TouchMouseInput;
          }

          return new Type(manager, inputHandler);
        }
        /**
         * handle input events
         * @param {Manager} manager
         * @param {String} eventType
         * @param {Object} input
         */


        function inputHandler(manager, eventType, input) {
          var pointersLen = input.pointers.length;
          var changedPointersLen = input.changedPointers.length;
          var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
          var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;
          input.isFirst = !!isFirst;
          input.isFinal = !!isFinal;

          if (isFirst) {
            manager.session = {};
          } // source event is the normalized value of the domEvents
          // like 'touchstart, mouseup, pointerdown'


          input.eventType = eventType; // compute scale, rotation etc

          computeInputData(manager, input); // emit secret event

          manager.emit('hammer.input', input);
          manager.recognize(input);
          manager.session.prevInput = input;
        }
        /**
         * extend the data with some usable properties like scale, rotate, velocity etc
         * @param {Object} manager
         * @param {Object} input
         */


        function computeInputData(manager, input) {
          var session = manager.session;
          var pointers = input.pointers;
          var pointersLength = pointers.length; // store the first input to calculate the distance and direction

          if (!session.firstInput) {
            session.firstInput = simpleCloneInputData(input);
          } // to compute scale and rotation we need to store the multiple touches


          if (pointersLength > 1 && !session.firstMultiple) {
            session.firstMultiple = simpleCloneInputData(input);
          } else if (pointersLength === 1) {
            session.firstMultiple = false;
          }

          var firstInput = session.firstInput;
          var firstMultiple = session.firstMultiple;
          var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
          var center = input.center = getCenter(pointers);
          input.timeStamp = now();
          input.deltaTime = input.timeStamp - firstInput.timeStamp;
          input.angle = getAngle(offsetCenter, center);
          input.distance = getDistance(offsetCenter, center);
          computeDeltaXY(session, input);
          input.offsetDirection = getDirection(input.deltaX, input.deltaY);
          var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
          input.overallVelocityX = overallVelocity.x;
          input.overallVelocityY = overallVelocity.y;
          input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;
          input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
          input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
          input.maxPointers = !session.prevInput ? input.pointers.length : input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers;
          computeIntervalInputData(session, input); // find the correct target

          var target = manager.element;

          if (hasParent(input.srcEvent.target, target)) {
            target = input.srcEvent.target;
          }

          input.target = target;
        }

        function computeDeltaXY(session, input) {
          var center = input.center;
          var offset = session.offsetDelta || {};
          var prevDelta = session.prevDelta || {};
          var prevInput = session.prevInput || {};

          if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
            prevDelta = session.prevDelta = {
              x: prevInput.deltaX || 0,
              y: prevInput.deltaY || 0
            };
            offset = session.offsetDelta = {
              x: center.x,
              y: center.y
            };
          }

          input.deltaX = prevDelta.x + (center.x - offset.x);
          input.deltaY = prevDelta.y + (center.y - offset.y);
        }
        /**
         * velocity is calculated every x ms
         * @param {Object} session
         * @param {Object} input
         */


        function computeIntervalInputData(session, input) {
          var last = session.lastInterval || input,
              deltaTime = input.timeStamp - last.timeStamp,
              velocity,
              velocityX,
              velocityY,
              direction;

          if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
            var deltaX = input.deltaX - last.deltaX;
            var deltaY = input.deltaY - last.deltaY;
            var v = getVelocity(deltaTime, deltaX, deltaY);
            velocityX = v.x;
            velocityY = v.y;
            velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
            direction = getDirection(deltaX, deltaY);
            session.lastInterval = input;
          } else {
            // use latest velocity info if it doesn't overtake a minimum period
            velocity = last.velocity;
            velocityX = last.velocityX;
            velocityY = last.velocityY;
            direction = last.direction;
          }

          input.velocity = velocity;
          input.velocityX = velocityX;
          input.velocityY = velocityY;
          input.direction = direction;
        }
        /**
         * create a simple clone from the input used for storage of firstInput and firstMultiple
         * @param {Object} input
         * @returns {Object} clonedInputData
         */


        function simpleCloneInputData(input) {
          // make a simple copy of the pointers because we will get a reference if we don't
          // we only need clientXY for the calculations
          var pointers = [];
          var i = 0;

          while (i < input.pointers.length) {
            pointers[i] = {
              clientX: round(input.pointers[i].clientX),
              clientY: round(input.pointers[i].clientY)
            };
            i++;
          }

          return {
            timeStamp: now(),
            pointers: pointers,
            center: getCenter(pointers),
            deltaX: input.deltaX,
            deltaY: input.deltaY
          };
        }
        /**
         * get the center of all the pointers
         * @param {Array} pointers
         * @return {Object} center contains `x` and `y` properties
         */


        function getCenter(pointers) {
          var pointersLength = pointers.length; // no need to loop when only one touch

          if (pointersLength === 1) {
            return {
              x: round(pointers[0].clientX),
              y: round(pointers[0].clientY)
            };
          }

          var x = 0,
              y = 0,
              i = 0;

          while (i < pointersLength) {
            x += pointers[i].clientX;
            y += pointers[i].clientY;
            i++;
          }

          return {
            x: round(x / pointersLength),
            y: round(y / pointersLength)
          };
        }
        /**
         * calculate the velocity between two points. unit is in px per ms.
         * @param {Number} deltaTime
         * @param {Number} x
         * @param {Number} y
         * @return {Object} velocity `x` and `y`
         */


        function getVelocity(deltaTime, x, y) {
          return {
            x: x / deltaTime || 0,
            y: y / deltaTime || 0
          };
        }
        /**
         * get the direction between two points
         * @param {Number} x
         * @param {Number} y
         * @return {Number} direction
         */


        function getDirection(x, y) {
          if (x === y) {
            return DIRECTION_NONE;
          }

          if (abs(x) >= abs(y)) {
            return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
          }

          return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
        }
        /**
         * calculate the absolute distance between two points
         * @param {Object} p1 {x, y}
         * @param {Object} p2 {x, y}
         * @param {Array} [props] containing x and y keys
         * @return {Number} distance
         */


        function getDistance(p1, p2, props) {
          if (!props) {
            props = PROPS_XY;
          }

          var x = p2[props[0]] - p1[props[0]],
              y = p2[props[1]] - p1[props[1]];
          return Math.sqrt(x * x + y * y);
        }
        /**
         * calculate the angle between two coordinates
         * @param {Object} p1
         * @param {Object} p2
         * @param {Array} [props] containing x and y keys
         * @return {Number} angle
         */


        function getAngle(p1, p2, props) {
          if (!props) {
            props = PROPS_XY;
          }

          var x = p2[props[0]] - p1[props[0]],
              y = p2[props[1]] - p1[props[1]];
          return Math.atan2(y, x) * 180 / Math.PI;
        }
        /**
         * calculate the rotation degrees between two pointersets
         * @param {Array} start array of pointers
         * @param {Array} end array of pointers
         * @return {Number} rotation
         */


        function getRotation(start, end) {
          return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
        }
        /**
         * calculate the scale factor between two pointersets
         * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
         * @param {Array} start array of pointers
         * @param {Array} end array of pointers
         * @return {Number} scale
         */


        function getScale(start, end) {
          return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
        }

        var MOUSE_INPUT_MAP = {
          mousedown: INPUT_START,
          mousemove: INPUT_MOVE,
          mouseup: INPUT_END
        };
        var MOUSE_ELEMENT_EVENTS = 'mousedown';
        var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';
        /**
         * Mouse events input
         * @constructor
         * @extends Input
         */

        function MouseInput() {
          this.evEl = MOUSE_ELEMENT_EVENTS;
          this.evWin = MOUSE_WINDOW_EVENTS;
          this.pressed = false; // mousedown state

          Input.apply(this, arguments);
        }

        inherit(MouseInput, Input, {
          /**
           * handle mouse events
           * @param {Object} ev
           */
          handler: function MEhandler(ev) {
            var eventType = MOUSE_INPUT_MAP[ev.type]; // on start we want to have the left mouse button down

            if (eventType & INPUT_START && ev.button === 0) {
              this.pressed = true;
            }

            if (eventType & INPUT_MOVE && ev.which !== 1) {
              eventType = INPUT_END;
            } // mouse must be down


            if (!this.pressed) {
              return;
            }

            if (eventType & INPUT_END) {
              this.pressed = false;
            }

            this.callback(this.manager, eventType, {
              pointers: [ev],
              changedPointers: [ev],
              pointerType: INPUT_TYPE_MOUSE,
              srcEvent: ev
            });
          }
        });
        var POINTER_INPUT_MAP = {
          pointerdown: INPUT_START,
          pointermove: INPUT_MOVE,
          pointerup: INPUT_END,
          pointercancel: INPUT_CANCEL,
          pointerout: INPUT_CANCEL
        }; // in IE10 the pointer types is defined as an enum

        var IE10_POINTER_TYPE_ENUM = {
          2: INPUT_TYPE_TOUCH,
          3: INPUT_TYPE_PEN,
          4: INPUT_TYPE_MOUSE,
          5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816

        };
        var POINTER_ELEMENT_EVENTS = 'pointerdown';
        var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel'; // IE10 has prefixed support, and case-sensitive

        if (window.MSPointerEvent && !window.PointerEvent) {
          POINTER_ELEMENT_EVENTS = 'MSPointerDown';
          POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
        }
        /**
         * Pointer events input
         * @constructor
         * @extends Input
         */


        function PointerEventInput() {
          this.evEl = POINTER_ELEMENT_EVENTS;
          this.evWin = POINTER_WINDOW_EVENTS;
          Input.apply(this, arguments);
          this.store = this.manager.session.pointerEvents = [];
        }

        inherit(PointerEventInput, Input, {
          /**
           * handle mouse events
           * @param {Object} ev
           */
          handler: function PEhandler(ev) {
            var store = this.store;
            var removePointer = false;
            var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
            var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
            var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
            var isTouch = pointerType == INPUT_TYPE_TOUCH; // get index of the event in the store

            var storeIndex = inArray(store, ev.pointerId, 'pointerId'); // start and mouse must be down

            if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
              if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
              }
            } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
              removePointer = true;
            } // it not found, so the pointer hasn't been down (so it's probably a hover)


            if (storeIndex < 0) {
              return;
            } // update the event in the store


            store[storeIndex] = ev;
            this.callback(this.manager, eventType, {
              pointers: store,
              changedPointers: [ev],
              pointerType: pointerType,
              srcEvent: ev
            });

            if (removePointer) {
              // remove from the store
              store.splice(storeIndex, 1);
            }
          }
        });
        var SINGLE_TOUCH_INPUT_MAP = {
          touchstart: INPUT_START,
          touchmove: INPUT_MOVE,
          touchend: INPUT_END,
          touchcancel: INPUT_CANCEL
        };
        var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
        var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';
        /**
         * Touch events input
         * @constructor
         * @extends Input
         */

        function SingleTouchInput() {
          this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
          this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
          this.started = false;
          Input.apply(this, arguments);
        }

        inherit(SingleTouchInput, Input, {
          handler: function TEhandler(ev) {
            var type = SINGLE_TOUCH_INPUT_MAP[ev.type]; // should we handle the touch events?

            if (type === INPUT_START) {
              this.started = true;
            }

            if (!this.started) {
              return;
            }

            var touches = normalizeSingleTouches.call(this, ev, type); // when done, reset the started state

            if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
              this.started = false;
            }

            this.callback(this.manager, type, {
              pointers: touches[0],
              changedPointers: touches[1],
              pointerType: INPUT_TYPE_TOUCH,
              srcEvent: ev
            });
          }
        });
        /**
         * @this {TouchInput}
         * @param {Object} ev
         * @param {Number} type flag
         * @returns {undefined|Array} [all, changed]
         */

        function normalizeSingleTouches(ev, type) {
          var all = toArray(ev.touches);
          var changed = toArray(ev.changedTouches);

          if (type & (INPUT_END | INPUT_CANCEL)) {
            all = uniqueArray(all.concat(changed), 'identifier', true);
          }

          return [all, changed];
        }

        var TOUCH_INPUT_MAP = {
          touchstart: INPUT_START,
          touchmove: INPUT_MOVE,
          touchend: INPUT_END,
          touchcancel: INPUT_CANCEL
        };
        var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';
        /**
         * Multi-user touch events input
         * @constructor
         * @extends Input
         */

        function TouchInput() {
          this.evTarget = TOUCH_TARGET_EVENTS;
          this.targetIds = {};
          Input.apply(this, arguments);
        }

        inherit(TouchInput, Input, {
          handler: function MTEhandler(ev) {
            var type = TOUCH_INPUT_MAP[ev.type];
            var touches = getTouches.call(this, ev, type);

            if (!touches) {
              return;
            }

            this.callback(this.manager, type, {
              pointers: touches[0],
              changedPointers: touches[1],
              pointerType: INPUT_TYPE_TOUCH,
              srcEvent: ev
            });
          }
        });
        /**
         * @this {TouchInput}
         * @param {Object} ev
         * @param {Number} type flag
         * @returns {undefined|Array} [all, changed]
         */

        function getTouches(ev, type) {
          var allTouches = toArray(ev.touches);
          var targetIds = this.targetIds; // when there is only one touch, the process can be simplified

          if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches];
          }

          var i,
              targetTouches,
              changedTouches = toArray(ev.changedTouches),
              changedTargetTouches = [],
              target = this.target; // get target touches from touches

          targetTouches = allTouches.filter(function (touch) {
            return hasParent(touch.target, target);
          }); // collect touches

          if (type === INPUT_START) {
            i = 0;

            while (i < targetTouches.length) {
              targetIds[targetTouches[i].identifier] = true;
              i++;
            }
          } // filter changed touches to only contain touches that exist in the collected target ids


          i = 0;

          while (i < changedTouches.length) {
            if (targetIds[changedTouches[i].identifier]) {
              changedTargetTouches.push(changedTouches[i]);
            } // cleanup removed touches


            if (type & (INPUT_END | INPUT_CANCEL)) {
              delete targetIds[changedTouches[i].identifier];
            }

            i++;
          }

          if (!changedTargetTouches.length) {
            return;
          }

          return [// merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
          uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true), changedTargetTouches];
        }
        /**
         * Combined touch and mouse input
         *
         * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
         * This because touch devices also emit mouse events while doing a touch.
         *
         * @constructor
         * @extends Input
         */


        var DEDUP_TIMEOUT = 2500;
        var DEDUP_DISTANCE = 25;

        function TouchMouseInput() {
          Input.apply(this, arguments);
          var handler = bindFn(this.handler, this);
          this.touch = new TouchInput(this.manager, handler);
          this.mouse = new MouseInput(this.manager, handler);
          this.primaryTouch = null;
          this.lastTouches = [];
        }

        inherit(TouchMouseInput, Input, {
          /**
           * handle mouse and touch events
           * @param {Hammer} manager
           * @param {String} inputEvent
           * @param {Object} inputData
           */
          handler: function TMEhandler(manager, inputEvent, inputData) {
            var isTouch = inputData.pointerType == INPUT_TYPE_TOUCH,
                isMouse = inputData.pointerType == INPUT_TYPE_MOUSE;

            if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
              return;
            } // when we're in a touch event, record touches to  de-dupe synthetic mouse event


            if (isTouch) {
              recordTouches.call(this, inputEvent, inputData);
            } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
              return;
            }

            this.callback(manager, inputEvent, inputData);
          },

          /**
           * remove the event listeners
           */
          destroy: function destroy() {
            this.touch.destroy();
            this.mouse.destroy();
          }
        });

        function recordTouches(eventType, eventData) {
          if (eventType & INPUT_START) {
            this.primaryTouch = eventData.changedPointers[0].identifier;
            setLastTouch.call(this, eventData);
          } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            setLastTouch.call(this, eventData);
          }
        }

        function setLastTouch(eventData) {
          var touch = eventData.changedPointers[0];

          if (touch.identifier === this.primaryTouch) {
            var lastTouch = {
              x: touch.clientX,
              y: touch.clientY
            };
            this.lastTouches.push(lastTouch);
            var lts = this.lastTouches;

            var removeLastTouch = function removeLastTouch() {
              var i = lts.indexOf(lastTouch);

              if (i > -1) {
                lts.splice(i, 1);
              }
            };

            setTimeout(removeLastTouch, DEDUP_TIMEOUT);
          }
        }

        function isSyntheticEvent(eventData) {
          var x = eventData.srcEvent.clientX,
              y = eventData.srcEvent.clientY;

          for (var i = 0; i < this.lastTouches.length; i++) {
            var t = this.lastTouches[i];
            var dx = Math.abs(x - t.x),
                dy = Math.abs(y - t.y);

            if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
              return true;
            }
          }

          return false;
        }

        var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
        var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined; // magical touchAction value

        var TOUCH_ACTION_COMPUTE = 'compute';
        var TOUCH_ACTION_AUTO = 'auto';
        var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented

        var TOUCH_ACTION_NONE = 'none';
        var TOUCH_ACTION_PAN_X = 'pan-x';
        var TOUCH_ACTION_PAN_Y = 'pan-y';
        var TOUCH_ACTION_MAP = getTouchActionProps();
        /**
         * Touch Action
         * sets the touchAction property or uses the js alternative
         * @param {Manager} manager
         * @param {String} value
         * @constructor
         */

        function TouchAction(manager, value) {
          this.manager = manager;
          this.set(value);
        }

        TouchAction.prototype = {
          /**
           * set the touchAction value on the element or enable the polyfill
           * @param {String} value
           */
          set: function set(value) {
            // find out the touch-action by the event handlers
            if (value == TOUCH_ACTION_COMPUTE) {
              value = this.compute();
            }

            if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
              this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
            }

            this.actions = value.toLowerCase().trim();
          },

          /**
           * just re-set the touchAction value
           */
          update: function update() {
            this.set(this.manager.options.touchAction);
          },

          /**
           * compute the value for the touchAction property based on the recognizer's settings
           * @returns {String} value
           */
          compute: function compute() {
            var actions = [];
            each(this.manager.recognizers, function (recognizer) {
              if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
              }
            });
            return cleanTouchActions(actions.join(' '));
          },

          /**
           * this method is called on each input cycle and provides the preventing of the browser behavior
           * @param {Object} input
           */
          preventDefaults: function preventDefaults(input) {
            var srcEvent = input.srcEvent;
            var direction = input.offsetDirection; // if the touch action did prevented once this session

            if (this.manager.session.prevented) {
              srcEvent.preventDefault();
              return;
            }

            var actions = this.actions;
            var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
            var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
            var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

            if (hasNone) {
              //do not prevent defaults if this is a tap gesture
              var isTapPointer = input.pointers.length === 1;
              var isTapMovement = input.distance < 2;
              var isTapTouchTime = input.deltaTime < 250;

              if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
              }
            }

            if (hasPanX && hasPanY) {
              // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
              return;
            }

            if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
              return this.preventSrc(srcEvent);
            }
          },

          /**
           * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
           * @param {Object} srcEvent
           */
          preventSrc: function preventSrc(srcEvent) {
            this.manager.session.prevented = true;
            srcEvent.preventDefault();
          }
        };
        /**
         * when the touchActions are collected they are not a valid value, so we need to clean things up. *
         * @param {String} actions
         * @returns {*}
         */

        function cleanTouchActions(actions) {
          // none
          if (inStr(actions, TOUCH_ACTION_NONE)) {
            return TOUCH_ACTION_NONE;
          }

          var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
          var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y); // if both pan-x and pan-y are set (different recognizers
          // for different directions, e.g. horizontal pan but vertical swipe?)
          // we need none (as otherwise with pan-x pan-y combined none of these
          // recognizers will work, since the browser would handle all panning

          if (hasPanX && hasPanY) {
            return TOUCH_ACTION_NONE;
          } // pan-x OR pan-y


          if (hasPanX || hasPanY) {
            return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
          } // manipulation


          if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
            return TOUCH_ACTION_MANIPULATION;
          }

          return TOUCH_ACTION_AUTO;
        }

        function getTouchActionProps() {
          if (!NATIVE_TOUCH_ACTION) {
            return false;
          }

          var touchMap = {};
          var cssSupports = window.CSS && window.CSS.supports;
          ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function (val) {
            // If css.supports is not supported but there is native touch-action assume it supports
            // all values. This is the case for IE 10 and 11.
            touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
          });
          return touchMap;
        }
        /**
         * Recognizer flow explained; *
         * All recognizers have the initial state of POSSIBLE when a input session starts.
         * The definition of a input session is from the first input until the last input, with all it's movement in it. *
         * Example session for mouse-input: mousedown -> mousemove -> mouseup
         *
         * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
         * which determines with state it should be.
         *
         * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
         * POSSIBLE to give it another change on the next cycle.
         *
         *               Possible
         *                  |
         *            +-----+---------------+
         *            |                     |
         *      +-----+-----+               |
         *      |           |               |
         *   Failed      Cancelled          |
         *                          +-------+------+
         *                          |              |
         *                      Recognized       Began
         *                                         |
         *                                      Changed
         *                                         |
         *                                  Ended/Recognized
         */


        var STATE_POSSIBLE = 1;
        var STATE_BEGAN = 2;
        var STATE_CHANGED = 4;
        var STATE_ENDED = 8;
        var STATE_RECOGNIZED = STATE_ENDED;
        var STATE_CANCELLED = 16;
        var STATE_FAILED = 32;
        /**
         * Recognizer
         * Every recognizer needs to extend from this class.
         * @constructor
         * @param {Object} options
         */

        function Recognizer(options) {
          this.options = assign({}, this.defaults, options || {});
          this.id = uniqueId();
          this.manager = null; // default is enable true

          this.options.enable = ifUndefined(this.options.enable, true);
          this.state = STATE_POSSIBLE;
          this.simultaneous = {};
          this.requireFail = [];
        }

        Recognizer.prototype = {
          /**
           * @virtual
           * @type {Object}
           */
          defaults: {},

          /**
           * set options
           * @param {Object} options
           * @return {Recognizer}
           */
          set: function set(options) {
            assign(this.options, options); // also update the touchAction, in case something changed about the directions/enabled state

            this.manager && this.manager.touchAction.update();
            return this;
          },

          /**
           * recognize simultaneous with an other recognizer.
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          recognizeWith: function recognizeWith(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
              return this;
            }

            var simultaneous = this.simultaneous;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);

            if (!simultaneous[otherRecognizer.id]) {
              simultaneous[otherRecognizer.id] = otherRecognizer;
              otherRecognizer.recognizeWith(this);
            }

            return this;
          },

          /**
           * drop the simultaneous link. it doesnt remove the link on the other recognizer.
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          dropRecognizeWith: function dropRecognizeWith(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
              return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            delete this.simultaneous[otherRecognizer.id];
            return this;
          },

          /**
           * recognizer can only run when an other is failing
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          requireFailure: function requireFailure(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
              return this;
            }

            var requireFail = this.requireFail;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);

            if (inArray(requireFail, otherRecognizer) === -1) {
              requireFail.push(otherRecognizer);
              otherRecognizer.requireFailure(this);
            }

            return this;
          },

          /**
           * drop the requireFailure link. it does not remove the link on the other recognizer.
           * @param {Recognizer} otherRecognizer
           * @returns {Recognizer} this
           */
          dropRequireFailure: function dropRequireFailure(otherRecognizer) {
            if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
              return this;
            }

            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
            var index = inArray(this.requireFail, otherRecognizer);

            if (index > -1) {
              this.requireFail.splice(index, 1);
            }

            return this;
          },

          /**
           * has require failures boolean
           * @returns {boolean}
           */
          hasRequireFailures: function hasRequireFailures() {
            return this.requireFail.length > 0;
          },

          /**
           * if the recognizer can recognize simultaneous with an other recognizer
           * @param {Recognizer} otherRecognizer
           * @returns {Boolean}
           */
          canRecognizeWith: function canRecognizeWith(otherRecognizer) {
            return !!this.simultaneous[otherRecognizer.id];
          },

          /**
           * You should use `tryEmit` instead of `emit` directly to check
           * that all the needed recognizers has failed before emitting.
           * @param {Object} input
           */
          emit: function emit(input) {
            var self = this;
            var state = this.state;

            function emit(event) {
              self.manager.emit(event, input);
            } // 'panstart' and 'panmove'


            if (state < STATE_ENDED) {
              emit(self.options.event + stateStr(state));
            }

            emit(self.options.event); // simple 'eventName' events

            if (input.additionalEvent) {
              // additional event(panleft, panright, pinchin, pinchout...)
              emit(input.additionalEvent);
            } // panend and pancancel


            if (state >= STATE_ENDED) {
              emit(self.options.event + stateStr(state));
            }
          },

          /**
           * Check that all the require failure recognizers has failed,
           * if true, it emits a gesture event,
           * otherwise, setup the state to FAILED.
           * @param {Object} input
           */
          tryEmit: function tryEmit(input) {
            if (this.canEmit()) {
              return this.emit(input);
            } // it's failing anyway


            this.state = STATE_FAILED;
          },

          /**
           * can we emit?
           * @returns {boolean}
           */
          canEmit: function canEmit() {
            var i = 0;

            while (i < this.requireFail.length) {
              if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
              }

              i++;
            }

            return true;
          },

          /**
           * update the recognizer
           * @param {Object} inputData
           */
          recognize: function recognize(inputData) {
            // make a new copy of the inputData
            // so we can change the inputData without messing up the other recognizers
            var inputDataClone = assign({}, inputData); // is is enabled and allow recognizing?

            if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
              this.reset();
              this.state = STATE_FAILED;
              return;
            } // reset when we've reached the end


            if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
              this.state = STATE_POSSIBLE;
            }

            this.state = this.process(inputDataClone); // the recognizer has recognized a gesture
            // so trigger an event

            if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
              this.tryEmit(inputDataClone);
            }
          },

          /**
           * return the state of the recognizer
           * the actual recognizing happens in this method
           * @virtual
           * @param {Object} inputData
           * @returns {Const} STATE
           */
          process: function process(inputData) {},
          // jshint ignore:line

          /**
           * return the preferred touch-action
           * @virtual
           * @returns {Array}
           */
          getTouchAction: function getTouchAction() {},

          /**
           * called when the gesture isn't allowed to recognize
           * like when another is being recognized or it is disabled
           * @virtual
           */
          reset: function reset() {}
        };
        /**
         * get a usable string, used as event postfix
         * @param {Const} state
         * @returns {String} state
         */

        function stateStr(state) {
          if (state & STATE_CANCELLED) {
            return 'cancel';
          } else if (state & STATE_ENDED) {
            return 'end';
          } else if (state & STATE_CHANGED) {
            return 'move';
          } else if (state & STATE_BEGAN) {
            return 'start';
          }

          return '';
        }
        /**
         * direction cons to string
         * @param {Const} direction
         * @returns {String}
         */


        function directionStr(direction) {
          if (direction == DIRECTION_DOWN) {
            return 'down';
          } else if (direction == DIRECTION_UP) {
            return 'up';
          } else if (direction == DIRECTION_LEFT) {
            return 'left';
          } else if (direction == DIRECTION_RIGHT) {
            return 'right';
          }

          return '';
        }
        /**
         * get a recognizer by name if it is bound to a manager
         * @param {Recognizer|String} otherRecognizer
         * @param {Recognizer} recognizer
         * @returns {Recognizer}
         */


        function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
          var manager = recognizer.manager;

          if (manager) {
            return manager.get(otherRecognizer);
          }

          return otherRecognizer;
        }
        /**
         * This recognizer is just used as a base for the simple attribute recognizers.
         * @constructor
         * @extends Recognizer
         */


        function AttrRecognizer() {
          Recognizer.apply(this, arguments);
        }

        inherit(AttrRecognizer, Recognizer, {
          /**
           * @namespace
           * @memberof AttrRecognizer
           */
          defaults: {
            /**
             * @type {Number}
             * @default 1
             */
            pointers: 1
          },

          /**
           * Used to check if it the recognizer receives valid input, like input.distance > 10.
           * @memberof AttrRecognizer
           * @param {Object} input
           * @returns {Boolean} recognized
           */
          attrTest: function attrTest(input) {
            var optionPointers = this.options.pointers;
            return optionPointers === 0 || input.pointers.length === optionPointers;
          },

          /**
           * Process the input and return the state for the recognizer
           * @memberof AttrRecognizer
           * @param {Object} input
           * @returns {*} State
           */
          process: function process(input) {
            var state = this.state;
            var eventType = input.eventType;
            var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
            var isValid = this.attrTest(input); // on cancel input and we've recognized before, return STATE_CANCELLED

            if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
              return state | STATE_CANCELLED;
            } else if (isRecognized || isValid) {
              if (eventType & INPUT_END) {
                return state | STATE_ENDED;
              } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
              }

              return state | STATE_CHANGED;
            }

            return STATE_FAILED;
          }
        });
        /**
         * Pan
         * Recognized when the pointer is down and moved in the allowed direction.
         * @constructor
         * @extends AttrRecognizer
         */

        function PanRecognizer() {
          AttrRecognizer.apply(this, arguments);
          this.pX = null;
          this.pY = null;
        }

        inherit(PanRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof PanRecognizer
           */
          defaults: {
            event: 'pan',
            threshold: 10,
            pointers: 1,
            direction: DIRECTION_ALL
          },
          getTouchAction: function getTouchAction() {
            var direction = this.options.direction;
            var actions = [];

            if (direction & DIRECTION_HORIZONTAL) {
              actions.push(TOUCH_ACTION_PAN_Y);
            }

            if (direction & DIRECTION_VERTICAL) {
              actions.push(TOUCH_ACTION_PAN_X);
            }

            return actions;
          },
          directionTest: function directionTest(input) {
            var options = this.options;
            var hasMoved = true;
            var distance = input.distance;
            var direction = input.direction;
            var x = input.deltaX;
            var y = input.deltaY; // lock to axis?

            if (!(direction & options.direction)) {
              if (options.direction & DIRECTION_HORIZONTAL) {
                direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
              } else {
                direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
              }
            }

            input.direction = direction;
            return hasMoved && distance > options.threshold && direction & options.direction;
          },
          attrTest: function attrTest(input) {
            return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
          },
          emit: function emit(input) {
            this.pX = input.deltaX;
            this.pY = input.deltaY;
            var direction = directionStr(input.direction);

            if (direction) {
              input.additionalEvent = this.options.event + direction;
            }

            this._super.emit.call(this, input);
          }
        });
        /**
         * Pinch
         * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
         * @constructor
         * @extends AttrRecognizer
         */

        function PinchRecognizer() {
          AttrRecognizer.apply(this, arguments);
        }

        inherit(PinchRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof PinchRecognizer
           */
          defaults: {
            event: 'pinch',
            threshold: 0,
            pointers: 2
          },
          getTouchAction: function getTouchAction() {
            return [TOUCH_ACTION_NONE];
          },
          attrTest: function attrTest(input) {
            return this._super.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
          },
          emit: function emit(input) {
            if (input.scale !== 1) {
              var inOut = input.scale < 1 ? 'in' : 'out';
              input.additionalEvent = this.options.event + inOut;
            }

            this._super.emit.call(this, input);
          }
        });
        /**
         * Press
         * Recognized when the pointer is down for x ms without any movement.
         * @constructor
         * @extends Recognizer
         */

        function PressRecognizer() {
          Recognizer.apply(this, arguments);
          this._timer = null;
          this._input = null;
        }

        inherit(PressRecognizer, Recognizer, {
          /**
           * @namespace
           * @memberof PressRecognizer
           */
          defaults: {
            event: 'press',
            pointers: 1,
            time: 251,
            // minimal time of the pointer to be pressed
            threshold: 9 // a minimal movement is ok, but keep it low

          },
          getTouchAction: function getTouchAction() {
            return [TOUCH_ACTION_AUTO];
          },
          process: function process(input) {
            var options = this.options;
            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTime = input.deltaTime > options.time;
            this._input = input; // we only allow little movement
            // and we've reached an end event, so a tap is possible

            if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) {
              this.reset();
            } else if (input.eventType & INPUT_START) {
              this.reset();
              this._timer = setTimeoutContext(function () {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
              }, options.time, this);
            } else if (input.eventType & INPUT_END) {
              return STATE_RECOGNIZED;
            }

            return STATE_FAILED;
          },
          reset: function reset() {
            clearTimeout(this._timer);
          },
          emit: function emit(input) {
            if (this.state !== STATE_RECOGNIZED) {
              return;
            }

            if (input && input.eventType & INPUT_END) {
              this.manager.emit(this.options.event + 'up', input);
            } else {
              this._input.timeStamp = now();
              this.manager.emit(this.options.event, this._input);
            }
          }
        });
        /**
         * Rotate
         * Recognized when two or more pointer are moving in a circular motion.
         * @constructor
         * @extends AttrRecognizer
         */

        function RotateRecognizer() {
          AttrRecognizer.apply(this, arguments);
        }

        inherit(RotateRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof RotateRecognizer
           */
          defaults: {
            event: 'rotate',
            threshold: 0,
            pointers: 2
          },
          getTouchAction: function getTouchAction() {
            return [TOUCH_ACTION_NONE];
          },
          attrTest: function attrTest(input) {
            return this._super.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
          }
        });
        /**
         * Swipe
         * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
         * @constructor
         * @extends AttrRecognizer
         */

        function SwipeRecognizer() {
          AttrRecognizer.apply(this, arguments);
        }

        inherit(SwipeRecognizer, AttrRecognizer, {
          /**
           * @namespace
           * @memberof SwipeRecognizer
           */
          defaults: {
            event: 'swipe',
            threshold: 10,
            velocity: 0.3,
            direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
            pointers: 1
          },
          getTouchAction: function getTouchAction() {
            return PanRecognizer.prototype.getTouchAction.call(this);
          },
          attrTest: function attrTest(input) {
            var direction = this.options.direction;
            var velocity;

            if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
              velocity = input.overallVelocity;
            } else if (direction & DIRECTION_HORIZONTAL) {
              velocity = input.overallVelocityX;
            } else if (direction & DIRECTION_VERTICAL) {
              velocity = input.overallVelocityY;
            }

            return this._super.attrTest.call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers == this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
          },
          emit: function emit(input) {
            var direction = directionStr(input.offsetDirection);

            if (direction) {
              this.manager.emit(this.options.event + direction, input);
            }

            this.manager.emit(this.options.event, input);
          }
        });
        /**
         * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
         * between the given interval and position. The delay option can be used to recognize multi-taps without firing
         * a single tap.
         *
         * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
         * multi-taps being recognized.
         * @constructor
         * @extends Recognizer
         */

        function TapRecognizer() {
          Recognizer.apply(this, arguments); // previous time and center,
          // used for tap counting

          this.pTime = false;
          this.pCenter = false;
          this._timer = null;
          this._input = null;
          this.count = 0;
        }

        inherit(TapRecognizer, Recognizer, {
          /**
           * @namespace
           * @memberof PinchRecognizer
           */
          defaults: {
            event: 'tap',
            pointers: 1,
            taps: 1,
            interval: 300,
            // max time between the multi-tap taps
            time: 250,
            // max time of the pointer to be down (like finger on the screen)
            threshold: 9,
            // a minimal movement is ok, but keep it low
            posThreshold: 10 // a multi-tap can be a bit off the initial position

          },
          getTouchAction: function getTouchAction() {
            return [TOUCH_ACTION_MANIPULATION];
          },
          process: function process(input) {
            var options = this.options;
            var validPointers = input.pointers.length === options.pointers;
            var validMovement = input.distance < options.threshold;
            var validTouchTime = input.deltaTime < options.time;
            this.reset();

            if (input.eventType & INPUT_START && this.count === 0) {
              return this.failTimeout();
            } // we only allow little movement
            // and we've reached an end event, so a tap is possible


            if (validMovement && validTouchTime && validPointers) {
              if (input.eventType != INPUT_END) {
                return this.failTimeout();
              }

              var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
              var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
              this.pTime = input.timeStamp;
              this.pCenter = input.center;

              if (!validMultiTap || !validInterval) {
                this.count = 1;
              } else {
                this.count += 1;
              }

              this._input = input; // if tap count matches we have recognized it,
              // else it has began recognizing...

              var tapCount = this.count % options.taps;

              if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                  return STATE_RECOGNIZED;
                } else {
                  this._timer = setTimeoutContext(function () {
                    this.state = STATE_RECOGNIZED;
                    this.tryEmit();
                  }, options.interval, this);
                  return STATE_BEGAN;
                }
              }
            }

            return STATE_FAILED;
          },
          failTimeout: function failTimeout() {
            this._timer = setTimeoutContext(function () {
              this.state = STATE_FAILED;
            }, this.options.interval, this);
            return STATE_FAILED;
          },
          reset: function reset() {
            clearTimeout(this._timer);
          },
          emit: function emit() {
            if (this.state == STATE_RECOGNIZED) {
              this._input.tapCount = this.count;
              this.manager.emit(this.options.event, this._input);
            }
          }
        });
        /**
         * Simple way to create a manager with a default set of recognizers.
         * @param {HTMLElement} element
         * @param {Object} [options]
         * @constructor
         */

        function Hammer(element, options) {
          options = options || {};
          options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
          return new Manager(element, options);
        }
        /**
         * @const {string}
         */


        Hammer.VERSION = '2.0.7';
        /**
         * default settings
         * @namespace
         */

        Hammer.defaults = {
          /**
           * set if DOM events are being triggered.
           * But this is slower and unused by simple implementations, so disabled by default.
           * @type {Boolean}
           * @default false
           */
          domEvents: false,

          /**
           * The value for the touchAction property/fallback.
           * When set to `compute` it will magically set the correct value based on the added recognizers.
           * @type {String}
           * @default compute
           */
          touchAction: TOUCH_ACTION_COMPUTE,

          /**
           * @type {Boolean}
           * @default true
           */
          enable: true,

          /**
           * EXPERIMENTAL FEATURE -- can be removed/changed
           * Change the parent input target element.
           * If Null, then it is being set the to main element.
           * @type {Null|EventTarget}
           * @default null
           */
          inputTarget: null,

          /**
           * force an input class
           * @type {Null|Function}
           * @default null
           */
          inputClass: null,

          /**
           * Default recognizer setup when calling `Hammer()`
           * When creating a new Manager these will be skipped.
           * @type {Array}
           */
          preset: [// RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
          [RotateRecognizer, {
            enable: false
          }], [PinchRecognizer, {
            enable: false
          }, ['rotate']], [SwipeRecognizer, {
            direction: DIRECTION_HORIZONTAL
          }], [PanRecognizer, {
            direction: DIRECTION_HORIZONTAL
          }, ['swipe']], [TapRecognizer], [TapRecognizer, {
            event: 'doubletap',
            taps: 2
          }, ['tap']], [PressRecognizer]],

          /**
           * Some CSS properties can be used to improve the working of Hammer.
           * Add them to this method and they will be set when creating a new Manager.
           * @namespace
           */
          cssProps: {
            /**
             * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userSelect: 'none',

            /**
             * Disable the Windows Phone grippers when pressing an element.
             * @type {String}
             * @default 'none'
             */
            touchSelect: 'none',

            /**
             * Disables the default callout shown when you touch and hold a touch target.
             * On iOS, when you touch and hold a touch target such as a link, Safari displays
             * a callout containing information about the link. This property allows you to disable that callout.
             * @type {String}
             * @default 'none'
             */
            touchCallout: 'none',

            /**
             * Specifies whether zooming is enabled. Used by IE10>
             * @type {String}
             * @default 'none'
             */
            contentZooming: 'none',

            /**
             * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
             * @type {String}
             * @default 'none'
             */
            userDrag: 'none',

            /**
             * Overrides the highlight color shown when the user taps a link or a JavaScript
             * clickable element in iOS. This property obeys the alpha value, if specified.
             * @type {String}
             * @default 'rgba(0,0,0,0)'
             */
            tapHighlightColor: 'rgba(0,0,0,0)'
          }
        };
        var STOP = 1;
        var FORCED_STOP = 2;
        /**
         * Manager
         * @param {HTMLElement} element
         * @param {Object} [options]
         * @constructor
         */

        function Manager(element, options) {
          this.options = assign({}, Hammer.defaults, options || {});
          this.options.inputTarget = this.options.inputTarget || element;
          this.handlers = {};
          this.session = {};
          this.recognizers = [];
          this.oldCssProps = {};
          this.element = element;
          this.input = createInputInstance(this);
          this.touchAction = new TouchAction(this, this.options.touchAction);
          toggleCssProps(this, true);
          each(this.options.recognizers, function (item) {
            var recognizer = this.add(new item[0](item[1]));
            item[2] && recognizer.recognizeWith(item[2]);
            item[3] && recognizer.requireFailure(item[3]);
          }, this);
        }

        Manager.prototype = {
          /**
           * set options
           * @param {Object} options
           * @returns {Manager}
           */
          set: function set(options) {
            assign(this.options, options); // Options that need a little more setup

            if (options.touchAction) {
              this.touchAction.update();
            }

            if (options.inputTarget) {
              // Clean up existing event listeners and reinitialize
              this.input.destroy();
              this.input.target = options.inputTarget;
              this.input.init();
            }

            return this;
          },

          /**
           * stop recognizing for this session.
           * This session will be discarded, when a new [input]start event is fired.
           * When forced, the recognizer cycle is stopped immediately.
           * @param {Boolean} [force]
           */
          stop: function stop(force) {
            this.session.stopped = force ? FORCED_STOP : STOP;
          },

          /**
           * run the recognizers!
           * called by the inputHandler function on every movement of the pointers (touches)
           * it walks through all the recognizers and tries to detect the gesture that is being made
           * @param {Object} inputData
           */
          recognize: function recognize(inputData) {
            var session = this.session;

            if (session.stopped) {
              return;
            } // run the touch-action polyfill


            this.touchAction.preventDefaults(inputData);
            var recognizer;
            var recognizers = this.recognizers; // this holds the recognizer that is being recognized.
            // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
            // if no recognizer is detecting a thing, it is set to `null`

            var curRecognizer = session.curRecognizer; // reset when the last recognizer is recognized
            // or when we're in a new session

            if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
              curRecognizer = session.curRecognizer = null;
            }

            var i = 0;

            while (i < recognizers.length) {
              recognizer = recognizers[i]; // find out if we are allowed try to recognize the input for this one.
              // 1.   allow if the session is NOT forced stopped (see the .stop() method)
              // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
              //      that is being recognized.
              // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
              //      this can be setup with the `recognizeWith()` method on the recognizer.

              if (session.stopped !== FORCED_STOP && ( // 1
              !curRecognizer || recognizer == curRecognizer || // 2
              recognizer.canRecognizeWith(curRecognizer))) {
                // 3
                recognizer.recognize(inputData);
              } else {
                recognizer.reset();
              } // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
              // current active recognizer. but only if we don't already have an active recognizer


              if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
              }

              i++;
            }
          },

          /**
           * get a recognizer by its event name.
           * @param {Recognizer|String} recognizer
           * @returns {Recognizer|Null}
           */
          get: function get(recognizer) {
            if (recognizer instanceof Recognizer) {
              return recognizer;
            }

            var recognizers = this.recognizers;

            for (var i = 0; i < recognizers.length; i++) {
              if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
              }
            }

            return null;
          },

          /**
           * add a recognizer to the manager
           * existing recognizers with the same event name will be removed
           * @param {Recognizer} recognizer
           * @returns {Recognizer|Manager}
           */
          add: function add(recognizer) {
            if (invokeArrayArg(recognizer, 'add', this)) {
              return this;
            } // remove existing


            var existing = this.get(recognizer.options.event);

            if (existing) {
              this.remove(existing);
            }

            this.recognizers.push(recognizer);
            recognizer.manager = this;
            this.touchAction.update();
            return recognizer;
          },

          /**
           * remove a recognizer by name or instance
           * @param {Recognizer|String} recognizer
           * @returns {Manager}
           */
          remove: function remove(recognizer) {
            if (invokeArrayArg(recognizer, 'remove', this)) {
              return this;
            }

            recognizer = this.get(recognizer); // let's make sure this recognizer exists

            if (recognizer) {
              var recognizers = this.recognizers;
              var index = inArray(recognizers, recognizer);

              if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
              }
            }

            return this;
          },

          /**
           * bind event
           * @param {String} events
           * @param {Function} handler
           * @returns {EventEmitter} this
           */
          on: function on(events, handler) {
            if (events === undefined) {
              return;
            }

            if (handler === undefined) {
              return;
            }

            var handlers = this.handlers;
            each(splitStr(events), function (event) {
              handlers[event] = handlers[event] || [];
              handlers[event].push(handler);
            });
            return this;
          },

          /**
           * unbind event, leave emit blank to remove all handlers
           * @param {String} events
           * @param {Function} [handler]
           * @returns {EventEmitter} this
           */
          off: function off(events, handler) {
            if (events === undefined) {
              return;
            }

            var handlers = this.handlers;
            each(splitStr(events), function (event) {
              if (!handler) {
                delete handlers[event];
              } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
              }
            });
            return this;
          },

          /**
           * emit event to the listeners
           * @param {String} event
           * @param {Object} data
           */
          emit: function emit(event, data) {
            // we also want to trigger dom events
            if (this.options.domEvents) {
              triggerDomEvent(event, data);
            } // no handlers, so skip it all


            var handlers = this.handlers[event] && this.handlers[event].slice();

            if (!handlers || !handlers.length) {
              return;
            }

            data.type = event;

            data.preventDefault = function () {
              data.srcEvent.preventDefault();
            };

            var i = 0;

            while (i < handlers.length) {
              handlers[i](data);
              i++;
            }
          },

          /**
           * destroy the manager and unbinds all events
           * it doesn't unbind dom events, that is the user own responsibility
           */
          destroy: function destroy() {
            this.element && toggleCssProps(this, false);
            this.handlers = {};
            this.session = {};
            this.input.destroy();
            this.element = null;
          }
        };
        /**
         * add/remove the css properties as defined in manager.options.cssProps
         * @param {Manager} manager
         * @param {Boolean} add
         */

        function toggleCssProps(manager, add) {
          var element = manager.element;

          if (!element.style) {
            return;
          }

          var prop;
          each(manager.options.cssProps, function (value, name) {
            prop = prefixed(element.style, name);

            if (add) {
              manager.oldCssProps[prop] = element.style[prop];
              element.style[prop] = value;
            } else {
              element.style[prop] = manager.oldCssProps[prop] || '';
            }
          });

          if (!add) {
            manager.oldCssProps = {};
          }
        }
        /**
         * trigger dom event
         * @param {String} event
         * @param {Object} data
         */


        function triggerDomEvent(event, data) {
          var gestureEvent = document.createEvent('Event');
          gestureEvent.initEvent(event, true, true);
          gestureEvent.gesture = data;
          data.target.dispatchEvent(gestureEvent);
        }

        assign(Hammer, {
          INPUT_START: INPUT_START,
          INPUT_MOVE: INPUT_MOVE,
          INPUT_END: INPUT_END,
          INPUT_CANCEL: INPUT_CANCEL,
          STATE_POSSIBLE: STATE_POSSIBLE,
          STATE_BEGAN: STATE_BEGAN,
          STATE_CHANGED: STATE_CHANGED,
          STATE_ENDED: STATE_ENDED,
          STATE_RECOGNIZED: STATE_RECOGNIZED,
          STATE_CANCELLED: STATE_CANCELLED,
          STATE_FAILED: STATE_FAILED,
          DIRECTION_NONE: DIRECTION_NONE,
          DIRECTION_LEFT: DIRECTION_LEFT,
          DIRECTION_RIGHT: DIRECTION_RIGHT,
          DIRECTION_UP: DIRECTION_UP,
          DIRECTION_DOWN: DIRECTION_DOWN,
          DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
          DIRECTION_VERTICAL: DIRECTION_VERTICAL,
          DIRECTION_ALL: DIRECTION_ALL,
          Manager: Manager,
          Input: Input,
          TouchAction: TouchAction,
          TouchInput: TouchInput,
          MouseInput: MouseInput,
          PointerEventInput: PointerEventInput,
          TouchMouseInput: TouchMouseInput,
          SingleTouchInput: SingleTouchInput,
          Recognizer: Recognizer,
          AttrRecognizer: AttrRecognizer,
          Tap: TapRecognizer,
          Pan: PanRecognizer,
          Swipe: SwipeRecognizer,
          Pinch: PinchRecognizer,
          Rotate: RotateRecognizer,
          Press: PressRecognizer,
          on: addEventListeners,
          off: removeEventListeners,
          each: each,
          merge: merge,
          extend: extend,
          assign: assign,
          inherit: inherit,
          bindFn: bindFn,
          prefixed: prefixed
        }); // this prevents errors when Hammer is loaded in the presence of an AMD
        //  style loader but by script tag, not by the loader.

        var freeGlobal = typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : {}; // jshint ignore:line

        freeGlobal.Hammer = Hammer;

        if (true) {
          !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return Hammer;
          }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        } else {}
      })(window, document, 'Hammer');
      /***/

    },

    /***/
    "zB/H":
    /*!****************************************************!*\
      !*** ./node_modules/rxjs/internal/Subscription.js ***!
      \****************************************************/

    /*! no static exports found */

    /***/
    function zBH(module, exports, __webpack_require__) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var isArray_1 = __webpack_require__(
      /*! ./util/isArray */
      "mbIT");

      var isObject_1 = __webpack_require__(
      /*! ./util/isObject */
      "GMZp");

      var isFunction_1 = __webpack_require__(
      /*! ./util/isFunction */
      "pshJ");

      var UnsubscriptionError_1 = __webpack_require__(
      /*! ./util/UnsubscriptionError */
      "LBXl");

      var Subscription = function () {
        function Subscription(unsubscribe) {
          this.closed = false;
          this._parentOrParents = null;
          this._subscriptions = null;

          if (unsubscribe) {
            this._ctorUnsubscribe = true;
            this._unsubscribe = unsubscribe;
          }
        }

        Subscription.prototype.unsubscribe = function () {
          var errors;

          if (this.closed) {
            return;
          }

          var _a = this,
              _parentOrParents = _a._parentOrParents,
              _ctorUnsubscribe = _a._ctorUnsubscribe,
              _unsubscribe = _a._unsubscribe,
              _subscriptions = _a._subscriptions;

          this.closed = true;
          this._parentOrParents = null;
          this._subscriptions = null;

          if (_parentOrParents instanceof Subscription) {
            _parentOrParents.remove(this);
          } else if (_parentOrParents !== null) {
            for (var index = 0; index < _parentOrParents.length; ++index) {
              var parent_1 = _parentOrParents[index];
              parent_1.remove(this);
            }
          }

          if (isFunction_1.isFunction(_unsubscribe)) {
            if (_ctorUnsubscribe) {
              this._unsubscribe = undefined;
            }

            try {
              _unsubscribe.call(this);
            } catch (e) {
              errors = e instanceof UnsubscriptionError_1.UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
            }
          }

          if (isArray_1.isArray(_subscriptions)) {
            var index = -1;
            var len = _subscriptions.length;

            while (++index < len) {
              var sub = _subscriptions[index];

              if (isObject_1.isObject(sub)) {
                try {
                  sub.unsubscribe();
                } catch (e) {
                  errors = errors || [];

                  if (e instanceof UnsubscriptionError_1.UnsubscriptionError) {
                    errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                  } else {
                    errors.push(e);
                  }
                }
              }
            }
          }

          if (errors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
          }
        };

        Subscription.prototype.add = function (teardown) {
          var subscription = teardown;

          if (!teardown) {
            return Subscription.EMPTY;
          }

          switch (typeof teardown) {
            case 'function':
              subscription = new Subscription(teardown);

            case 'object':
              if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                return subscription;
              } else if (this.closed) {
                subscription.unsubscribe();
                return subscription;
              } else if (!(subscription instanceof Subscription)) {
                var tmp = subscription;
                subscription = new Subscription();
                subscription._subscriptions = [tmp];
              }

              break;

            default:
              {
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
              }
          }

          var _parentOrParents = subscription._parentOrParents;

          if (_parentOrParents === null) {
            subscription._parentOrParents = this;
          } else if (_parentOrParents instanceof Subscription) {
            if (_parentOrParents === this) {
              return subscription;
            }

            subscription._parentOrParents = [_parentOrParents, this];
          } else if (_parentOrParents.indexOf(this) === -1) {
            _parentOrParents.push(this);
          } else {
            return subscription;
          }

          var subscriptions = this._subscriptions;

          if (subscriptions === null) {
            this._subscriptions = [subscription];
          } else {
            subscriptions.push(subscription);
          }

          return subscription;
        };

        Subscription.prototype.remove = function (subscription) {
          var subscriptions = this._subscriptions;

          if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);

            if (subscriptionIndex !== -1) {
              subscriptions.splice(subscriptionIndex, 1);
            }
          }
        };

        Subscription.EMPTY = function (empty) {
          empty.closed = true;
          return empty;
        }(new Subscription());

        return Subscription;
      }();

      exports.Subscription = Subscription;

      function flattenUnsubscriptionErrors(errors) {
        return errors.reduce(function (errs, err) {
          return errs.concat(err instanceof UnsubscriptionError_1.UnsubscriptionError ? err.errors : err);
        }, []);
      } //# sourceMappingURL=Subscription.js.map

      /***/

    }
  }]);
})();
//# sourceMappingURL=auth-auth-module-es5.js.map