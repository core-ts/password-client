import {PasswordChange} from './PasswordChange';
import {PasswordReset} from './PasswordReset';

export interface PasswordService {
  forgotPassword(contact: string): Promise<boolean>;
  resetPassword(pass: PasswordReset): Promise<boolean|number>;
  changePassword(pass: PasswordChange): Promise<boolean|number>;
}
