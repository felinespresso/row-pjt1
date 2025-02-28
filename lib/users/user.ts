import prisma from "@/lib/prisma";

export const getUserById = async (id:string) => {
    try {
        const user = await prisma.user.findUnique({
        where: {
            id
        }
    }); 
    return user;
    } catch (error) {
        return null;
    }
};

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        return user;
    } catch (error) {
        return null;
    }
}

export const getUserByUsername = async (username: string) => {
    try {
        const user = await prisma.user.findFirst({
            where: {username}
        });
        return user;
    } catch (error) {
        return null;
    }
}

export const getUsers = async () => {
    try {
        const user = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                image: true,
            },
        });
        console.log("Users from database:", user); // <-- Debugging
        return user;
    } catch (error) {
        console.error("Error fetching users:", error);
        return null;
    }
}