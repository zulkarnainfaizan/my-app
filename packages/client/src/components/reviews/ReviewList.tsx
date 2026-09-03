import axios from 'axios';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';

import { HiMiniSparkles, HiSparkles } from 'react-icons/hi2';
import { useState } from 'react';
import ReviewSkeleton from './ReviewSkeleton';
import {
   reviewsApi,
   type GetReviewsResponse,
   type SummarizeResponse,
} from './reviewsApi';

type Props = {
   productId: number;
};

const ReviewList = ({ productId }: Props) => {
   const summaryMutation = useMutation<SummarizeResponse>({
      mutationFn: () => reviewsApi.summarizeReviews(productId),
   });

   const reviewsQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: async () => reviewsApi.fetchReviews(productId),
   });

   if (reviewsQuery.isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <div key={i}>
                  <ReviewSkeleton key={i} />
               </div>
            ))}
         </div>
      );
   }
   if (reviewsQuery.error) {
      return (
         <div className="text-red-500">
            {'Could not fetch reviews. Try again later.'}
         </div>
      );
   }

   if (!reviewsQuery.data?.reviews.length) {
      return null;
   }
   const currentSummary =
      reviewsQuery.data?.summary || summaryMutation.data?.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summaryMutation.isPending}
                  >
                     <HiSparkles /> Summarize
                  </Button>
                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
               </div>
            )}
            {summaryMutation.isError && (
               <p className="text-red-500">Failed to summarize reviews.</p>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsQuery.data?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating rating={review.rating} />
                  </div>
                  <p className="py-2">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
