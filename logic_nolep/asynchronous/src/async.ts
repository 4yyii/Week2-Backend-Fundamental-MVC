interface User {
  id: number;
  username: string;
}

const users: User[] = [
  { id: 1, username: "john_doe" },
  { id: 2, username: "jane_smith" },
  { id: 3, username: "alice" },
];

// Simulasi latensi pengambilan data dari server
const SIMULATED_DELAY = 1000;

function findUser(userId: number): User | undefined {
  return users.find((u) => u.id === userId);
}

// Helper untuk mensimulasikan delay dengan Promise (dipakai oleh versi async/await)
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 1. Implementasi Callback
type UserCallback = (error: Error | null, user?: User) => void;

function getUserDataCallback(userId: number, callback: UserCallback): void {
  // Simulasi pengambilan data dari server
  setTimeout(() => {
    const user = findUser(userId);
    if (!user) {
      callback(new Error(`User with id ${userId} not found`));
      return;
    }
    callback(null, user);
  }, SIMULATED_DELAY);
}

// 2. Implementasi Promise
function getUserDataPromise(userId: number): Promise<User> {
  return new Promise((resolve, reject) => {
    // Simulasi pengambilan data dari server
    setTimeout(() => {
      const user = findUser(userId);
      if (!user) {
        reject(new Error(`User with id ${userId} not found`));
        return;
      }
      resolve(user);
    }, SIMULATED_DELAY);
  });
}

// 3. Implementasi Async/Await
async function getUserDataAsync(userId: number): Promise<User> {
  // Simulasi pengambilan data dari server
  await delay(SIMULATED_DELAY);

  const user = findUser(userId);
  if (!user) {
    throw new Error(`User with id ${userId} not found`);
  }
  return user;
}

// Test Case Callback
getUserDataCallback(1, (error, user) => {
  if (error) {
    console.error("Callback Error:", error.message);
    return;
  }
  console.log("Callback Result:", user);
  // Output: Callback Result: { id: 1, username: 'john_doe' }
});

// Test Case Promise
getUserDataPromise(2)
  .then((user) => {
    console.log("Promise Result:", user);
    // Output: Promise Result: { id: 2, username: 'jane_smith' }
  })
  .catch((error) => {
    console.error("Promise Error:", error);
  });

// Test Case Async/Await
(async () => {
  try {
    const user = await getUserDataAsync(3);
    console.log("Async/Await Result:", user);
    // Output: Async/Await Result: { id: 3, username: 'alice' }
  } catch (error) {
    console.error(
      "Async/Await Error:",
      error instanceof Error ? error.message : error,
    );
  }
})();
