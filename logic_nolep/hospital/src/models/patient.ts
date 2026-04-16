import * as fs from "node:fs";
import path from "node:path";
import { Employee } from "./employee.js";

const filePath = path.resolve("src", "db", "patient.json");
type callback = (err: Error | null, result?: Patient[]) => void;

export class Patient {
  public id: number;
  public name: string;
  public diseases: string[];

  private constructor(id: number, name: string, diseases: string[]) {
    this.id = id;
    this.name = name;
    this.diseases = diseases;
  }

  private static checkIsDokter(employee: Employee[]) {
    const isDokter = employee.find((u) => u.login === true);
    return isDokter?.position === "dokter";
  }

  public static findAll(cb: callback) {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        cb(err);
      } else {
        cb(null, JSON.parse(data));
      }
    });
  }

  public static saveAll(data: Patient[], cb: callback) {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        cb(err);
      } else {
        cb(null, data);
      }
    });
  }

  public static add(args: string[], cb: callback) {
    Employee.currentUser((err, data) => {
      if (err) {
        cb(err);
      } else {
        if (!this.checkIsDokter(data!)) {
          cb(new Error("Unauthorized"));
          return;
        }

        this.findAll((err, data) => {
          if (err) {
            cb(err);
          } else {
            const id = Number(args[0]);
            const name = String(args[1]);
            const diseases = args.slice(2);
            const dataPatient = data || [];

            const isPatientExists = data?.find((u) => u.id === id);
            if (isPatientExists) {
              console.error(`Patient with id ${id} already exists`);
              return;
            }

            const newPatient = new Patient(id, name, diseases);
            dataPatient.push(newPatient);
            this.saveAll(dataPatient, (err) => {
              if (err) {
                cb(err);
              } else {
                cb(null, dataPatient);
              }
            });
          }
        });
      }
    });
  }

  public static update(args: string[], cb: callback) {
    Employee.currentUser((err, data) => {
      if (err) {
        cb(err);
      } else {
        if (!this.checkIsDokter(data!)) {
          cb(new Error("Unauthorized"));
          return;
        }

        this.findAll((err, data) => {
          if (err) {
            cb(err);
          } else {
            const id = Number(args[0]);
            const name = String(args[1]);
            const diseases = args.slice(2);
            const dataPatient = data || [];

            const isPatientExists = data?.find((u) => u.id === id);
            if (!isPatientExists) {
              console.error(`Patient with id ${id} not found`);
              return;
            } else {
              isPatientExists.id = id;
              isPatientExists.name = name;
              isPatientExists.diseases = diseases;
            }

            this.saveAll(dataPatient, (err) => {
              if (err) {
                cb(err);
              } else {
                cb(null, dataPatient);
              }
            });
          }
        });
      }
    });
  }

  public static delete(args: string[], cb: callback) {
    Employee.currentUser((err, data) => {
      if (err) {
        cb(err);
      } else {
        if (!this.checkIsDokter(data!)) {
          cb(new Error("Unauthorized"));
          return;
        }

        this.findAll((err, data) => {
          if (err) {
            cb(err);
          } else {
            const id = Number(args[0]);
            const dataPatient = data || [];

            const isPatientExists = data?.find((u) => u.id === id);
            if (!isPatientExists) {
              console.error(`Patient with id ${id} not found`);
              return;
            }

            const deletePatient = dataPatient.filter((u) => u.id !== id);

            this.saveAll(deletePatient, (err) => {
              if (err) {
                cb(err);
              } else {
                cb(null, deletePatient);
              }
            });
          }
        });
      }
    });
  }
}
