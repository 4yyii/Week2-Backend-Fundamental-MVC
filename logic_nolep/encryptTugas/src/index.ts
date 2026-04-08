import { decrypt, encrypt } from "./cryptoApp.js";
import scheduleTask from "./scheduleApp.js";

console.log("--- Testing cryptoApp ---");

const key: string = "mysecretkey";

// encrypt test
const encryptedText = encrypt("Hello, World!", key);
console.log("Encrypted Text:", encryptedText);

// decrypt test
const decryptedText = decrypt(encryptedText, key);
console.log("Decrypted Text:", decryptedText);

console.log("--- Testing scheduleApp ---");

// schedule test
scheduleTask("War");
