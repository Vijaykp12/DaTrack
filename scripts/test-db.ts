import { PrismaClient } from '@prisma/client';

const regions = [
  'ap-south-1',
  'us-east-1',
  'ap-southeast-1',
  'eu-central-1',
  'us-west-1',
  'eu-west-1',
  'sa-east-1',
];

async function main() {
  for (const r of regions) {
    for (const port of [5432, 6543]) {
      const url = `postgresql://postgres.kpsorcfjmrrcdwwkouhb:Vijay%40ssn1210@aws-0-${r}.pooler.supabase.com:${port}/postgres?sslmode=require&connect_timeout=4`;
      console.log(`Checking aws-0-${r}.pooler.supabase.com:${port}...`);
      const prisma = new PrismaClient({
        datasources: {
          db: { url },
        },
      });
      try {
        await prisma.$connect();
        console.log(`🎉 SUCCESS! Connected to Supabase at: aws-0-${r}.pooler.supabase.com:${port}`);
        await prisma.$disconnect();
        return;
      } catch (e: any) {
        console.log(`❌ Failed ${r}:${port} - ${e.message.split('\n')[0]}`);
      } finally {
        await prisma.$disconnect();
      }
    }
  }
}

main();
