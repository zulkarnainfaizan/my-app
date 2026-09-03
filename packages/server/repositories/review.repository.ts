import { PrismaClient, type Review } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      //SELECT * FROM reviews where productId = @productId ORDER BY createdAt DESC
      return await prisma.review.findMany({
         where: {
            productId,
         },
         orderBy: {
            createdAt: 'desc',
         },
         take: limit,
      });
   },

   storeReviewSummary(productId: number, summary: string) {
      const now = new Date();
      const expiresAt = dayjs().add(7, 'days').toDate(); // Set expiration time to 7 days from now
      const data = {
         content: summary,
         expiresAt,
         generatedAt: now,
         productId, // Set expiration time to 24 hours from now
      };
      return prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },

   async getReviewSummary(productId: number): Promise<string | null> {
      const summary = await prisma.summary.findFirst({
         where: {
            AND: [{ productId }, { expiresAt: { gt: new Date() } }],
         },
      });
      return summary ? summary.content : null;
   },
};
