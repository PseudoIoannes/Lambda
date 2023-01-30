const calculatePriceAndDeadline = (
  language,
  signAmmount,
  extension,
  pointInTime
) => {
  const languages = {
    ukr: { perSign: 0.05, min: 50, signsPerHour: 1333 },
    rus: { perSign: 0.05, min: 50, signsPerHour: 1333 },
    eng: { perSign: 0.12, min: 120, signsPerHour: 333 },
  };
  if (language in languages === false) {
    return { msg: "not supported language, try ukr,eng,rus" };
  }
  const fileExtensions = ["doc", "docx", "rtf"]; //+20

  let precalculated = languages[language].perSign * signAmmount;
  precalculated =
    precalculated >= languages[language].min
      ? precalculated
      : languages[language].min;
  const price = fileExtensions.includes(extension)
    ? precalculated
    : precalculated * 1.2;

  // console.log(price);

  let timeInHours = fileExtensions.includes(extension)
    ? signAmmount / languages[language].signsPerHour + 0.5
    : (signAmmount / languages[language].signsPerHour + 0.5) * 1.2;
  if (timeInHours < 1) timeInHours = 1;
  // console.log(timeInHours);
  const time = timeInHours;

  function setHoursToTen(now) {
    now.setHours(10);
    now.setMinutes(0);
    now.setSeconds(0);
  }

  function ifWeekendSetDaytoMonday(now) {
    let date = now.getDate(); // 31
    let day = now.getDay();

    if (day === 6) {
      now.setDate(date + 2);
      setHoursToTen(now);
    }
  }

  function SetToNextDayMorning(now) {
    let date = now.getDate();
    now.setDate(date + 1);
    setHoursToTen(now);
  }

  let now;
  if (!pointInTime) {
    now = new Date();
  } else {
    now = pointInTime;
  }

  let date = now.getDate(); // 31
  let day = now.getDay();
  let hour = now.getHours();

  //preparation
  if (day === 0 || day === 6) {
    day === 0 ? now.setDate(date + 1) : now.setDate(date + 2);
    setHoursToTen(now);
  } else {
    if (now.getMinutes() !== 0) {
      now.setHours(hour + 1); // next hour?
      now.setMinutes(0);
      now.setSeconds(0);
      ifWeekendSetDaytoMonday(now);
    }
    if (now.getHours() < 10) {
      now.setHours(10);
    }
  }
  // main loop
  while (timeInHours >= 1) {
    let hour = now.getHours();
    if (hour < 19) {
      timeInHours -= 1;
      now.setHours(hour + 1);
    } else {
      SetToNextDayMorning(now);
      ifWeekendSetDaytoMonday(now);
    }
  }
  // left minutes
  now.setMinutes(Math.floor(timeInHours * 60));

  if (now.getHours() === 19 && now.getMinutes() !== 0) {
    SetToNextDayMorning(now);
    ifWeekendSetDaytoMonday(now);
    now.setMinutes(Math.floor(timeInHours * 60));
  }

  const unix = now.valueOf();
  return { deadline_date: now, deadline: unix, time, price };
};
module.exports = { calculatePriceAndDeadline };
