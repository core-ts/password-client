export interface UIService {
  initMaterial(form: any): void;
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

