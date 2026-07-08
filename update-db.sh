set -eux
npx prisma migrate reset
npx prisma db push
npx prisma generate
npx prisma db seed
