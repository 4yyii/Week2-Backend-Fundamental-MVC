import moment from "moment";

const scheduleTask = (task: string) => {
  const schedule = moment().add(3, "d");
  console.log(`Scheduled task for: ${task} ${schedule}`);
};

export default scheduleTask;
