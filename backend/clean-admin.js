require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanAdminBiodata() {
  try {
    const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
    
    for (const admin of admins) {
      await prisma.biodata.deleteMany({
        where: { userId: admin.id }
      });
      console.log(`Deleted biodata for admin ${admin.email}`);
    }
    
    console.log("Cleanup finished.");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanAdminBiodata();
