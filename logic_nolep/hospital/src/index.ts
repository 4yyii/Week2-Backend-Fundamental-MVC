import HospitalController from "@controller/controller.js";

let command = process.argv[2];
let argument = process.argv.slice(3);

switch (command) {
  case "register":
    HospitalController.register(argument[0]!, argument[1]!, argument[2]!);
    break;
  case "login":
    HospitalController.login(argument[0]!, argument[1]!);
    break;
  case "logout":
    HospitalController.logout();
    break;
  case "addPatient":
    HospitalController.addPatient(
      Number(argument[0]),
      argument[1]!,
      argument.slice(2),
    );
    break;
  case "updatePatient":
    HospitalController.updatePatient(
      Number(argument[0]),
      argument[1]!,
      argument.slice(2),
    );
    break;
  case "deletePatient":
    HospitalController.deletePatient(Number(argument[0]));
    break;
  case "show":
    HospitalController.show(argument[0]!);
    break;
  case "findPatientBy:":
    HospitalController.findPatient(argument[0]!, argument[1]!);
    break;
  default:
    HospitalController.help();
    break;
}
