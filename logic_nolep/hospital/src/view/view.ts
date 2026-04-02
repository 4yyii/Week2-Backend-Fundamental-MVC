import type { Employee } from "../models/employee.js"
import type { Patient } from "../models/patient.js";

export class HospitalView {
    public static errorView(msg: string): void {
        console.error(msg)
    }

    public static registerView(user: Employee[]): void {
        const data = user[user.length - 1];
        console.log(`Register success. username: ${data?.username} | role: ${data?.position}. Total Employee: ${user.length}`);
    }

    public static loginView(user: Employee[]): void {
        const login = user.find(u => u.login === true)
        if (login) {
            console.log(`Login success. Welcome ${login.username} (${login.position})`)
        }
    }

    public static logoutView(): void {
        console.log('Logout success');
    }

    public static addPatientView(patient: Patient[]): void {
        const data = patient[patient.length - 1];
        console.log(`Patient added: ${data?.username}`);
    }

    public static updatePatientView(patient: Patient[]): void {
        const updated = patient[0];
        if (updated) {
            console.log(`Patient updated: ${updated.username} with id ${updated.id}`);
        }
    }

    public static deletePatientView(id: number): void {
        console.log(`Patient deleted with id ${id}`)
    }

    public static showEmployeeView(employee: Employee[]): void {
        console.table(employee);
    }

    public static showPatientView(patient: Patient[]): void {
        console.table(patient);
    }

    public static findPatientView(patient: Patient[]): void {
        console.table(patient);
    }
}