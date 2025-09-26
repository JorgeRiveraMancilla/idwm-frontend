export const stringRegexValidation = (
  value: string,
  regex: RegExp
): boolean => {
  return regex.test(value);
};
