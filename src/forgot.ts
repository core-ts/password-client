import {isEmpty, ResourceService} from './core';

export function validateContact(contact: string, resourceKey: string, r: ResourceService, showError: (m: string, field?: string) => void): boolean {
    if (isEmpty(contact)) {
      const msg = r.format(r.value('error_required'), r.value(resourceKey));
      showError(msg);
      return false;
    }
    return true;
  }
