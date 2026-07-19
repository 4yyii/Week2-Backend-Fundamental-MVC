import type Employee from "@employee/employee.js";
import type Patient from "@employee/patient.js";

class HospitalView {
  public static registerView(newEmployee: Employee[]) {
    const employee = newEmployee[newEmployee.length - 1];
    console.log(
      `Register success. Welcome ${employee?.username} (${employee?.position})`,
    );
  }

  public static errorView(err: Error) {
    console.log(err.message);
  }

  public static loginView(employee: Employee[]) {
    const emp = employee[employee.length - 1];
    console.log(`Login success. Hello ${emp?.username} (${emp?.position})`);
  }

  public static logoutView() {
    console.log(`Logout success. Goodbye!`);
  }

  public static addPatientView(newPatient: Patient[]) {
    const patient = newPatient[newPatient.length - 1];
    console.log(`Successfully added a patient (${patient?.name})`);
  }

  public static updatePatientView() {
    console.log("Update success");
  }

  public static deletePatientView() {
    console.log("Delete success");
  }

  public static showEmployeeView(employee: Employee[]) {
    console.table(employee);
  }

  public static showPatientView(patient: Patient[]) {
    console.table(patient);
  }

  public static findPatientBy(patient: Patient) {
    console.log(patient);
  }

  public static helpView() {
    console.log(`
==========================
HOSPITAL INTERFACE COMMAND
==========================
node index.js register <username> <password> <jabatan>
node index.js login <username> <password>
node index.js addPatient <id> <namaPasien> <penyakit1> <penyakit2> ....
node index.js updatePatient <id> <namaPasien> <penyakit1> <penyakit2> ....
node index.js deletePatient <id>
node index.js logout
node index.js show <employee/patient>
node index.js findPatientBy: <name/id> <namePatient/idPatient>
    `);
  }
}

export default HospitalView;
