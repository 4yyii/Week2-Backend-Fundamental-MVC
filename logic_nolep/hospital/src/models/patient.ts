import * as fs from "node:fs";
import path from "node:path";
import Employee from "./employee.js";

interface IPatient {
  id: number;
  name: string;
  diseases: string[];
}

type FetchCallback = (error: Error | null, data?: IPatient[]) => void;
const dbPatient = path.resolve("src", "db", "patient.json");

class Patient {
  constructor(
    public id: number,
    public name: string,
    public diseases: string[],
  ) {
    this.id = id;
    this.name = name;
    this.diseases = diseases;
  }

  public static findAll(cb: FetchCallback) {
    fs.readFile(dbPatient, "utf8", (err, data) => {
      if (err) {
        return cb(err);
      }

      try {
        const patients = data ? JSON.parse(data) : [];
        cb(err, patients);
      } catch (err) {
        cb(err as Error);
      }
    });
  }

  public static saveAll(data: IPatient[], cb: FetchCallback) {
    fs.writeFile(dbPatient, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        return cb(err);
      } else {
        cb(err, data);
      }
    });
  }

  private static ensureDokter(cb: (error: Error | null) => void) {
    Employee.currentUser((err, data) => {
      if (err) {
        return cb(err);
      }

      const isDokter = data?.find(
        (u) => u.login === true && u.position === "dokter",
      );

      if (!isDokter) {
        return cb(new Error("Only dokter are allowed to manage patients"));
      }

      cb(null);
    });
  }

  public static add(
    id: number,
    name: string,
    diseases: string[],
    cb: FetchCallback,
  ) {
    this.ensureDokter((err) => {
      if (err) {
        return cb(err);
      }

      this.findAll((err, data) => {
        if (err) {
          return cb(err);
        }

        data = data ?? [];
        const idExists = data.find((u) => u.id === id);
        if (idExists) {
          return cb(new Error("ID already exists"));
        }

        const newPatient = new Patient(id, name, diseases);
        data.push(newPatient);

        this.saveAll(data, (err) => {
          if (err) {
            return cb(err);
          } else {
            cb(err, data);
          }
        });
      });
    });
  }

  public static update(
    id: number,
    name: string,
    diseases: string[],
    cb: FetchCallback,
  ) {
    this.ensureDokter((err) => {
      if (err) {
        return cb(err);
      }

      this.findAll((err, data) => {
        if (err) {
          return cb(err);
        }

        const isMatch = data?.find((u) => u.id === id);
        if (!isMatch) {
          return cb(new Error("ID not found"));
        }

        isMatch.name = name;
        isMatch.diseases = diseases;

        this.saveAll(data!, (err) => {
          if (err) {
            return cb(err);
          } else {
            cb(err, data);
          }
        });
      });
    });
  }

  public static delete(id: number, cb: FetchCallback) {
    this.ensureDokter((err) => {
      if (err) {
        return cb(err);
      }

      this.findAll((err, data) => {
        if (err) {
          return cb(err);
        }

        const isMatch = data?.find((u) => u.id === id);
        if (!isMatch) {
          return cb(new Error("Id not found"));
        }

        const remove = data?.filter((u) => u.id !== id);

        this.saveAll(remove!, (err) => {
          if (err) {
            return cb(err);
          } else {
            cb(err, data);
          }
        });
      });
    });
  }
}

export default Patient;
