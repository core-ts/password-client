import {BaseComponent} from './BaseComponent';
import {PasswordService} from './PasswordService';
import {isEmpty, LoadingService, ResourceService} from './core';

export class BaseForgotPasswordComponent extends BaseComponent {
  constructor(passwordService: PasswordService, resource: ResourceService, protected loading?: LoadingService) {
    super(passwordService, resource);
    this.validate = this.validate.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
  }
  contact = '';

  validate(contact: string): boolean {
    const r = this.resourceService;
    if (isEmpty(contact)) {
      const msg = r.format(r.value('error_required'), r.value('email'));
      this.showError(msg);
      return false;
    }
    return true;
  }
  async forgotPassword() {
    this.contact = this.contact.trim();
    if (!this.validate(this.contact)) {
      return;
    } else {
      this.hideMessage();
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
