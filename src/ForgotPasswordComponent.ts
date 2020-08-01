import {BaseComponent} from './BaseComponent';
import {LoadingService, ResourceService} from './core';
import {forgotPassword, validateContact} from './forgot';
import {PasswordService} from './PasswordService';

export class ForgotPasswordComponent extends BaseComponent {
  constructor(passwordService: PasswordService, resource: ResourceService, protected resourceKey: string, protected loading?: LoadingService) {
    super(passwordService, resource);
    this.forgotPassword = this.forgotPassword.bind(this);
  }
  contact = '';

  async forgotPassword() {
    this.contact = this.contact.trim();
    forgotPassword(this.passwordService, this.contact, this.resourceKey, this.resourceService, this, validateContact, this.handleError, this.loading);
  }
}
