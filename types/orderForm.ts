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
    orderNumber: z.number().int(),
    ikeaNumber: z.number().int(),
});

export const formNewPCKSchema = z.object({
    shipmentZoneOne: z.string().optional(),
    shipmentZoneTwo: z.string().optional(),
    shipmentZoneThree: z.string().optional(),
    shipmentZoneFour: z.string().optional(),
    completeInstallationLockers: z.number().optional(),
    completeAtypical: z.number().optional(),
    basicLockers: z.number().optional(),
    basicMilled: z.number().optional(),
    basicAtypical: z.number().optional(),
    installationDigester: z.number().optional(),
    installationHob: z.number().optional(),
    installationGasHob: z.number().optional(),
    installationLights: z.number().optional(),
    installationMicrowave: z.number().optional(),
    installationFreezer: z.number().optional(),
    installationDishwasher: z.number().optional(),
    installationOven: z.number().optional(),
    installationFaucet: z.number().optional(),
    installationMilledJoint: z.number().optional(),
    installationWorktop: z.number().optional(),
    installationWallPanel: z.number().optional(),
    applianceOutsideOfIkea: z.number().optional(),
    gasApplianceOutsideOfIkea: z.number().optional(),
    tax: z.boolean().optional(),
    bail: z.number().optional(),
    signature: z.any().optional(),
});

export const formPP2Schema = z.object({
    anotherService: z.boolean().optional(),
    timeToFinish: z.string().optional(),
    contactWithIkea: z.boolean().optional(),
    numOfReturn: z.string().optional(),
    canceled: z.string().optional(),
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
});
