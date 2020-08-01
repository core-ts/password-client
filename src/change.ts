import {PasswordChange} from './PasswordChange';
import {PasswordService} from './PasswordService';
import {isEmpty, LoadingService, MessageService, ResourceService} from './core';

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

export async function changePassword(passwordService: PasswordService, user: PasswordChange, confirmPassword: string, r: ResourceService, m: MessageService, validate: (u: PasswordChange, c: string, r2: ResourceService, show: (m3: string, field3?: string) => void) => boolean, handleError: (err: any) => void, loading?: LoadingService) {
  m.hideMessages();
  if (!validate(user, confirmPassword, r, m.showError)) {
    return;
  }
  try {
    if (loading) {
      loading.showLoading();
    }
    const result = await passwordService.changePassword(user);
    if (result === 2) {
      const msg = r.value('success_send_passcode_change_password');
      m.showInfo(msg);
      user.step = 1;
    } else if (result === true || result === 1) {
      const msg = r.value('success_change_password');
      m.showInfo(msg);
    } else {
      const msg = r.value('fail_change_password');
      m.showError(msg);
    }
  } catch (err) {
    handleError(err);
  } finally {
    if (loading) {
      loading.hideLoading();
    }
  }
}
