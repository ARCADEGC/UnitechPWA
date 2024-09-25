import { randomUUID } from "crypto";
import { genSalt, hash } from "bcryptjs";

import { createUser, seedAdminPrices, seedPrices } from "@/db/db";

type TUserSeed = {
    name: string;
    email: string;
    password: string;
    role?: boolean;
};

const prices = [
    { name: "shipment_zone_one", price: 450 },
    { name: "shipment_zone_two", price: 650 },
    { name: "shipment_zone_three", price: 1150 },
    { name: "shipment_zone_four", price: 1850 },

    { name: "complete_installation_lockers", price: 1650 },
    { name: "complete_atypical", price: 550 },

    { name: "basic_lockers", price: 1350 },
    { name: "basic_milled", price: 1100 },
    { name: "basic_atypical", price: 550 },

    { name: "installation_digester", price: 790 },
    { name: "installation_hob", price: 790 },
    { name: "installation_gas_hob", price: 1190 },
    { name: "installation_lights", price: 299 },
    { name: "installation_microwave", price: 790 },
    { name: "installation_freezer", price: 790 },
    { name: "installation_dishwasher", price: 790 },
    { name: "installation_oven", price: 790 },
    { name: "installation_sink", price: 790 },
    { name: "installation_milled_joint", price: 1100 },
    { name: "installation_worktop", price: 550 },
    { name: "installation_wall_panel", price: 550 },

    { name: "appliance_outside_of_ikea", price: 200 },
    { name: "gas_appliance_outside_of_ikea", price: 200 },

    { name: "upper_locker", price: 542 },
    { name: "lower_locker", price: 889 },
    { name: "high_locker", price: 1321 },
    { name: "milled_joint", price: 730 },
    { name: "worktop", price: 280 },
    { name: "tailored_worktop", price: 280 },
    { name: "wall_panel", price: 280 },
    { name: "atypical", price: 308 },
    { name: "unnecessary", price: 1150 },
    { name: "kitchen", price: 790 },

    { name: "lights", price: 146 },
    { name: "ikea", price: 480 },
    { name: "non_ikea", price: 580 },
    { name: "ikea_gas", price: 580 },
    { name: "non_ikea_gas", price: 146 },

    { name: "credit", price: 473 },
    { name: "aboveFifty", price: 18 },
];

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

async function seedUser() {
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
}

async function main() {
    // await seedUser();
    // await seedPrices(prices);
    // await seedAdminPrices(prices);
    process.exit();
}

main();
