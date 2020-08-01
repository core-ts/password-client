import {PasswordChange} from './PasswordChange';
import {isEmpty, ResourceService} from './core';

export function validateChange(user: PasswordChange, confirmPassword: string, r: ResourceService, showError: (m: string, field?: string) => void): boolean {
  if (isEmpty(user.username)) {
    const msg = r.format(r.value('error_required'), r.value('username'));
    showError(msg, 'username');
    return false;
  }
  if (isEmpty(user.password)) {
    const msg = r.format(r.value('error_required'), r.value('new_password'));
    showError(msg, 'password');
    return false;
  }
  if (isEmpty(user.currentPassword)) {
    const msg = r.format(r.value('error_required'), r.value('current_password'));
    showError(msg, 'currentPassword');
    return false;
  }
  if (user.password !== confirmPassword) {
    const msg = r.value('error_confirm_password');
    showError(msg, 'confirmPassword');
    return false;
  }
  return true;
}
