const commmand = process.argv[2];
const argument = process.argv.slice(3);
import { HospitalController } from "@controller/controller.js";

switch (commmand) {
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
    HospitalController.addPatient(argument);
    break;
  case "updatePatient":
    HospitalController.updatePatient(argument);
    break;
  case "deletePatient":
    HospitalController.deletePatient(argument);
    break;
  case "findPatientBy:":
    HospitalController.findPatient(argument[0]!, argument[1]!);
    break;
  case "show":
    HospitalController.show(argument[0]!);
    break;
  default:
    HospitalController.help();
    break;
}
