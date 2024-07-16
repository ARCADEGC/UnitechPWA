import { randomUUID } from "crypto";
import { genSalt, hash } from "bcryptjs";

import { createUser } from "@/db/db";

// const baseUser = {
//     name: "user",
//     email: "user@email.com",
//     password: "password",
// };

// const baseAdmin = {
//     name: "admin",
//     email: "admin@email.com",
//     password: "password",
//     role: true,
// };

const newUser = {
    name: "user",
    email: "user@email.com",
    password: "password",
};

async function main() {
    const salt = await genSalt();
    const passwordHash = await hash(newUser.password, salt);

    const hashedPassword = await hash(passwordHash, 10);
    const userId = randomUUID();

    await createUser({
        id: userId,
        name: newUser.name,
        email: newUser.email,
        password: hashedPassword,
        salt: salt,
    });

    process.exit();
}

main();
