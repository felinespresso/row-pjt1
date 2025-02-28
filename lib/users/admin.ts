"use server";

import prisma from "../prisma";

export async function addAdmins(selectedAdmins: string[]) {
    try {
        await prisma.user.updateMany({
            where: { id: { in: selectedAdmins } },
            data: { role: "admin" },
        });
        return { success: true, message: "Admins added successfully" };
    } catch (error) {
        console.error("Error adding admins:", error);
        return { success: false, message: "Failed to add admins" };
    }
}