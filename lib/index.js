"use strict";
var __extends = (this && this.__extends) || (function (){
  var extendStatics=function(d, b){
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b){ d.__proto__ = b; }) ||
      function (d, b){ for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b){
    extendStatics(d, b);
    function __(){ this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator){
  function adopt(value){ return value instanceof P ? value : new P(function (resolve){ resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject){
    function fulfilled(value){ try { step(generator.next(value)); } catch (e){ reject(e); } }
    function rejected(value){ try { step(generator["throw"](value)); } catch (e){ reject(e); } }
    function step(result){ result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body){
  var _ = { label: 0, sent: function(){ if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function(){ return this; }), g;
  function verb(n){ return function (v){ return step([n, v]); }; }
  function step(op){
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]){
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)){ _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))){ _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]){ _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]){ _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e){ op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports,"__esModule",{value:true});
var PasswordWebClient=(function(){
  function PasswordWebClient(http, serviceUrl){
    this.http = http;
    this.serviceUrl = serviceUrl;
  }
  PasswordWebClient.prototype.forgotPassword=function(contact){
    var url = this.serviceUrl + '/forgot/' + contact;
    return this.http.get(url);
  };
  PasswordWebClient.prototype.resetPassword=function(password){
    var url = this.serviceUrl + '/reset';
    return this.http.post(url, password);
  };
  PasswordWebClient.prototype.changePassword=function(pass){
    var url = this.serviceUrl + '/change';
    return this.http.put(url, pass);
  };
  return PasswordWebClient;
}());
exports.PasswordWebClient = PasswordWebClient;
function isEmpty(str){
  return (!str || str === '');
}
exports.isEmpty = isEmpty;
var BaseComponent=(function(){
  function BaseComponent(passwordService, resourceService){
    this.passwordService = passwordService;
    this.resourceService = resourceService;
    this.message = '';
    this.alertClass = '';
    this.resource = resourceService.resource();
    this.showInfo = this.showInfo.bind(this);
    this.showError = this.showError.bind(this);
    this.hideMessage = this.hideMessage.bind(this);
    this.handleError = this.handleError.bind(this);
  }
  BaseComponent.prototype.showInfo=function(msg, field){
    this.alertClass = 'alert alert-info';
    this.message = msg;
  };
  BaseComponent.prototype.showError=function(msg, field){
    this.alertClass = 'alert alert-danger';
    this.message = msg;
  };
  BaseComponent.prototype.hideMessage=function(field){
    this.alertClass = '';
    this.message = '';
  };
  BaseComponent.prototype.handleError=function(err){
    var r = this.resourceService;
    var msg = r.value('error_internal');
    this.showError(msg);
  };
  return BaseComponent;
}());
exports.BaseComponent = BaseComponent;
var BaseForgotPasswordComponent=(function(_super){
  __extends(BaseForgotPasswordComponent, _super);
  function BaseForgotPasswordComponent(passwordService, resource, loading){
    var _this = _super.call(this, passwordService, resource) || this;
    _this.loading = loading;
    _this.contact = '';
    _this.validate = _this.validate.bind(_this);
    _this.forgotPassword = _this.forgotPassword.bind(_this);
    return _this;
  }
  BaseForgotPasswordComponent.prototype.validate=function(contact){
    var r = this.resourceService;
    if (isEmpty(contact)){
      var msg = r.format(r.value('error_required'), r.value('email'));
      this.showError(msg);
      return false;
    }
    return true;
  };
  BaseForgotPasswordComponent.prototype.forgotPassword=function(){
    return __awaiter(this, void 0, void 0, function (){
      var result, r, msg, msg, err_1;
      return __generator(this, function (_a){
        switch (_a.label){
          case 0:
            this.contact = this.contact.trim();
            if (!this.validate(this.contact)){
              return [2];
            }
            else {
              this.hideMessage();
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            if (this.loading){
              this.loading.showLoading();
            }
            return [4, this.passwordService.forgotPassword(this.contact)];
          case 2:
            result = _a.sent();
            r = this.resourceService;
            if (result){
              msg = r.value('success_forgot_password');
              this.showInfo(msg);
            }
            else {
              msg = r.value('fail_forgot_password');
              this.showError(msg);
            }
            return [3, 5];
          case 3:
            err_1 = _a.sent();
            this.handleError(err_1);
            return [3, 5];
          case 4:
            if (this.loading){
              this.loading.hideLoading();
            }
            return [7];
          case 5: return [2];
        }
      });
    });
  };
  return BaseForgotPasswordComponent;
}(BaseComponent));
exports.BaseForgotPasswordComponent = BaseForgotPasswordComponent;
var BaseChangePasswordComponent=(function(_super){
  __extends(BaseChangePasswordComponent, _super);
  function BaseChangePasswordComponent(passwordService, resource, loading){
    var _this = _super.call(this, passwordService, resource) || this;
    _this.loading = loading;
    _this.user = {
      step: null,
      username: '',
      currentPassword: '',
      password: ''
    };
    _this.confirmPassword = '';
    _this.validate = _this.validate.bind(_this);
    _this.changePassword = _this.changePassword.bind(_this);
    return _this;
  }
  BaseChangePasswordComponent.prototype.validate=function(user){
    var r = this.resourceService;
    if (isEmpty(user.username)){
      var msg = r.format(r.value('error_required'), r.value('username'));
      this.showError(msg);
      return false;
    }
    if (isEmpty(user.password)){
      var msg = r.format(r.value('error_required'), r.value('new_password'));
      this.showError(msg);
      return false;
    }
    if (isEmpty(user.currentPassword)){
      var msg = r.format(r.value('error_required'), r.value('current_password'));
      this.showError(msg);
      return false;
    }
    if (user.password !== this.confirmPassword){
      var msg = r.value('error_confirm_password');
      this.showError(msg);
      return false;
    }
    return true;
  };
  BaseChangePasswordComponent.prototype.changePassword=function(){
    return __awaiter(this, void 0, void 0, function (){
      var result, r, msg, msg, msg, err_2;
      return __generator(this, function (_a){
        switch (_a.label){
          case 0:
            this.user.username = this.user.username.trim();
            if (!this.validate(this.user)){
              return [2];
            }
            else {
              this.hideMessage();
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, 4, 5]);
            if (this.loading){
              this.loading.showLoading();
            }
            return [4, this.passwordService.changePassword(this.user)];
          case 2:
            result = _a.sent();
            r = this.resourceService;
            if (result === 2){
              msg = r.value('success_send_passcode_change_password');
              this.showInfo(msg);
              this.user.step = 1;
            }
            else if (result === true || result === 1){
              msg = r.value('success_change_password');
              this.showInfo(msg);
            }
            else {
              msg = r.value('fail_change_password');
              this.showError(msg);
            }
            return [3, 5];
          case 3:
            err_2 = _a.sent();
            this.handleError(err_2);
            return [3, 5];
          case 4:
            if (this.loading){
              this.loading.hideLoading();
            }
            return [7];
          case 5: return [2];
        }
      });
    });
  };
  return BaseChangePasswordComponent;
}(BaseComponent));
exports.BaseChangePasswordComponent = BaseChangePasswordComponent;
function resetPassword(passwordService, user, confirmPassword, r, m, loading, validate, handleError){
  return __awaiter(this, void 0, void 0, function (){
    var success, msg, msg, err_3;
    return __generator(this, function (_a){
      switch (_a.label){
        case 0:
          if (!validateReset(user, confirmPassword, r, m)){
            return [2];
          }
          else {
            m.hideMessage();
          }
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, 4, 5]);
          if (loading){
            loading.showLoading();
          }
          return [4, passwordService.resetPassword(user)];
        case 2:
          success = _a.sent();
          if (success === true || success === 1){
            msg = r.value('success_reset_password');
            m.showInfo(msg);
          }
          else {
            msg = r.value('fail_reset_password');
            m.showError(msg);
          }
          return [3, 5];
        case 3:
          err_3 = _a.sent();
          handleError(err_3);
          return [3, 5];
        case 4:
          if (loading){
            loading.hideLoading();
          }
          return [7];
        case 5: return [2];
      }
    });
  });
}
exports.resetPassword = resetPassword;
function validateReset(user, confirmPassword, r, m){
  var valid = true;
  if (isEmpty(user.username)){
    valid = false;
    var msg = r.format(r.value('error_required'), r.value('username'));
    m.showError(msg, 'username');
  }
  else if (isEmpty(user.passcode)){
    valid = false;
    var msg = r.format(r.value('error_required'), r.value('passcode'));
    m.showError(msg, 'passcode');
  }
  else if (isEmpty(user.password)){
    valid = false;
    var msg = r.format(r.value('error_required'), r.value('new_password'));
    m.showError(msg, 'password');
  }
  else if (user.password !== confirmPassword){
    valid = false;
    var msg = r.value('error_confirm_password');
    m.showError(msg, 'confirmPassword');
  }
  return valid;
}
exports.validateReset = validateReset;
var BaseResetPasswordComponent=(function(_super){
  __extends(BaseResetPasswordComponent, _super);
  function BaseResetPasswordComponent(passwordService, resource, loading){
    var _this = _super.call(this, passwordService, resource) || this;
    _this.loading = loading;
    _this.user = {
      username: '',
      passcode: '',
      password: ''
    };
    _this.confirmPassword = '';
    _this.resetPassword = _this.resetPassword.bind(_this);
    return _this;
  }
  BaseResetPasswordComponent.prototype.resetPassword=function(){
    this.user.username = this.user.username.trim();
    resetPassword(this.passwordService, this.user, this.confirmPassword, this.resourceService, this, this.loading, validateReset, this.handleError);
  };
  return BaseResetPasswordComponent;
}(BaseComponent));
exports.BaseResetPasswordComponent = BaseResetPasswordComponent;
