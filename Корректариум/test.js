const { calculatePriceAndDeadline } = require("./algorithm");

describe("before weekend", () => {
  test("last hour before end of the day and next day is weekend", () => {
    expect(
      calculatePriceAndDeadline(
        "ukr",
        1333,
        "doc",
        new Date("2023-01-27T23:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-30T11:30:00")));
  });
  test("last hour and a minute before end of the day and next day is weekend", () => {
    expect(
      calculatePriceAndDeadline(
        "ukr",
        1333,
        "doc",
        new Date("2023-01-27T23:01:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-30T11:30:00")));
  });
});

describe("different starting hour in a day", () => {
  test("one hour, request before 10 hours", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        166,
        "doc",
        new Date("2023-01-30T01:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-30T11:00:00")));
  });

  test("one hour, request at 10 hours", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        166,
        "doc",
        new Date("2023-01-30T10:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-30T11:00:00")));
  });

  test("one hour, request at 10:01 hours", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        166,
        "doc",
        new Date("2023-01-30T10:01:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-30T12:00:00")));
  });

  test("one hour, request at 18 hours", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        166,
        "doc",
        new Date("2023-01-30T18:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-30T19:00:00")));
  });
  test("one hour, request at 18:01 hours", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        166,
        "doc",
        new Date("2023-01-30T18:01:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-31T11:00:00")));
  });

  test("one hour, request at 19 hours", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        166,
        "doc",
        new Date("2023-01-30T19:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-31T11:00:00")));
  });

  test("one hour, request after 19 hours", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        166,
        "doc",
        new Date("2023-01-30T20:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-31T11:00:00")));
  });

  test("one hour, request at 23 hours", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        166,
        "doc",
        new Date("2023-01-30T23:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-31T11:00:00")));
  });
});

// test("1.5 hours", () => {
//   expect(
//     calculatePriceAndDeadline("eng", 333, "doc", new Date("2023-01-27T23:00:00"))
//   ).toStrictEqual(new Date("2023-01-30T11:30:00"));
// });

describe("day or more", () => {
  test("ten hours, request before 10 hours", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        3165,
        "doc",
        new Date("2023-01-30T01:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-31T11:00:00")));
  });

  test("nine hours, request before 10 hours", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        2831,
        "doc",
        new Date("2023-01-30T01:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-30T19:00:00")));
  });

  test("ten hours, request before 10 hours at Friday", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        3165,
        "doc",
        new Date("2023-01-27T01:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-30T11:00:00")));
  });

  test("nine hours, request before 10 hours at Saturday", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        2831,
        "doc",
        new Date("2023-01-28T01:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-30T19:00:00")));
  });

  test("nine hours and 3 min, request before 10 hours, checking if deadline is 19:00 + minutes", () => {
    expect(
      calculatePriceAndDeadline(
        "eng",
        2850,
        "doc",
        new Date("2023-01-30T01:00:00")
      )
    ).toStrictEqual(expect.objectContaining(new Date("2023-01-31T10:03:00")));
  });
});

//2500 = 8
