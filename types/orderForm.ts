import { date } from "drizzle-orm/pg-core";
import { update } from "lodash";
import { z } from "zod";

export const formHeaderSchema = z.object({
    customer: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    address: z.string().min(3, {
        message: "Address must be at least 5 characters.",
    }),
    phone: z.string().min(9, {
        message: "Phone must be at least 9 characters.",
    }),
    // email: z.string().email({
    //     message: "Invalid email address.",
    // }),
    email: z.string(),
    assignee: z.string(),
    dueDate: z.date(),
    orderNumber: z.string(),
    ikeaNumber: z.string(),
});

export const formNewPCKSchema = z.object({
    // TODO: Should be a number
    shipmentZoneOne: z.string().optional(),
    shipmentZoneTwo: z.string().optional(),
    shipmentZoneThree: z.string().optional(),
    shipmentZoneFour: z.string().optional(),
    completeInstallationLockers: z.string().optional(),
    completeAtypical: z.string().optional(),
    basicLockers: z.string().optional(),
    basicMilled: z.string().optional(),
    basicAtypical: z.string().optional(),
    installationDigester: z.string().optional(),
    installationHob: z.string().optional(),
    installationGasHob: z.string().optional(),
    installationLights: z.string().optional(),
    installationMicrowave: z.string().optional(),
    installationFreezer: z.string().optional(),
    installationDishwasher: z.string().optional(),
    installationOven: z.string().optional(),
    installationFaucet: z.string().optional(),
    installationMilledJoint: z.string().optional(),
    installationWorktop: z.string().optional(),
    installationWallPanel: z.string().optional(),
    applianceOutsideOfIkea: z.string().optional(),
    gasApplianceOutsideOfIkea: z.string().optional(),
    tax: z.boolean().optional(),
    bail: z.string().optional(),
    signature: z.any().optional(),
});

export const formPP2Schema = z.object({
    anotherService: z.boolean().optional(),
    timeToFinish: z.number().optional(),
    contactWithIkea: z.boolean().optional(),
    numOfReturn: z.number().optional(),
    canceled: z.enum(["yes", "no", "canceled"]),
    reasonOfCancelation: z.string().optional(),
    reasonOfImposibility: z.string().optional(),
    waterConnection: z.boolean().optional(),
    couplingsAndKitchenAdjustment: z.boolean().optional(),
    testDishwasherFaucet: z.boolean().optional(),
    viewCutsOk: z.boolean().optional(),
    electricalAppliancesPluggedIn: z.boolean().optional(),
    cleaningOfKitchenInstallationArea: z.boolean().optional(),
    electricalTestAppliances: z.boolean().optional(),
    previousDamageToApartment: z.boolean().optional(),
    sealingOfWorktops: z.boolean().optional(),
    damageToFlatDuringInstallation: z.boolean().optional(),
    comment: z.string().optional(),

    upperLocker: z.string().optional(),
    lowerLocker: z.string().optional(),
    highLocker: z.string().optional(),
    milledJoint: z.string().optional(),
    worktop: z.string().optional(),
    tailoredWorktop: z.string().optional(),
    wallPanel: z.string().optional(),
    atypical: z.string().optional(),
    unnecessary: z.string().optional(),
    kitchen: z.string().optional(),
    lights: z.string().optional(),
    ikea: z.string().optional(),
    nonIkea: z.string().optional(),
    ikeaGas: z.string().optional(),
    nonIkeaGas: z.string().optional(),

    date: z.date(),
    workerSignature: z.any().optional(),
    custommerSignature: z.any().optional(),
});