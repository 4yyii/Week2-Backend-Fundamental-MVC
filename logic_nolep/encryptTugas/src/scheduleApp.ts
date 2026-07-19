import moment from "moment";

function scheduleTask() {
  const date = moment().add(3, "d");
  console.log(`Scheduled task for: ${date}`);
}

export default scheduleTask;
