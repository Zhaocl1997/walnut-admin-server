// 2000 => success
// 4001 => access token expire
// 4002 => refresh token expire
// 4003 => access denied
// 4003 => oauth failed
// 4009 => user exists
// 4010 => user not found
// 4011 => password invalid
// 4012 => user is banned
// 4020 => data existed
// 4021 => data do not exist
// 4022 => delete error
// 4023 => request data error
// 4024 => verify code error
// 4030 => request id error
// 4040 => endpoint not found
// 4060 => useragent not acceptable
// 4061 => useragent os not acceptable
// 4062 => useragent browser not acceptable
// 4063 => ip not acceptable
// 4101 => email send error
// 4102 => text message send error
// 4290 => request too frequent
// 5000 => internal server error
// 5555 => database error
// 7777 => endpoint disabled
// 8888 => System functionality has been disabled
// 9999 => custom error
export const responseCodeList = [
  2000, 4001, 4002, 4003, 4004, 4009, 4010, 4011, 4012, 4020, 4021, 4022, 4023,
  4024, 4030, 4040, 4060, 4061, 4062, 4063, 4101, 4102, 4290, 5000, 5555, 7777,
  8888, 9999,
] as const;

export const AppConstResponseCode = Object.fromEntries(
  responseCodeList.map((i) => [i, i]),
);
