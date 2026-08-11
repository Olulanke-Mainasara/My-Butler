"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMyReviewForProduct, getProductReviews } from "@/lib/fetches";
import { submitReview } from "@/lib/mutations";
import { supabase } from "@/lib/supabase/client";
import { reviewSchema } from "@/lib/schemas";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { Button } from "@/components/Shad-UI/button";
import { Textarea } from "@/components/Shad-UI/textarea";
import { cn, convertRawDateToReadableDate } from "@/lib/utils";

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="p-0.5"
        >
          <Star
            className={cn(
              "w-6 h-6 transition-colors",
              i < value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const queryClient = useQueryClient();
  const customerProfile = useCustomerProfile();

  const { data: reviews } = useQuery(getProductReviews(productId));
  const { data: myReview } = useQuery(
    getMyReviewForProduct(productId, customerProfile?.id || ""),
    { enabled: !!customerProfile }
  );

  const [rating, setRating] = useState(myReview?.rating || 0);
  const [reviewText, setReviewText] = useState(myReview?.review_text || "");
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: handleSubmit, isPending } = useMutation({
    mutationFn: () =>
      submitReview(supabase, {
        product_id: productId,
        user_id: customerProfile!.id,
        reviewer_name: customerProfile!.display_name || "Anonymous",
        rating,
        review_text: reviewText,
      }),
    onSuccess: () => {
      toast.success("Thanks for your review!");
      setIsEditing(false);
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey.includes("reviews"),
      });
    },
    onError: (error) => {
      toast.error("Failed to submit review. Please try again.");
      console.error(error);
    },
  });

  const onSubmit = () => {
    if (!customerProfile) {
      toast.info("You must be logged in to leave a review");
      return;
    }

    const result = reviewSchema.safeParse({
      rating,
      review_text: reviewText,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    handleSubmit();
  };

  const otherReviews = reviews?.filter((r) => r.id !== myReview?.id) || [];

  return (
    <div className="space-y-6">
      {customerProfile && (myReview && !isEditing ? (
        <div className="p-4 border rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < (myReview.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-500">Your review</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRating(myReview.rating || 0);
                setReviewText(myReview.review_text || "");
                setIsEditing(true);
              }}
            >
              Edit
            </Button>
          </div>
          {myReview.review_text && <p>{myReview.review_text}</p>}
        </div>
      ) : (
        <div className="p-4 border rounded-lg space-y-3">
          <h4 className="font-semibold">
            {myReview ? "Edit your review" : "Write a review"}
          </h4>
          <StarPicker value={rating} onChange={setRating} />
          <Textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this product..."
          />
          <div className="flex gap-2">
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
            {myReview && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      ))}

      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {otherReviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (review.rating || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500">
                  {review.reviewer_name}
                </span>
                {review.created_at && (
                  <span className="text-xs text-gray-400">
                    {convertRawDateToReadableDate(review.created_at)}
                  </span>
                )}
              </div>
              {review.review_text && <p>{review.review_text}</p>}
            </div>
          ))}
        </div>
      ) : (
        !myReview && <p>No reviews yet. Be the first to review!</p>
      )}
    </div>
  );
}
