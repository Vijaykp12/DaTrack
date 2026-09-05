import { PrismaClient } from '@prisma/client';

const allRegions = [
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-north-1',
  'ca-central-1',
  'sa-east-1',
];

async function main() {
  const ref = 'kpsorcfjmrrcdwwkouhb';
  const pass = 'Vijay%40ssn1210';

  for (const r of allRegions) {
    for (const port of [5432, 6543]) {
      const url = `postgresql://postgres.${ref}:${pass}@aws-0-${r}.pooler.supabase.com:${port}/postgres?sslmode=require&connect_timeout=4`;
      const prisma = new PrismaClient({ datasources: { db: { url } } });
      try {
        await prisma.$connect();
        console.log(`🎉 SUCCESS! Region: ${r}, Port: ${port}`);
        console.log(`Working URL: postgresql://postgres.${ref}:[YOUR_PASSWORD]@aws-0-${r}.pooler.supabase.com:${port}/postgres?pgbouncer=true`);
        await prisma.$disconnect();
        return;
      } catch (e: any) {
        const msg = e.message.split('\n')[0];
        if (!msg.includes("Can't reach database server") && !msg.includes("tenant/user")) {
          console.log(`⚠️ Interesting response from ${r}:${port} -> ${msg}`);
        }
      } finally {
        await prisma.$disconnect();
      }
    }
  }
  console.log('Finished testing all regions.');
}

main();

