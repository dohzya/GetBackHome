import * as isArguments from 'lodash-node/modern/objects/isArguments';
import * as isArray from 'lodash-node/modern/objects/isArray';
import * as isBoolean from 'lodash-node/modern/objects/isBoolean';
import * as isDate from 'lodash-node/modern/objects/isDate';
import * as isElement from 'lodash-node/modern/objects/isElement';
import * as isEmpty from 'lodash-node/modern/objects/isEmpty';
import * as isEqual from 'lodash-node/modern/objects/isEqual';
import * as isFinite from 'lodash-node/modern/objects/isFinite';
import * as isFunction from 'lodash-node/modern/objects/isFunction';
import * as isNaN from 'lodash-node/modern/objects/isNaN';
import * as isNull from 'lodash-node/modern/objects/isNull';
import * as isNumber from 'lodash-node/modern/objects/isNumber';
import * as isObject from 'lodash-node/modern/objects/isObject';
import * as isPlainObject from 'lodash-node/modern/objects/isPlainObject';
import * as isRegExp from 'lodash-node/modern/objects/isRegExp';
import * as isString from 'lodash-node/modern/objects/isString';
import * as isUndefined from 'lodash-node/modern/objects/isUndefined';

export default {
  arguments: isArguments,
  array: isArray,
  boolean: isBoolean,
  date: isDate,
  element: isElement,
  empty: isEmpty,
  equal: isEqual,
  finite: isFinite,
  function: isFunction,
  nan: isNaN,
  null: isNull,
  number: isNumber,
  object: isObject,
  plainObject: isPlainObject,
  regExp: isRegExp,
  string: isString,
  undefined: isUndefined
}
