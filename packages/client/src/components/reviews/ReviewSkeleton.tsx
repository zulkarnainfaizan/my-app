import React from 'react';
import Skeleton from 'react-loading-skeleton';

const ReviewSkeleton = () => {
   return (
      <div>
         <Skeleton width={150} height={20} />
         <Skeleton width={100} height={20} />
         <Skeleton count={2} />
      </div>
   );
};

export default ReviewSkeleton;
