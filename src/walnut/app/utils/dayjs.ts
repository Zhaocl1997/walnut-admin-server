import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as tz from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(tz);

export { dayjs as AppDayjs };
