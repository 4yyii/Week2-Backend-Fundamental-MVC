let crypto: any;
try {
  crypto = await import("node:crypto");
} catch (err) {
  console.error("crypto support is disabled!");
}

const algorithm: string = "aes-256-cbc";
const iv = crypto.randomBytes(16);

const generateKey = (key: string): string => {
  return crypto.createHash("sha256").update(key).digest();
};

const encrypt = (text: string, key: string): string => {
  const cipher = crypto.createCipheriv(algorithm, generateKey(key), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decrypt = (encryptedText: string, key: string): string => {
  const decipher = crypto.createDecipheriv(algorithm, generateKey(key), iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export { decrypt, encrypt };
