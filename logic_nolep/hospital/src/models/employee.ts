import fs from 'node:fs';
import path from 'node:path';

type FetchCallback = (error: Error | null, data?: Employee[]) => void;
const filePath = path.resolve(process.cwd(), 'src', 'db', 'employee.json');

export class Employee {
    public username: string;
    public password: string;
    public position: string;
    public login: boolean;

    public constructor(username: string, password: string, position: string) {
        this.username = username;
        this.password = password;
        this.position = position;
        this.login = false;
    }

    public static findAll(cb: FetchCallback): void {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return cb(err);
            }

            try {
                cb(null, JSON.parse(data));
            } catch (error) {
                cb(new Error('File corrupt or invalid JSON format'));
            }
        });
    }

    public static saveAll(data: Employee[], cb: FetchCallback): void {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                return cb(err);
            }
            cb(null, data);
        });
    }

    public static register(username: string, password: string, role: string, cb: FetchCallback): void {
        const allowedRoles: string[] = ['admin', 'dokter'];
        if (!allowedRoles.includes(role)) {
            return cb(new Error('Choose one of them (admin/dokter)'));
        }
        
        this.findAll((err, data) => {
            if (err) {
                return cb(err);
            }

            const employeesData: Employee[] = data || [];
            const user = employeesData.find(u => u.username === username);

            if (user) {
                return cb(new Error('Username already taken!'));
            }

            const newEmployee: Employee = new Employee(username, password, role);
            employeesData.push(newEmployee);

            this.saveAll(employeesData, (err) => {
                if (err) {
                    return cb(err);
                }
                cb(null, employeesData)
            });
        });
    }

    public static login(username: string, password: string, cb: FetchCallback): void {
        this.findAll((err, data) => {
            if (err) {
                return cb(err);
            }

            const employeesData: Employee[] = data || [];
            const user = employeesData.find(u => u.username === username && u.password === password);

            if (!user) {
                return cb(new Error('Username or password invalid!'));
            }

            const isLogin = employeesData.find(u => u.login === true);
            
            if (isLogin) {
                return cb(new Error('Cannot login together!'));
            }

            user.login = true;

            this.saveAll(employeesData, (err) => {
                if (err) {
                    return cb(err);
                }
                cb(null, employeesData);
            });
        });
    }

    public static logout(cb: FetchCallback): void {
        this.findAll((err, data) => {
            if (err) {
                return cb(err);
            }

            const employeesData: Employee[] = data || [];
            const user = employeesData.find(u => u.login === true);

            if (!user) {
                return cb(new Error('No one logged in!'));
            }

            user.login = false;

            this.saveAll(employeesData, (err) => {
                if (err) {
                    return cb(err);
                }
                cb(null, employeesData);
            });
        });
    }

    public static getCurrentUser(cb: FetchCallback): void {
        this.findAll((err, data) => {
            if (err) {
                return cb(err);
            }

            const employeesData: Employee[] = data || [];
            const user = employeesData.find(u => u.login === true);

            if (!user) {
                return cb(new Error('Must login first!'));
            }
        
            cb(null, employeesData)
        })
    }
}