import {BaseComponent} from './BaseComponent';
import {PasswordReset} from './PasswordReset';
import {PasswordService} from './PasswordService';
import {isEmpty, LoadingService, MessageService, ResourceService} from './core';

export class BaseResetPasswordComponent extends BaseComponent {
  constructor(passwordService: PasswordService, resource: ResourceService, protected loading?: LoadingService) {
    super(passwordService, resource);
    this.resetPassword = this.resetPassword.bind(this);
  }
  user: PasswordReset = {
    username: '',
    passcode: '',
    password: ''
  };
  confirmPassword = '';

  resetPassword() {
    this.user.username = this.user.username.trim();
    resetPassword(this.passwordService, this.user, this.confirmPassword, this.resourceService, this, this.loading, validateReset, this.handleError);
  }
}

export async function resetPassword(passwordService: PasswordService, user: PasswordReset, confirmPassword: string, r: ResourceService, m: MessageService, loading: LoadingService, validate: (u: PasswordReset, c: string, r2: ResourceService, m2: MessageService) => boolean, handleError: (err: any) => void) {
  if (!validateReset(user, confirmPassword, r, m)) {
    return;
  } else {
    m.hideMessage();
  }
  try {
    if (loading) {
      loading.showLoading();
    }
    const success = await passwordService.resetPassword(user);
    if (success === true || success === 1) {
      const msg = r.value('success_reset_password');
      m.showInfo(msg);
    } else {
      const msg = r.value('fail_reset_password');
      m.showError(msg);
    }
  } catch (err) {
    handleError(err);
  }
  finally {
    if (loading) {
      loading.hideLoading();
    }
  }
}

export function validateReset(user: PasswordReset, confirmPassword: string, r: ResourceService, m: MessageService): boolean {
  let valid = true;
  if (isEmpty(user.username)) {
    valid = false;
    const msg = r.format(r.value('error_required'), r.value('username'));
    m.showError(msg, 'username');
  } else if (isEmpty(user.passcode)) {
    valid = false;
    const msg = r.format(r.value('error_required'), r.value('passcode'));
    m.showError(msg, 'passcode');
  } else if (isEmpty(user.password)) {
    valid = false;
    const msg = r.format(r.value('error_required'), r.value('new_password'));
    m.showError(msg, 'password');
  } else if (user.password !== confirmPassword) {
    valid = false;
    const msg = r.value('error_confirm_password');
    m.showError(msg, 'confirmPassword');
  }
  return valid;
}
