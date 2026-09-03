import axios from 'axios';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';

import { HiMiniSparkles, HiSparkles } from 'react-icons/hi2';
import { useState } from 'react';
import ReviewSkeleton from './ReviewSkeleton';

type Props = {
   productId: number;
};

type Review = {
   id: number;
   productId: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

type SummarizeResponse = {
   summary: string;
};

const ReviewList = ({ productId }: Props) => {
   const [summary, setSummary] = useState('');
   const [isSummaryLoading, setIsSummaryLoading] = useState(false);
   const [summaryError, setSummaryError] = useState('');

   const {
      data: reviewsData,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: async () => fetchReviews(),
   });

   const handleSummarize = async () => {
      try {
         const { data } = await axios.post<SummarizeResponse>(
            `/api/products/${productId}/reviews/summarize`
         );

         setSummary(data.summary);
      } catch (error) {
         console.error('Error summarizing reviews:', error);
         setSummaryError('Could not summarize the reviews. Please try again.');
      } finally {
         setIsSummaryLoading(false);
      }
   };

   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   if (isLoading) {
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
   if (error) {
      return (
         <div className="text-red-500">
            {'Could not fetch reviews. Try again later.'}
         </div>
      );
   }

   if (!reviewsData?.reviews.length) {
      return null;
   }
   const currentSummary = reviewsData?.summary || summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={handleSummarize}
                     className="cursor-pointer"
                     disabled={isSummaryLoading}
                  >
                     <HiSparkles /> Summarize
                  </Button>
                  {isSummaryLoading && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
               </div>
            )}
            {summaryError && <p className="text-red-500">{summaryError}</p>}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsData?.reviews.map((review) => (
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
