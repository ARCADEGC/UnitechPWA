"use client";

import { lazy, useState, useEffect, useCallback } from "react";
import { Suspense } from "react";

import {
    getOrderNewPCKByIdAndRoleOrUser,
    getOrderPP2ByIdAndRoleOrUser,
    getOrderList1ByIdAndRoleOrUser,
    getOrderPP2SpecificationsByIdAndRoleOrUser
} from "@/db/db";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/formTabs";

import { TOrderListOne, TOrderNewPCK, TOrderPP2, TOrderPP2Specifications } from "@/types/dbSchemas";

const PCK = lazy(() => import("@/app/dashboard/[id]/(forms)/PCK"));
const PP2 = lazy(() => import("@/app/dashboard/[id]/(forms)/PP2"));
const List1 = lazy(() => import("@/app/dashboard/[id]/(forms)/List1"));

type ClientTabsProps = {
    initialData: {
        pck: TOrderNewPCK | undefined;
        pp2: TOrderPP2 | undefined;
        list1: TOrderListOne | undefined;
        pp2Specs: TOrderPP2Specifications | undefined;
    };
    userRole: boolean;
    userId: string;
    orderId: string;
    orderPP2Id: string;
    orderListOneId: string;
    orderNewPCKId: string;
    referenceDate: Date;
    archived: boolean;
};

export default function ClientTabs({
    initialData,
    userRole,
    userId,
    orderId,
    orderPP2Id,
    orderListOneId,
    orderNewPCKId,
    referenceDate,
    archived
}: ClientTabsProps) {
    const [data, setData] = useState(initialData);
    const [currentTab, setCurrentTab] = useState("pck");
    const [isLoading, setIsLoading] = useState(false);

    const fetchDataForTab = useCallback(
        async (tab: string) => {
            setIsLoading(true);
            try {
                switch (tab) {
                    case "pck":
                        const pckData = await getOrderNewPCKByIdAndRoleOrUser(
                            orderNewPCKId,
                            userRole,
                            userId
                        );
                        if (pckData) setData((prev) => ({ ...prev, pck: pckData }));
                        break;

                    case "pp2":
                        const pp2Data = await getOrderPP2ByIdAndRoleOrUser(
                            orderPP2Id,
                            userRole,
                            userId
                        );
                        if (pp2Data) setData((prev) => ({ ...prev, pp2: pp2Data }));
                        break;

                    case "list1":
                        const [list1Data, pp2Specs] = await Promise.all([
                            getOrderList1ByIdAndRoleOrUser(orderListOneId, userRole, userId),
                            getOrderPP2SpecificationsByIdAndRoleOrUser(orderPP2Id, userRole, userId)
                        ]);
                        if (list1Data && pp2Specs) {
                            setData((prev) => ({
                                ...prev,
                                list1: list1Data,
                                pp2Specs
                            }));
                        }
                        break;
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [orderNewPCKId, orderPP2Id, orderListOneId, userRole, userId]
    );

    // Fetch data whenever tab changes
    useEffect(() => {
        fetchDataForTab(currentTab);
    }, [currentTab, fetchDataForTab]);

    return (
        <Tabs
            defaultValue="pck"
            className="mx-auto mt-8 w-full max-w-prose space-y-8"
            onValueChange={setCurrentTab}
        >
            <TabsList className="w-full *:w-full print:hidden">
                <TabsTrigger value="pck">PCK</TabsTrigger>
                <TabsTrigger value="pp2">PP 2</TabsTrigger>
                <TabsTrigger value="list1">List 1</TabsTrigger>
            </TabsList>

            <TabsContent value="pck">
                <Suspense fallback={<div>Načítání...</div>}>
                    {isLoading ?
                        <div>Načítání...</div>
                    : data.pck ?
                        <PCK
                            orderNewPCK={data.pck}
                            userRole={userRole}
                            referenceDate={referenceDate}
                            archived={archived}
                        />
                    :   <div>
                            Nastala chyba při načítání objednávky PCK. Zkuste to prosím znovu.
                        </div>
                    }
                </Suspense>
            </TabsContent>

            <TabsContent value="pp2">
                <Suspense fallback={<div>Načítání...</div>}>
                    {isLoading ?
                        <div>Načítání...</div>
                    : data.pp2 ?
                        <PP2
                            orderPP2={data.pp2}
                            userRole={userRole}
                            archived={archived}
                        />
                    :   <div>
                            Nastala chyba při načítání objednávky PP 2. Zkuste to prosím znovu.
                        </div>
                    }
                </Suspense>
            </TabsContent>

            <TabsContent value="list1">
                <Suspense fallback={<div>Načítání...</div>}>
                    {isLoading ?
                        <div>Načítání...</div>
                    : data.list1 && data.pp2Specs ?
                        <List1
                            orderList1={data.list1}
                            userRole={userRole}
                            referenceDate={referenceDate}
                            PP2Specifications={data.pp2Specs}
                            archived={archived}
                        />
                    :   <div>
                            Nastala chyba při načítání objednávky List 1. Zkuste to prosím znovu.
                        </div>
                    }
                </Suspense>
            </TabsContent>
        </Tabs>
    );
}
