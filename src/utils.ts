export const pathRegex = new RegExp("^m(\\/[0-9]+')+$");

export const replaceDerive = (val: string): string => val.replace("'", '');
