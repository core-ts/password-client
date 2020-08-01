import {BaseComponent} from './BaseComponent';
import {LoadingService, MessageService, ResourceService} from './core';
import {validateContact} from './forgot';
import {PasswordService} from './PasswordService';

export class ForgotPasswordComponent extends BaseComponent {
  constructor(passwordService: PasswordService, resource: ResourceService, protected loading?: LoadingService) {
    super(passwordService, resource);
    this.forgotPassword = this.forgotPassword.bind(this);
  }
  contact = '';

  async forgotPassword() {
    this.contact = this.contact.trim();
    if (!validateContact(this.contact, 'email', this.resourceService, this.showError)) {
      return;
    } else {
      this.hideMessages();
    }
    try {
      if (this.loading) {
        this.loading.showLoading();
      }
      const result = await this.passwordService.forgotPassword(this.contact);
      const r = this.resourceService;
      if (result) {
        const msg =  r.value('success_forgot_password');
        this.showInfo(msg);
      } else {
        const msg = r.value('fail_forgot_password');
        this.showError(msg);
      }
    } catch (err) {
      this.handleError(err);
    }
    finally {
      if (this.loading) {
        this.loading.hideLoading();
      }
    }
  }
}

