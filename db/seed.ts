import { randomUUID } from "crypto";
import { genSalt, hash } from "bcryptjs";

import { createUser } from "@/db/db";

type TUserSeed = {
    name: string;
    email: string;
    password: string;
    role?: boolean;
};

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

const newUser: TUserSeed = {
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
        role: newUser?.role ?? false,
    });

    process.exit();
}

main();
