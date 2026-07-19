import * as fs from "node:fs";
import path from "node:path";

interface IEmployee {
  username: string;
  password: string;
  position: string;
  login: boolean;
}

type FetchCallback = (error: Error | null, data?: IEmployee[]) => void;
const dbEmployee = path.resolve("src", "db", "employee.json");

class Employee {
  public login: boolean;

  public constructor(
    public username: string,
    public password: string,
    public position: string,
  ) {
    this.username = username;
    this.password = password;
    this.position = position;
    this.login = false;
  }

  public static findAll(cb: FetchCallback) {
    fs.readFile(dbEmployee, "utf8", (err, data) => {
      if (err) {
        return cb(err);
      }

      try {
        const employees = data ? JSON.parse(data) : [];
        cb(err, employees);
      } catch (err) {
        cb(err as Error);
      }
    });
  }

  public static saveAll(data: IEmployee[], cb: FetchCallback) {
    fs.writeFile(dbEmployee, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        return cb(err);
      } else {
        cb(err, data);
      }
    });
  }

  public static register(
    name: string,
    password: string,
    role: string,
    cb: FetchCallback,
  ) {
    const roles: string[] = ["dokter", "admin"];
    if (!roles.includes(role)) {
      return cb(new Error("Invalid role"));
    }
    this.findAll((err, data) => {
      if (err) {
        return cb(err);
      }

      data = data ?? [];
      const isUserExists = data.find((u) => u.username === name);
      if (isUserExists) {
        return cb(new Error("Username already exists"));
      }

      const newEmployee = new Employee(name, password, role);
      data.push(newEmployee);

      this.saveAll(data, (err) => {
        if (err) {
          return cb(err);
        } else {
          cb(err, [newEmployee]);
        }
      });
    });
  }

  public static login(name: string, password: string, cb: FetchCallback) {
    this.findAll((err, data) => {
      if (err) {
        return cb(err);
      }

      const isLogin = data?.find((u) => u.login === true);
      if (isLogin) {
        return cb(new Error("Cannot login at the same time"));
      }

      const employeeLogin = data?.find(
        (u) => u.username === name && u.password === password,
      );
      if (!employeeLogin) {
        return cb(new Error("Username or password invalid"));
      }
      employeeLogin.login = true;

      this.saveAll(data!, (err) => {
        if (err) {
          return cb(err);
        } else {
          cb(err, [employeeLogin]);
        }
      });
    });
  }

  public static logout(cb: FetchCallback) {
    this.findAll((err, data) => {
      if (err) {
        return cb(err);
      }

      const isLogout = data?.find((u) => u.login === true);
      if (!isLogout) {
        return cb(new Error("No one has logged in yet"));
      }

      isLogout.login = false;

      this.saveAll(data!, (err) => {
        if (err) {
          return cb(err);
        } else {
          cb(err, data);
        }
      });
    });
  }

  public static currentUser(cb: FetchCallback) {
    this.findAll((err, data) => {
      if (err) {
        return cb(err);
      }

      const isLogin = data?.find((u) => u.login === true);
      if (!isLogin) {
        return cb(new Error("You must login first"));
      }

      cb(null, data);
    });
  }
}

export default Employee;
