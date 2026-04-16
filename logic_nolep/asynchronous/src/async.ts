interface User {
  id: number;
  username: string;
}

type cb = (err: Error | null, result?: User) => void;

const users: User[] = [
  { id: 1, username: "jhon_doe" },
  { id: 2, username: "jane_smith" },
  { id: 3, username: "alice" },
];

const getUserDataCallback = (userId: number, callback: cb) => {
  const user = users.find((u) => u.id === userId);
  if (user) {
    callback(null, user);
  } else {
    console.error(`User with id ${userId} not found`);
  }
};

const getUserDataPromise = (userId: number) => {
  return new Promise((resolve, reject) => {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      reject(new Error(`User with id ${userId} not found`));
    }
    resolve(user);
  });
};

const getUserDataAsync = async (userId: number) => {
  try {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      console.error("User not found");
    }
    return user;
  } catch (err) {
    throw err;
  }
};

// Test Case Callback
getUserDataCallback(1, (err, user) => {
  console.log("Callback Result:", user);
});

// Test Case Promise
getUserDataPromise(2)
  .then((user) => {
    console.log("Promise Result:", user);
  })
  .catch((error) => {
    console.error(error);
  });

// Test Case Async/Await
(async () => {
  const user = await getUserDataAsync(3);
  console.log("Async/Await Result:", user);
})();
