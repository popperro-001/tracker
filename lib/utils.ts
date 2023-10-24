export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  return formattedDate;
}

export function formatDateInput(isoString: string) {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getWeekdayFromDate(dateString: string) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateString);
  const weekdayIndex = date.getDay(); // 0 for Sunday, 1 for Monday, ...

  return daysOfWeek[weekdayIndex];
}

export function calculateCompletionStatus(arr: any) {
  // Initialize counters for true and false values
  let trueCount = 0;
  let falseCount = 0;

  // Iterate through the array and count true and false values
  arr.forEach((item: any) => {
    if (item.actual === true) {
      trueCount++;
    } else if (item.actual === false) {
      falseCount++;
    }
  });

  // Calculate the completion percentage
  const totalItems = trueCount + falseCount;
  const completionPercentage =
    totalItems === 0 ? 0 : (trueCount / totalItems) * 100;

  if (completionPercentage === 0) {
    return "Not completed";
  } else if (falseCount === 0) {
    return "Completed";
  } else {
    return Math.floor(completionPercentage) + "%";
  }
}

export function calculateTaskProgress(arr: any) {
  let trueCount = 0;
  let falseCount = 0;

  arr.map((elem: any) => {
    if (elem.weight > 0 || elem.reps > 0) {
      trueCount++;
    } else {
      falseCount++;
    }
  });

  const totalItems = arr.length;
  const progressPercentage = (trueCount / totalItems) * 100;

  return Math.floor(progressPercentage) + "%";
}
