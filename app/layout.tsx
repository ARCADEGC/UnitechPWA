import type { Metadata, Viewport } from "next";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const APP_NAME = "Unitech";
const APP_DEFAULT_TITLE = "Unitech";
const APP_TITLE_TEMPLATE = "%s | Unitech";
const APP_DESCRIPTION = ""; // TODO : Add description

export const metadata: Metadata = {
    applicationName: APP_NAME,
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: APP_DEFAULT_TITLE,
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
    twitter: {
        card: "summary",
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
    },
};

export const viewport: Viewport = {
    themeColor: "#FFFFFF",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://api.fontshare.com/v2/css?f[]=satoshi@400,401,500,501,700,701,900,901,1,2&display=swap"
                    rel="stylesheet"
                ></link>
            </head>

            <body className="grid grid-cols-[[page-start]_minmax(var(--inline-padding),_1fr)_[content-start]_min(100%_-_var(--inline-padding)_*_2,_1400px)_[content-end]_minmax(var(--inline-padding),_1fr)_[page-end]] bg-background font-serif transition-colors [--inline-padding:_1rem]">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                >
                    {children}

                    <Toaster richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
