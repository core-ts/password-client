import {BaseComponent} from './BaseComponent';
import {validateChange} from './change';
import {LoadingService, ResourceService} from './core';
import {PasswordChange} from './PasswordChange';
import {PasswordService} from './PasswordService';

export class ChangePasswordComponent extends BaseComponent {
  constructor(passwordService: PasswordService, resource: ResourceService, protected loading?: LoadingService) {
    super(passwordService, resource);
    this.changePassword = this.changePassword.bind(this);
  }
  user: PasswordChange = {
    step: null,
    username: '',
    currentPassword: '',
    password: ''
  };
  confirmPassword = '';
  
  async changePassword() {
    this.user.username = this.user.username.trim();
    if (!validateChange(this.user, this.confirmPassword, this.resourceService, this.showError)) {
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
