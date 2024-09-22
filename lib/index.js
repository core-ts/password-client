"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/i;
exports.simplePassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
exports.mediumPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
exports.strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
var Client = (function () {
  function Client(http, url, getForgot) {
    this.http = http;
    this.url = url;
    this.getForgot = getForgot;
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }
  Client.prototype.forgotPassword = function (contact) {
    if (this.getForgot) {
      var url = this.url + '/forgot/' + contact;
      return this.http.get(url);
    }
    else {
      var url = this.url + '/forgot';
      return this.http.post(url, { contact: contact });
    }
  };
  Client.prototype.resetPassword = function (pass) {
    var url = this.url + '/reset';
    return this.http.post(url, pass);
  };
  Client.prototype.changePassword = function (pass) {
    var url = this.url + '/change';
    return this.http.put(url, pass);
  };
  return Client;
}());
exports.Client = Client;
exports.PasswordClient = Client;
function isEmpty(str) {
  return (!str || str === '');
}
exports.isEmpty = isEmpty;
function createError(code, field, message) {
  return { code: code, field: field, message: message };
}
exports.createError = createError;
function validateContact(contact, key, r, reg, showError) {
  if (showError) {
    if (isEmpty(contact)) {
      var msg = r.format(r.value('error_required'), r.value(key));
      showError(msg, 'contact');
      return false;
    }
    if (reg && !reg.test(contact)) {
      var msg = r.value('error_contact_exp');
      showError(msg, 'contact');
      return false;
    }
    return true;
  }
  else {
    var errs = [];
    if (isEmpty(contact)) {
      var msg = r.format(r.value('error_required'), r.value(key));
      var e = createError('required', 'contact', msg);
      errs.push(e);
    }
    if (reg && !reg.test(contact)) {
      var msg = r.value('error_contact_exp');
      var e = createError('exp', 'contact', msg);
      errs.push(e);
    }
    return errs;
  }
}
exports.validateContact = validateContact;
function forgotPassword(forgot, contact, r, showMessage, showError, handleError, loading) {
  if (loading) {
    loading.showLoading();
  }
  forgot(contact).then(function (res) {
    if (res) {
      var msg = r.success_forgot_password;
      showMessage(msg, 'contact');
    }
    else {
      var msg = r.fail_forgot_password;
      showError(msg, 'contact');
    }
    if (loading) {
      loading.hideLoading();
    }
  }).catch(function (err) {
    handleError(err);
    if (loading) {
      loading.hideLoading();
    }
  });
}
exports.forgotPassword = forgotPassword;
function validateAndForgotPassword(forgot, contact, key, r, showMessage, showError, hideMessage, validateC, handleError, reg, loading, showCustomError) {
  var s = (showCustomError ? undefined : showError);
  var results = validateC(contact, key, r, reg, s);
  if (results === false) {
    return;
  }
  else if (Array.isArray(results) && results.length > 0) {
    if (showCustomError) {
      showCustomError(results);
    }
    return;
  }
  else {
    hideMessage();
  }
  forgotPassword(forgot, contact, r.resource(), showMessage, showError, handleError, loading);
}
exports.validateAndForgotPassword = validateAndForgotPassword;
function validateReset(user, confirmPassword, r, reg, showError) {
  if (showError) {
    if (isEmpty(user.username)) {
      var msg = r.format(r.value('error_required'), r.value('username'));
      showError(msg, 'username');
      return false;
    }
    else if (isEmpty(user.passcode)) {
      var msg = r.format(r.value('error_required'), r.value('passcode'));
      showError(msg, 'passcode');
      return false;
    }
    else if (isEmpty(user.password)) {
      var msg = r.format(r.value('error_required'), r.value('new_password'));
      showError(msg, 'password');
      return false;
    }
    if (reg && !reg.test(user.password)) {
      var msg = r.format(r.value('error_password_exp'), r.value('new_password'));
      showError(msg, 'password');
      return false;
    }
    if (user.password !== confirmPassword) {
      var msg = r.value('error_confirm_password');
      showError(msg, 'confirmPassword');
      return false;
    }
    return true;
  }
  else {
    var errs = [];
    if (isEmpty(user.username)) {
      var msg = r.format(r.value('error_required'), r.value('username'));
      var e = createError('required', 'username', msg);
      errs.push(e);
    }
    if (isEmpty(user.passcode)) {
      var msg = r.format(r.value('error_required'), r.value('passcode'));
      var e = createError('required', 'passcode', msg);
      errs.push(e);
    }
    if (isEmpty(user.password)) {
      var msg = r.format(r.value('error_required'), r.value('new_password'));
      var e = createError('required', 'password', msg);
      errs.push(e);
    }
    if (reg && !reg.test(user.password)) {
      var msg = r.format(r.value('error_password_exp'), r.value('new_password'));
      var e = createError('exp', 'password', msg);
      errs.push(e);
    }
    if (user.password !== confirmPassword) {
      var msg = r.value('error_confirm_password');
      var e = createError('eq', 'confirmPassword', msg);
      e.param = 'password';
      errs.push(e);
    }
    return errs;
  }
}
exports.validateReset = validateReset;
function resetPassword(reset, user, r, showMessage, showError, handleError, loading) {
  if (loading) {
    loading.showLoading();
  }
  reset(user).then(function (success) {
    if (success === true || success === 1) {
      var msg = r.success_reset_password;
      showMessage(msg);
    }
    else {
      var msg = r.fail_reset_password;
      showError(msg);
    }
    if (loading) {
      loading.hideLoading();
    }
  }).catch(function (err) {
    handleError(err);
    if (loading) {
      loading.hideLoading();
    }
  });
}
exports.resetPassword = resetPassword;
function validateAndResetPassword(reset, user, confirmPassword, r, showMessage, showError, hideMessage, validate, handleError, reg, loading, showCustomError) {
  var s = (showCustomError ? undefined : showError);
  var results = validate(user, confirmPassword, r, reg, s);
  if (results === false) {
    return;
  }
  else if (Array.isArray(results) && results.length > 0) {
    if (showCustomError) {
      showCustomError(results);
    }
    return;
  }
  else {
    hideMessage();
  }
  resetPassword(reset, user, r.resource(), showMessage, showError, handleError, loading);
}
exports.validateAndResetPassword = validateAndResetPassword;
function validateChange(user, confirmPassword, r, reg, showError) {
  if (showError) {
    if (isEmpty(user.username)) {
      var msg = r.format(r.value('error_required'), r.value('username'));
      showError(msg, 'username');
      return false;
    }
    if (isEmpty(user.password)) {
      var msg = r.format(r.value('error_required'), r.value('new_password'));
      showError(msg, 'password');
      return false;
    }
    if (reg && !reg.test(user.password)) {
      var msg = r.format(r.value('error_password_exp'), r.value('new_password'));
      showError(msg, 'password');
      return false;
    }
    if (isEmpty(user.currentPassword)) {
      var msg = r.format(r.value('error_required'), r.value('current_password'));
      showError(msg, 'currentPassword');
      return false;
    }
    if (user.step && user.step >= 1 && isEmpty(user.passcode)) {
      var msg = r.format(r.value('error_required'), r.value('passcode'));
      showError(msg, 'passcode');
      return false;
    }
    if (user.password !== confirmPassword) {
      var msg = r.value('error_confirm_password');
      showError(msg, 'confirmPassword');
      return false;
    }
    return true;
  }
  else {
    var errs = [];
    if (isEmpty(user.username)) {
      var msg = r.format(r.value('error_required'), r.value('username'));
      var e = createError('required', 'username', msg);
      errs.push(e);
    }
    if (isEmpty(user.password)) {
      var msg = r.format(r.value('error_required'), r.value('new_password'));
      var e = createError('required', 'password', msg);
      errs.push(e);
    }
    if (reg && !reg.test(user.password)) {
      var msg = r.format(r.value('error_password_exp'), r.value('new_password'));
      var e = createError('exp', 'password', msg);
      errs.push(e);
    }
    if (isEmpty(user.currentPassword)) {
      var msg = r.format(r.value('error_required'), r.value('current_password'));
      var e = createError('required', 'currentPassword', msg);
      errs.push(e);
    }
    if (user.step && user.step >= 1 && isEmpty(user.passcode)) {
      var msg = r.format(r.value('error_required'), r.value('passcode'));
      var e = createError('required', 'passcode', msg);
      errs.push(e);
    }
    if (user.password !== confirmPassword) {
      var msg = r.value('error_confirm_password');
      var e = createError('eq', 'confirmPassword', msg);
      e.param = 'password';
      errs.push(e);
    }
    return errs;
  }
}
exports.validateChange = validateChange;
function changePassword(change, user, r, showMessage, showError, handleError, loading) {
  if (loading) {
    loading.showLoading();
  }
  change(user).then(function (res) {
    if (res === 2) {
      var msg = r.success_send_passcode_change_password;
      showMessage(msg);
      user.step = 1;
    }
    else if (typeof res === 'number' && res < 0) {
      var msg = r.password_duplicate;
      showError(msg);
    }
    else if (res === true || res === 1) {
      var msg = r.success_change_password;
      showMessage(msg);
    }
    else {
      var msg = r.fail_change_password;
      showError(msg);
    }
    if (loading) {
      loading.hideLoading();
    }
  }).catch(function (err) {
    handleError(err);
    if (loading) {
      loading.hideLoading();
    }
  });
}
exports.changePassword = changePassword;
function validateAndChangePassword(change, user, confirmPassword, r, showMessage, showError, hideMessage, validate, handleError, reg, loading, showCustomError) {
  var s = (showCustomError ? undefined : showError);
  var results = validate(user, confirmPassword, r, reg, s);
  if (results === false) {
    return;
  }
  else if (Array.isArray(results) && results.length > 0) {
    if (showCustomError) {
      showCustomError(results);
    }
    return;
  }
  else {
    hideMessage();
  }
  changePassword(change, user, r.resource(), showMessage, showError, handleError, loading);
}
exports.validateAndChangePassword = validateAndChangePassword;
