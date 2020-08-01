import {PasswordChange} from './PasswordChange';
import {PasswordService} from './PasswordService';
import {BaseComponent} from './BaseComponent';
import {isEmpty, LoadingService, ResourceService} from './core';

export class BaseChangePasswordComponent extends BaseComponent {
  constructor(passwordService: PasswordService, resource: ResourceService, protected loading?: LoadingService) {
    super(passwordService, resource);
    this.validate = this.validate.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }
  user: PasswordChange = {
    step: null,
    username: '',
    currentPassword: '',
    password: ''
  };
  confirmPassword = '';

  validate(user: PasswordChange): boolean {
    const r = this.resourceService;
    if (isEmpty(user.username)) {
      const msg = r.format(r.value('error_required'), r.value('username'));
      this.showError(msg);
      return false;
    }
    if (isEmpty(user.password)) {
      const msg = r.format(r.value('error_required'), r.value('new_password'));
      this.showError(msg);
      return false;
    }
    if (isEmpty(user.currentPassword)) {
      const msg = r.format(r.value('error_required'), r.value('current_password'));
      this.showError(msg);
      return false;
    }
    if (user.password !== this.confirmPassword) {
      const msg = r.value('error_confirm_password');
      this.showError(msg);
      return false;
    }
    return true;
  }
  async changePassword() {
    this.user.username = this.user.username.trim();
    if (!this.validate(this.user)) {
      return;
    } else {
      this.hideMessage();
    }
    try {
      if (this.loading) {
        this.loading.showLoading();
      }
      const result = await this.passwordService.changePassword(this.user);
      const r = this.resourceService;
      if (result === 2) {
        const msg = r.value('success_send_passcode_change_password');
        this.showInfo(msg);
        this.user.step = 1;
      } else if (result === true || result === 1) {
        const msg = r.value('success_change_password');
        this.showInfo(msg);
      } else {
        const msg = r.value('fail_change_password');
        this.showError(msg);
      }
    } catch (err) {
      this.handleError(err);
    } finally {
      if (this.loading) {
        this.loading.hideLoading();
      }
    }
  }
}
