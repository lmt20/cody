/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-floating-promises */
import * as vscode from 'vscode';
import * as os from 'os';
import {
  VSCodeCommands,
  EXTENSION_ID,
  VSLS_EXTENSION_PACK_ID,
  VSLS_EXTENSION_ID,
  VSLS_SPACES_EXTENSION_ID
} from '../common/constants';

export const openUrl = (url: string) => {
  const parsedUrl = vscode.Uri.parse(url);
  return vscode.commands.executeCommand(VSCodeCommands.OPEN, parsedUrl);
};

export const openSettings = () => {
  vscode.commands.executeCommand(VSCodeCommands.OPEN_SETTINGS);
};

export const setVsContext = (name: string, value: boolean) => {
  return vscode.commands.executeCommand('setContext', name, value);
};

export const getExtension = (
  extensionId: string
): vscode.Extension<any> | undefined => {
  return vscode.extensions.getExtension(extensionId);
};

export interface Versions {
  os: string;
  extension: string;
  editor: string;
}

export const getExtensionVersion = (): string => {
  const extension = getExtension(EXTENSION_ID);
  return extension ? extension.packageJSON.version : undefined;
};

export const getVersions = (): Versions => {
  return {
    os: `${os.type()} ${os.arch()} ${os.release()}`,
    extension: getExtensionVersion(),
    editor: vscode.version
  };
};

export const hasVslsExtensionPack = (): boolean => {
  return !!getExtension(VSLS_EXTENSION_PACK_ID);
};

export const hasVslsExtension = (): boolean => {
  return !!getExtension(VSLS_EXTENSION_ID);
};

export const hasVslsSpacesExtension = (): boolean => {
  return !!getExtension(VSLS_SPACES_EXTENSION_ID);
}

export const sanitiseTokenString = (token: string) => {
  const trimmed = token.trim();
  const sansQuotes = trimmed.replaceAll(/["']+/g, '');
  return sansQuotes;
};

export function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isSuperset(set: Set<any>, subset: Set<any>): boolean {
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

export function difference(setA: Set<any>, setB: Set<any>) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}

export function equals(setA: Set<any>, setB: Set<any>) {
  if (setA.size !== setB.size) {
    return false;
  }

  for (const a of setA) {
    if (!setB.has(a)) {
      return false;
    }
  }

  return true;
}

// User-defined type guard
// https://github.com/Microsoft/TypeScript/issues/20707#issuecomment-351874491
export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

export function toTitleCase(str: string) {
  return str.replaceAll(/\w\S*/g, txt => {
    return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
  });
}

export function toDateString(date: Date) {
  // Returns ISO-format date string for a given date
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  if (month.length === 1) {
    month = `0${month}`;
  }

  if (day.length === 1) {
    day = `0${day}`;
  }

  return `${date.getFullYear()}-${month}-${day}`;
}

export function camelCaseToTitle(text: string) {
  const result = text.replaceAll(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function titleCaseToCamel(text: string) {
  const result = text.replaceAll(' ', '');
  return result.charAt(0).toLowerCase() + result.slice(1);
}
