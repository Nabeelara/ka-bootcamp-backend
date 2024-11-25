import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard E-Commerce",
    description: "This is the description of this web page...",
};

export const revalidate = 0

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DefaultLayout>{children}</DefaultLayout>;
}