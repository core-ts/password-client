import {BaseComponent} from './BaseComponent';
import {changePassword, validateChange} from './change';
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
    changePassword(this.passwordService, this.user, this.confirmPassword, this.resourceService, this, validateChange, this.handleError, this.loading);
  }
}
