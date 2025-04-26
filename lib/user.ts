import  prisma  from "@/lib/prisma"

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  } catch (error) {
    console.error("Failed to get user:", error)
    return null
  }
}
