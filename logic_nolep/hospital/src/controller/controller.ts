import { Employee } from "@employee/employee.js";
import { Patient } from "@employee/patient.js";
import { HospitalView } from "@view/view.js";

export class HospitalController {
  public static register(name: string, password: string, role: string) {
    Employee.register(name, password, role, (err, employee) => {
      if (err) {
        HospitalView.errorView(err);
      }

      if (employee) {
        HospitalView.registerView(employee);
      }
    });
  }

  public static login(name: string, password: string) {
    Employee.login(name, password, (err, employee) => {
      if (err) {
        HospitalView.errorView(err);
      }

      if (employee) {
        HospitalView.loginView(employee);
      }
    });
  }

  public static logout() {
    Employee.logout((err) => {
      if (err) {
        HospitalView.errorView(err);
      }
      HospitalView.logoutView();
    });
  }

  public static addPatient(args: string[]) {
    Patient.add(args, (err, patient) => {
      if (err) {
        HospitalView.errorView(err);
      }

      if (patient) {
        HospitalView.addPatientView(patient);
      }
    });
  }

  public static updatePatient(args: string[]) {
    Patient.update(args, (err, patient) => {
      if (err) {
        HospitalView.errorView(err);
      }

      if (patient) {
        HospitalView.updatePatientView(patient);
      }
    });
  }

  public static deletePatient(args: string[]) {
    Patient.delete(args, (err, patient) => {
      if (err) {
        HospitalView.errorView(err);
      }

      if (patient) {
        HospitalView.deletePatientView(patient);
      }
    });
  }

  public static findPatient(key: string, value: string) {
    Employee.currentUser((err) => {
      if (err) {
        HospitalView.errorView(err);
      }

      if (key === "name") {
        Patient.findAll((err, data) => {
          const isPatient = data?.find((u) => u.name === value);
          if (err) {
            HospitalView.errorView(err);
          }

          if (!isPatient) {
            HospitalView.errorView(`Patient not found with name: ${value}`);
            return;
          }

          if (isPatient) {
            HospitalView.findPatientView([isPatient]);
          }
        });
      }

      if (key === "id") {
        Patient.findAll((err, data) => {
          const isPatient = data?.find((u) => u.id === Number(value));
          if (err) {
            HospitalView.errorView(err);
          }

          if (!isPatient) {
            HospitalView.errorView(`Patient not found with id: ${value}`);
            return;
          }

          if (isPatient) {
            HospitalView.findPatientView([isPatient]);
          }
        });
      }
    });
  }

  public static show(type: string) {
    const allowedtype: string[] = ["employee", "patient"];
    Employee.currentUser((err, data) => {
      if (err) {
        HospitalView.errorView(err);
      }

      if (!allowedtype.includes(type)) {
        HospitalView.errorView("Type not match, choose (employee/patient)");
        return;
      }

      if (type === "employee") {
        const admin = data?.find((u) => u.login === true);
        if (admin?.position !== "admin") {
          HospitalView.errorView("Only admin can see it");
          return;
        }

        Employee.findAll((err, data) => {
          if (err) {
            HospitalView.errorView(err);
          } else {
            HospitalView.showEmployeeView(data!);
          }
        });
      }

      if (type === "patient") {
        const dokter = data?.find((u) => u.login === true);
        if (dokter?.position !== "dokter") {
          HospitalView.errorView("Only dokter can see it");
          return;
        }

        Patient.findAll((err, data) => {
          if (err) {
            HospitalView.errorView(err);
          } else {
            HospitalView.showPatientView(data!);
          }
        });
      }
    });
  }

  public static help() {
    console.log(`
> node index.js register <username> <password> <jabatan> 
> node index.js login <username> <password>
> node index.js addPatient <id> <namaPasien> <penyakit1> <penyakit2> ....
> node index.js updatePatient <id> <namaPasien> <penyakit1> <penyakit2> ....
> node index.js deletePatient <id> <namaPasien> <penyakit1> <penyakit2> ....
> node index.js logout
> node index.js show <employee/patient> 
> node index.js findPatientBy: <name/id> <namePatient/idPatient>    
    `);
  }
}
