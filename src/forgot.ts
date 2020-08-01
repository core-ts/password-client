import {PasswordService} from './PasswordService';
import {isEmpty, LoadingService, MessageService, ResourceService} from './core';

export function validateContact(contact: string, resourceKey: string, r: ResourceService, showError: (m: string, field?: string) => void): boolean {
  if (isEmpty(contact)) {
    const msg = r.format(r.value('error_required'), r.value(resourceKey));
    showError(msg);
    return false;
  }
  return true;
}

export async function forgotPassword(passwordService: PasswordService, contact: string, resourceKey: string, r: ResourceService, m: MessageService, validate: (u: string, c: string, r2: ResourceService, show: (m3: string, field3?: string) => void) => boolean, handleError: (err: any) => void, loading?: LoadingService) {
  m.hideMessages();
  if (!validate(contact, resourceKey, r, m.showError)) {
    return;
  }
  try {
    if (loading) {
      loading.showLoading();
    }
    const result = await passwordService.forgotPassword(contact);
    if (result) {
      const msg =  r.value('success_forgot_password');
      m.showInfo(msg);
    } else {
      const msg = r.value('fail_forgot_password');
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
