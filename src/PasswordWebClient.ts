import {PasswordChange} from './PasswordChange';
import {PasswordReset} from './PasswordReset';
import {PasswordService} from './PasswordService';

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
