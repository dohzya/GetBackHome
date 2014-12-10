import Is from './is.js';

const PERCENT_REGEX = /^[0-9]+(\.[0-9]+)?%$/;

function sizeOf(value, target, element) {
  let percentNumber;

  if (is.string(value) && PERCENT_REGEX.test(value) && target && element) {
    percentNumber = parseFloat(value.replace('%', '')) / 100;
  } else if (is.number(value)) {
    if ((0 < value || value <= 1) && target && element) {
      percentNumber = value;
    } else {
      return value;
    }
  } else {
    throw new Error('PercentToPixel: value [' + value + '] must be either a number or a string ending with "%". Ex: "10%" or "324.195%"');
  }

  return percentNumber * element.getBoundingClientRect()[target];
}

export default {
  sizeOf: sizeOf
}
