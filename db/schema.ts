import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    json,
    numeric,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const order = pgTable("order", {
    id: uuid("id").unique().notNull().defaultRandom().primaryKey(),
    referenceDate: timestamp("reference_date").notNull().default(new Date()),
    archived: boolean("archived").default(false),

    orderHeader: uuid("order_header")
        .notNull()
        .references(() => OrderHeader.id),
    orderNewPCK: uuid("order_new_pck")
        .notNull()
        .references(() => OrderNewPCK.id),
    orderPP2: uuid("order_pp2")
        .notNull()
        .references(() => OrderPP2.id),
    orderListOne: uuid("order_list_one")
        .notNull()
        .references(() => OrderListOne.id),
});

export const OrderHeader = pgTable("order_header", {
    id: uuid("id").unique().notNull().defaultRandom().primaryKey(),

    customer: text("customer").notNull(),
    address: text("address").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),

    assignee: uuid("assignee")
        .notNull()
        .references(() => User.id, {
            onDelete: "cascade",
            onUpdate: "restrict",
        }),

    dueDate: timestamp("due_date").notNull(),
    orderNumber: integer("order_number_part_one").notNull(),
    ikeaNumber: integer("order_number_part_two").notNull(),
});

export const OrderNewPCK = pgTable("order_new_pck", {
    id: uuid("id").unique().notNull().defaultRandom().primaryKey(),

    shipmentZoneOne: numeric("shipment_zone_one", { precision: 10, scale: 2 }),
    shipmentZoneTwo: numeric("shipment_zone_two", { precision: 10, scale: 2 }),
    shipmentZoneThree: numeric("shipment_zone_three", { precision: 10, scale: 2 }),
    shipmentZoneFour: numeric("shipment_zone_four", { precision: 10, scale: 2 }),

    completeInstallationLockers: numeric("complete_installation_lockers", {
        precision: 10,
        scale: 2,
    }),
    completeAtypical: numeric("complete_atypical", { precision: 10, scale: 2 }),

    basicLockers: numeric("basic_lockers", { precision: 10, scale: 2 }),
    basicMilled: numeric("basic_milled", { precision: 10, scale: 2 }),
    basicAtypical: numeric("basic_atypical", { precision: 10, scale: 2 }),

    installationDigester: numeric("installation_digester", { precision: 10, scale: 2 }),
    installationHob: numeric("installation_hob", { precision: 10, scale: 2 }),
    installationGasHob: numeric("installation_gas_hob", { precision: 10, scale: 2 }),
    installationLights: numeric("installation_lights", { precision: 10, scale: 2 }),
    installationMicrowave: numeric("installation_microwave", { precision: 10, scale: 2 }),
    installationFreezer: numeric("installation_freezer", { precision: 10, scale: 2 }),
    installationDishwasher: numeric("installation_dishwasher", { precision: 10, scale: 2 }),
    installationOven: numeric("installation_oven", { precision: 10, scale: 2 }),
    installationFaucet: numeric("installation_faucet", { precision: 10, scale: 2 }),
    installationMilledJoint: numeric("installation_milled_joint", { precision: 10, scale: 2 }),
    installationWorktop: numeric("installation_worktop", { precision: 10, scale: 2 }),
    installationWallPanel: numeric("installation_wall_panel", { precision: 10, scale: 2 }),

    applianceOutsideOfIkea: numeric("appliance_outside_of_ikea", { precision: 10, scale: 2 }),
    gasApplianceOutsideOfIkea: numeric("gas_appliance_outside_of_ikea", {
        precision: 10,
        scale: 2,
    }),

    tax: boolean("tax").default(false),

    bail: numeric("bail"),
    signature: json("signature"),
});

export const finishedEnum = pgEnum("finished", ["no", "yes", "canceled"]);

export const OrderPP2 = pgTable("order_pp2", {
    id: uuid("id").unique().notNull().defaultRandom().primaryKey(),

    anotherService: boolean("another_service").default(false),
    timeToFinish: numeric("time_to_finish", { precision: 10, scale: 2 }),

    contactWithIkea: boolean("contact_with_ikea").default(false),
    numOfReturn: numeric("num_of_returns", { precision: 10, scale: 2 }),

    finished: finishedEnum("finished").default("no"),
    reasonOfCancelation: text("reason_of_cancelation"),
    reasonOfImposibility: text("reason_of_imposibility"),

    waterConnection: boolean("water_connection_made"),
    couplingsAndKitchenAdjustment: boolean("couplings_and_kitchen_adjustment"),
    testDishwasherFaucet: boolean("test_dishwasher_faucet"),
    viewCutsOk: boolean("view_cuts_ok"),
    electricalAppliancesPluggedIn: boolean("electrical_appliances_plugged_in"),
    cleaningOfKitchenInstallationArea: boolean("cleaning_of_kitchen_and_installation_area"),
    electricalTestAppliances: boolean("electrical_test_appliances"),
    previousDamageToApartment: boolean("previous_damage_to_the_apartment"),
    sealingOfWorktops: boolean("sealing_of_worktops"),
    damageToFlatDuringInstallation: boolean("damage_to_flat_during_installation"),

    comment: text("comment"),

    upperLocker: numeric("upper_locker", { precision: 10, scale: 2 }),
    lowerLocker: numeric("lower_locker", { precision: 10, scale: 2 }),
    highLocker: numeric("high_locker", { precision: 10, scale: 2 }),
    milledJoint: numeric("milled_joint", { precision: 10, scale: 2 }),
    worktop: numeric("worktop", { precision: 10, scale: 2 }),
    tailoredWorktop: numeric("tailored_worktop", { precision: 10, scale: 2 }),
    wallPanel: numeric("wall_panel", { precision: 10, scale: 2 }),
    atypical: numeric("atypical", { precision: 10, scale: 2 }),
    unnecessary: numeric("unnecessary", { precision: 10, scale: 2 }),
    kitchen: numeric("kitchen", { precision: 10, scale: 2 }),

    lights: numeric("lights", { precision: 10, scale: 2 }),
    ikea: numeric("ikea", { precision: 10, scale: 2 }),
    nonIkea: numeric("non_ikea", { precision: 10, scale: 2 }),
    ikeaGas: numeric("ikea_gas", { precision: 10, scale: 2 }),
    nonIkeaGas: numeric("non_ikea_gas", { precision: 10, scale: 2 }),

    date: timestamp("date").notNull(),
    workerSignature: json("worker_signature"),
    custommerSignature: json("custommer_signature"),
});

export const OrderListOne = pgTable("order_list_one", {
    id: uuid("id").unique().notNull().defaultRandom().primaryKey(),

    credit: numeric("credit", { precision: 10, scale: 2 }),
    aboveFifty: numeric("above_fifty", { precision: 10, scale: 2 }),

    material: numeric("material", { precision: 10, scale: 2 }),
});

export const User = pgTable("user", {
    id: uuid("id").unique().notNull().primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    salt: text("salt").unique().notNull(),
    role: boolean("role").default(false),
});

export const Session = pgTable("session", {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => User.id, {
            onDelete: "cascade",
            onUpdate: "restrict",
        }),
    expiresAt: timestamp("expiresAt", {
        mode: "date",
        withTimezone: true,
    }).notNull(),
});

export const Prices = pgTable("prices", {
    id: serial("id").unique().notNull().primaryKey(),
    name: text("name").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    validFrom: timestamp("valid_from").notNull(),
});

export const AdminPrices = pgTable("admin_prices", {
    id: serial("id").unique().notNull().primaryKey(),
    name: text("name").notNull(),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    validFrom: timestamp("valid_from").notNull(),
});

export const orderRelations = relations(order, ({ one }) => ({
    orderHeader: one(OrderHeader, {
        fields: [order.orderHeader],
        references: [OrderHeader.id],
    }),
    orderNewPCK: one(OrderNewPCK, {
        fields: [order.orderNewPCK],
        references: [OrderNewPCK.id],
    }),
    orderPP2: one(OrderPP2, {
        fields: [order.orderPP2],
        references: [OrderPP2.id],
    }),
    orderListOne: one(OrderListOne, {
        fields: [order.orderListOne],
        references: [OrderListOne.id],
    }),
}));

export const orderHeaderRelations = relations(OrderHeader, ({ one }) => ({
    orders: one(order),
}));

export const orderNewPCKRelations = relations(OrderNewPCK, ({ one }) => ({
    orders: one(order),
}));

export const orderPP2Relations = relations(OrderPP2, ({ one }) => ({
    orders: one(order),
}));

export const orderListOneRelations = relations(OrderListOne, ({ one }) => ({
    orders: one(order),
}));
