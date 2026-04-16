import { Employee } from "@employee/employee.js";
import type { Patient } from "@employee/patient.js";

export class HospitalView {
  public static errorView(err: Error | string) {
    console.log(err);
  }

  public static registerView(employee: Employee[]) {
    const data = employee[employee.length - 1];
    console.log(
      `Save data success. Welcome ${data?.username} (${data?.position}) | Total employee: ${employee.length}`,
    );
  }

  public static loginView(employee: Employee[]) {
    const data = employee.find((u) => u.login === true);
    if (data) {
      console.log(`Login success. Hello ${data?.username} (${data.position})`);
    }
  }

  public static logoutView() {
    console.log("Logout success. GoodBye!");
  }

  public static addPatientView(patient: Patient[]) {
    const data = patient[patient.length - 1];
    console.log(
      `Successfully added patient ${data?.name} with id: ${data?.id}`,
    );
  }

  public static updatePatientView(patient: Patient[]) {
    console.log(`Successfully updated patient`);
  }

  public static deletePatientView(patient: Patient[]) {
    console.log(`Successfully deleted patient`);
  }

  public static findPatientView(patient: Patient[]) {
    console.table(patient);
  }

  public static showPatientView(patient: Patient[]) {
    console.table(patient);
  }

  public static showEmployeeView(employee: Employee[]) {
    console.table(employee);
  }
}
