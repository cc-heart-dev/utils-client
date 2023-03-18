/**
 * @description Append according to the initial time
 * @param { Date } date
 * @param { Number} dayTime
 * @returns Date
 */
function dateManipulation(
  date: string | Date,
  dayTime: number,
  type?: "increment" | "decrement",
  dateType: "date" | "month" = "date"
): Date {
  const time = new Date(date);
  let curTime;
  const isDateType = dateType === "date";
  const getter = isDateType ? "getDate" : "getMonth";
  const setter = isDateType ? "setDate" : "setMonth";
  switch (type) {
    case "increment":
      curTime = time[getter]() + dayTime;
      break;
    default:
      curTime = time[getter]() - dayTime;
  }
  time[setter](curTime);
  return time;
}

export function dateAddTime(date: string | Date, dayTime: number): Date {
  return dateManipulation(date, dayTime, "increment", "date");
}

export function dateDivideTime(date: string | Date, dayTime: number): Date {
  return dateManipulation(date, dayTime, "decrement", "date");
}

export function dateAddMonth(date: string | Date, month: number): Date {
  return dateManipulation(date, month, "increment", "month");
}

export function dateDivideMonth(date: string | Date, dayTime: number): Date {
  return dateManipulation(date, dayTime, "decrement", "month");
}
