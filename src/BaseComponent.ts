import {ResourceService} from './core';
import {PasswordService} from './PasswordService';

export class BaseComponent {
  constructor(protected passwordService: PasswordService, protected resourceService: ResourceService) {
    this.resource = resourceService.resource();
    this.showInfo = this.showInfo.bind(this);
    this.showError = this.showError.bind(this);
    this.hideMessage = this.hideMessage.bind(this);
    this.handleError = this.handleError.bind(this);
  }
  resource: any;
  message = '';
  alertClass = '';

  showInfo(msg: string, field?: string): void {
    this.alertClass = 'alert alert-info';
    this.message = msg;
  }
  showError(msg: string, field?: string): void {
    this.alertClass = 'alert alert-danger';
    this.message = msg;
  }
  hideMessage(field?: string): void {
    this.alertClass = '';
    this.message = '';
  }
  handleError(err?: any): void {
    const r = this.resourceService;
    const msg = r.value('error_internal');
    this.showError(msg);
  }
}
