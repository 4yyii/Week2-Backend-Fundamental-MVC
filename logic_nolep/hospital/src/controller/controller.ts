import Employee from "@employee/employee.js";
import Patient from "@employee/patient.js";
import HospitalView from "@view/view.js";

class HospitalController {
  public static register(name: string, password: string, role: string) {
    Employee.register(name, password, role, (err, newEmployee) => {
      if (err) {
        HospitalView.errorView(err);
      } else {
        HospitalView.registerView(newEmployee!);
      }
    });
  }

  public static login(name: string, password: string) {
    Employee.login(name, password, (err, employee) => {
      if (err) {
        HospitalView.errorView(err);
      } else {
        HospitalView.loginView(employee!);
      }
    });
  }

  public static logout() {
    Employee.logout((err) => {
      if (err) {
        HospitalView.errorView(err);
      } else {
        HospitalView.logoutView();
      }
    });
  }

  public static addPatient(id: number, name: string, diseases: string[]) {
    Patient.add(id, name, diseases, (err, newPatient) => {
      if (err) {
        HospitalView.errorView(err);
      } else {
        HospitalView.addPatientView(newPatient!);
      }
    });
  }

  public static updatePatient(id: number, name: string, diseases: string[]) {
    Patient.update(id, name, diseases, (err) => {
      if (err) {
        HospitalView.errorView(err);
      } else {
        HospitalView.updatePatientView();
      }
    });
  }

  public static deletePatient(id: number) {
    Patient.delete(id, (err) => {
      if (err) {
        HospitalView.errorView(err);
      } else {
        HospitalView.deletePatientView();
      }
    });
  }

  public static show(type: string) {
    Employee.currentUser((err, data) => {
      if (err) {
        HospitalView.errorView(err);
        return;
      }

      if (type === "patient") {
        const isDokter = data?.find(
          (u) => u.login === true && u.position === "dokter",
        );

        if (!isDokter) {
          HospitalView.errorView(new Error("Only dokter can view patient"));
          return;
        }

        Patient.findAll((err, data) => {
          if (err) {
            HospitalView.errorView(err);
            return;
          }

          HospitalView.showPatientView(data!);
        });
        return;
      }

      if (type === "employee") {
        const isAdmin = data?.find(
          (u) => u.login === true && u.position === "admin",
        );

        if (!isAdmin) {
          HospitalView.errorView(new Error("Only admin can view employee"));
          return;
        }

        Employee.findAll((err, data) => {
          if (err) {
            HospitalView.errorView(err);
            return;
          }

          HospitalView.showEmployeeView(data!);
        });
        return;
      }

      HospitalView.errorView(new Error("Unknown show type"));
    });
  }

  public static findPatient(obj: string, value: string) {
    Employee.currentUser((err, data) => {
      if (err) {
        HospitalView.errorView(err);
        return;
      }

      const isDokter = data?.find(
        (u) => u.login === true && u.position === "dokter",
      );

      if (!isDokter) {
        HospitalView.errorView(new Error("Only dokter can find patient"));
        return;
      }

      Patient.findAll((err, data) => {
        if (err) {
          HospitalView.errorView(err);
          return;
        }

        if (obj === "id") {
          const id = data?.find((u) => u.id === Number(value));
          if (id) {
            HospitalView.findPatientBy(id);
          } else {
            HospitalView.errorView(new Error("Id not found"));
          }
          return;
        }

        if (obj === "name") {
          const name = data?.find((u) => u.name === value);
          if (name) {
            HospitalView.findPatientBy(name);
          } else {
            HospitalView.errorView(new Error("Name not found"));
          }
          return;
        }

        HospitalView.errorView(new Error("Unknown search field"));
      });
    });
  }

  public static help() {
    HospitalView.helpView();
  }
}

export default HospitalController;
