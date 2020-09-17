import { DataType } from '../data-type';
import MoneyN from './moneyn';

const SmallMoney: DataType = {
  id: 0x7A,
  type: 'MONEY4',
  name: 'SmallMoney',

  declaration: function() {
    return 'smallmoney';
  },

  generateTypeInfo: function() {
    return Buffer.from([MoneyN.id, 0x04]);
  },

  generateParameterData: function*(parameter) {
    if (parameter.value != null) {
      const buffer = Buffer.alloc(5);
      buffer.writeUInt8(4, 0);
      buffer.writeInt32LE(parameter.value * 10000, 1);
      yield buffer;
    } else {
      yield Buffer.from([0x00]);
    }
  },

  toBuffer: function(parameter) {
    const value = parameter.value;

    if (value != null) {
      const val = parseFloat(value as string) * 10000;

      // SmallMoney is still 8 bytes, but the first 4 are always ignored
      const result = Buffer.alloc(8);
      result.writeInt32LE(val, 4);

      return result;
    } else {
      return Buffer.from([]);
    }
  },

  validate: function(value): null | number | TypeError {
    if (value == null) {
      return null;
    }
    value = parseFloat(value);
    if (isNaN(value)) {
      return new TypeError('Invalid number.');
    }
    if (value < -214748.3648 || value > 214748.3647) {
      return new TypeError('Value must be between -214748.3648 and 214748.3647.');
    }
    return value;
  }
};

export default SmallMoney;
module.exports = SmallMoney;
