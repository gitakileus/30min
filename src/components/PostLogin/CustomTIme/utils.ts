// eslint-disable-next-line import/prefer-default-export
export const getCustomHours = values => {
  const splitValue = values?.split(':');
  const hours = Number(splitValue[0]);
  const minutes = Number(splitValue[1]);
  const item = (hours * 60 + minutes) as Number;

  return item;
};
