import axios from 'axios';

export type Review = {
   id: number;
   productId: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

export type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

export type SummarizeResponse = {
   summary: string;
};

export const reviewsApi = {
   fetchReviews(productId: number) {
      return axios
         .get<GetReviewsResponse>(`/api/products/${productId}/reviews`)
         .then((response) => response.data);
   },
   summarizeReviews(productId: number) {
      return axios
         .post<SummarizeResponse>(
            `/api/products/${productId}/reviews/summarize`
         )
         .then((response) => response.data);
   },
};
