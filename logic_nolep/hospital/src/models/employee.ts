import * as fs from "node:fs";
import path from "node:path";

const filePath = path.resolve("src", "db", "employee.json");
type callback = (err: Error | null, result?: Employee[]) => void;

export class Employee {
  public username: string;
  public password: string;
  public position: string;
  public login: boolean;

  private constructor(username: string, password: string, position: string) {
    this.username = username;
    this.password = password;
    this.position = position;
    this.login = false;
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

  public static saveAll(data: Employee[], cb: callback) {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        cb(err);
      } else {
        cb(null, data);
      }
    });
  }

  public static register(
    name: string,
    password: string,
    role: string,
    cb: callback,
  ) {
    const allowedRoles: string[] = ["dokter", "admin"];
    this.findAll((err, data) => {
      if (err) {
        cb(err);
      } else {
        if (!allowedRoles.includes(role)) {
          console.error("Role not match, choose (dokter/admin)!");
          return;
        }
        const dataEmployee = data || [];
        const newEmployee = new Employee(name, password, role);
        dataEmployee.push(newEmployee);
        this.saveAll(dataEmployee, (err) => {
          if (err) {
            cb(err);
          } else {
            cb(null, dataEmployee);
          }
        });
      }
    });
  }

  public static login(username: string, password: string, cb: callback) {
    this.findAll((err, data) => {
      if (err) {
        cb(err);
      } else {
        const dataEmployee = data || [];

        const isLogin = data?.find((u) => u.login === true);
        if (isLogin) {
          console.error("Can not logged in together!");
          return;
        }

        const employeeLogin = data?.find(
          (u) => u.username === username && u.password === password,
        );
        if (!employeeLogin) {
          console.error("Wrong username or password!");
          return;
        }

        employeeLogin.login = true;

        this.saveAll(dataEmployee, (err) => {
          if (err) {
            cb(err);
          } else {
            cb(null, dataEmployee);
          }
        });
      }
    });
  }

  public static logout(cb: callback) {
    this.findAll((err, data) => {
      if (err) {
        cb(err);
      } else {
        const dataEmployee = data || [];

        const isLogin = data?.find((u) => u.login === true);
        if (!isLogin) {
          console.error("No one logged in!");
          return;
        } else {
          isLogin.login = false;
        }

        this.saveAll(dataEmployee, (err) => {
          if (err) {
            cb(err);
          } else {
            cb(null, dataEmployee);
          }
        });
      }
    });
  }

  public static currentUser(cb: callback) {
    this.findAll((err, data) => {
      if (err) {
        return cb(err);
      } else {
        const dataEmployee = data || [];
        const employee = data?.find((u) => u.login === true);
        if (!employee) {
          console.error("You must login first!");
          return;
        }
        cb(null, dataEmployee);
      }
    });
  }
}
