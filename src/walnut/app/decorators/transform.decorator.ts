import { Transform } from 'class-transformer';
import { castArray, isArray, isNil, map, trim } from 'lodash';

import { AppDayjs } from '@/utils/dayjs';
import { isEmail, isPhoneNumber } from 'class-validator';

/**
 * @description trim spaces from start and end, replace multiple spaces with one.
 * @example
 * @ApiProperty()
 * @IsString()
 * @Trim()
 * name: string;
 * @returns PropertyDecorator
 * @constructor
 */
export function Trim(): PropertyDecorator {
  return Transform((params) => {
    const value = params.value as string[] | string;

    if (isArray(value)) {
      return map(value, (v) => trim(v).replace(/\s\s+/g, ' '));
    }

    return trim(value).replace(/\s\s+/g, ' ');
  });
}

export function ToBoolean(): PropertyDecorator {
  return Transform(
    (params) => {
      switch (params.value) {
        case 'true':
          return true;
        case 'false':
          return false;
        default:
          return params.value;
      }
    },
    { toClassOnly: true },
  );
}

/**
 * @description convert string or number to integer
 * @example
 * @IsNumber()
 * @ToInt()
 * name: number;
 * @returns PropertyDecorator
 * @constructor
 */
export function ToInt(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value as string;

      return Number.parseInt(value, 10);
    },
    { toClassOnly: true },
  );
}

/**
 * @description transforms to array, specially for query params
 * @example
 * @IsNumber()
 * @ToArray()
 * name: number;
 * @constructor
 */
export function ToArray(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value;

      if (isNil(value)) {
        return [];
      }

      return castArray(value);
    },
    { toClassOnly: true },
  );
}

export function ToLowerCase(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value;

      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        return value.toLowerCase();
      }

      return value.map((v) => v.toLowerCase());
    },
    {
      toClassOnly: true,
    },
  );
}

export function ToUpperCase(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value;

      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        return value.toUpperCase();
      }

      return value.map((v) => v.toUpperCase());
    },
    {
      toClassOnly: true,
    },
  );
}

export function TransformObjectIdToStringId(): PropertyDecorator {
  return Transform(
    (params) => {
      const value = params.value;

      if (!value) {
        return;
      }

      if (!Array.isArray(value)) {
        return value.toString();
      }

      return value.map((v) => v.toString());
    },
    {
      toPlainOnly: true,
    },
  );
}

export function TransformToFormattedTime(): PropertyDecorator {
  return Transform((params) => {
    const value = params.value;

    if (!value) {
      return;
    }

    return AppDayjs(value).format('YYYY-MM-DD HH:mm:ss');
  });
}

export function TransformToGHz(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return;
    }

    return `${value} GHz`;
  });
}

export function TransformSizeToGB(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return;
    }

    return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`;
  });
}

export function TransformToVoltage(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return;
    }

    return `${value} V`;
  });
}

export function TransformToMWH(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return;
    }

    return `${value} mWh`;
  });
}

export function TransformToPercentage(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return;
    }

    return `${value} %`;
  });
}

export function TransformToSeconds(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return '0 s';
    }

    return `${value} s`;
  });
}

export function TransformSecondsToHours(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return;
    }

    return `${(value / 60 / 60).toFixed(2)} h`;
  });
}

export function TransformMbitsToMBs(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return;
    }

    return `${(value / 8).toFixed(2)} MB/s`;
  });
}

export function TransformToBytes(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return;
    }

    return `${value} bytes`;
  });
}

export function TransformEmail(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return;
    }

    return value.replace(
      /^(.)(.*)(.@.*)$/,
      (_, a, b, c) => a + b.replace(/./g, '*') + c,
    );
  });
}

export function TransformPhoneNumber(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return;
    }

    return value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
  });
}

export function TransformUsername(): PropertyDecorator {
  return Transform(({ value }) => {
    if (!value) {
      return;
    }

    if (isEmail(value)) {
      return value.replace(
        /^(.)(.*)(.@.*)$/,
        (_, a, b, c) => a + b.replace(/./g, '*') + c,
      );
    }

    // TODO second param
    if (isPhoneNumber(value, 'CN')) {
      return value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
    }

    return value;
  });
}
