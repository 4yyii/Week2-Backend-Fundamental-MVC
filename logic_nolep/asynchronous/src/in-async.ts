interface User {
    id: number;
    username: string;
}

type FetchCallback = (error: Error | null, data?: User) => void;

const users = [
    { id: 1, username: 'john_doe' },
    { id: 2, username: 'jane_smith' },
    { id: 3, username: 'alice' }
]

const getUserDataCallback = (userId: number, callback: FetchCallback) : void => {
    const user = users.find(u => u.id === userId);
    if (user) {
        callback(null, user);
    } else {
        callback(new Error('User not found'));
    }
}

const getUserDataPromise = (userId: number) : Promise<User> => {
    return new Promise((resolve, reject) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            resolve(user);
        } else {
            reject(new Error('User not found'));
        }
    });
}

const getUserDataAsync = async (userId: number) : Promise<User | undefined> => {
    try {
        const user = users.find(u => u.id === userId);
        if (user) {
            return user;
        } else {
            throw new Error('User not found');
        }
    } catch (err) {
        console.log(err);
    }
}

// Test Case Callback
getUserDataCallback(1, (err: Error | null, data: User | undefined) : void => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Callback Result:', data);
    // Output: Callback Result: { id: 1, username: 'john_doe' }
});

// Test Case Promise
getUserDataPromise(2)
    .then((user: User) => {
        console.log('Promise Result:', user);
        // Output: Promise Result: { id: 2, username: 'jane_smith' }
    })
    .catch((error) => {
        console.error(error);
    });

// Test Case Async/Await
(async () => {
    const user: User | undefined = await getUserDataAsync(3);
    console.log('Async/Await Result:', user);
    // Output: Async/Await Result: { id: 3, username: 'alice' }
})();