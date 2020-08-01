export interface PasswordReset {
  username: string;
  passcode: string;
  password: string;
}

export interface PasswordChange {
  step?: number;
  username: string;
  passcode?: string;
  currentPassword: string;
  password: string;
  senderType?: string;
}

export interface PasswordService {
  forgotPassword(contact: string): Promise<boolean>;
  resetPassword(pass: PasswordReset): Promise<boolean|number>;
  changePassword(pass: PasswordChange): Promise<boolean|number>;
}

interface Headers {
  [key: string]: any;
}

export interface HttpRequest {
  get<T>(url: string, options?: { headers?: Headers; }): Promise<T>;
  delete<T>(url: string, options?: { headers?: Headers; }): Promise<T>;
  post<T>(url: string, obj: any, options?: { headers?: Headers; }): Promise<T>;
  put<T>(url: string, obj: any, options?: { headers?: Headers; }): Promise<T>;
  patch<T>(url: string, obj: any, options?: { headers?: Headers; }): Promise<T>;
}

export class PasswordWebClient implements PasswordService {
  constructor(protected http: HttpRequest, protected serviceUrl: string) {
  }

  forgotPassword(contact: string): Promise<boolean> {
    const url = this.serviceUrl + '/forgot/' + contact;
    return this.http.get<boolean>(url);
  }

  resetPassword(password: PasswordReset): Promise<boolean|number> {
    const url = this.serviceUrl + '/reset';
    return this.http.post<boolean>(url, password);
  }

  changePassword(pass: PasswordChange): Promise<boolean|number> {
    const url = this.serviceUrl + '/change';
    return this.http.put<boolean>(url, pass);
  }
}

export interface ResourceService {
  resource(): any;
  value(key: string, param?: any): string;
  format(...args: any[]): string;
}

export interface LoadingService {
  showLoading(firstTime?: boolean): void;
  hideLoading(): void;
}

export interface MessageService {
  showInfo(msg: string, field?: string): void;
  showError(msg: string, field?: string): void;
  hideMessage(field?: string): void;
}

export function isEmpty(str: string): boolean {
  return (!str || str === '');
}

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
