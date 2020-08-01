import {BaseComponent} from './BaseComponent';
import {PasswordReset} from './PasswordReset';
import {PasswordService} from './PasswordService';
import {LoadingService, ResourceService} from './core';
import {resetPassword, validateReset} from './reset';

export class ResetPasswordComponent extends BaseComponent {
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
