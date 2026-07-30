"use client";

import { usePathname } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { toast } from "sonner";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getEvent } from "@/lib/fetches";
import {
  getItemId,
  getStoragePathFromPublicUrl,
  invalidateTable,
} from "@/lib/utils";
import { useBrandProfile } from "@/components/Providers/UserProvider";
import { Icons } from "@/components/Custom-UI/icons";
import { supabase } from "@/lib/supabase/client";
import { EventForm } from "../event-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/Shad-UI/alert-dialog";
import { Button } from "@/components/Shad-UI/button";
import { Trash2 } from "lucide-react";

export default function EditEventPage() {
  const pathname = usePathname();
  const eventId = getItemId(pathname.split("/").pop() || "");
  const router = useTransitionRouter();
  const queryClient = useQueryClient();
  const brandProfile = useBrandProfile();

  const { data: event, isError } = useQuery(getEvent(eventId || ""), {
    enabled: !!eventId,
  });

  if (!eventId) {
    toast.error("Event ID is missing.");
    router.push("/brand-dashboard/events");
    return;
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="w-6 h-6 animate-spin" /> Loading
      </div>
    );
  }

  if (isError) {
    toast.error("Failed to load event");
    router.push("/brand-dashboard/events");
    return;
  }

  if (brandProfile && event.brand_id !== brandProfile.id) {
    toast.error("You don't have access to this event.");
    router.push("/brand-dashboard/events");
    return;
  }

  const handleDelete = async () => {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", event.id);

    if (error) {
      toast.error("Failed to delete event. Please try again.");
      return;
    }

    const imagePath = event.display_image
      ? getStoragePathFromPublicUrl(event.display_image, "events")
      : null;
    if (imagePath) {
      const { error: storageError } = await supabase.storage
        .from("events")
        .remove([imagePath]);
      if (storageError) {
        console.error("Failed to clean up event image:", storageError);
      }
    }

    invalidateTable(queryClient, "events");
    toast.success("Event deleted.");
    router.push("/brand-dashboard/events");
  };

  return (
    <div className="space-y-8">
      <EventForm initialData={event} />

      <div className="xl:max-w-screen-sm space-y-2 pt-6 border-t border-destructive/30">
        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
        <p className="text-sm opacity-70">
          Deleting an event removes it permanently and cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4" />
              Delete Event
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this event?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete &quot;{event.title}&quot;. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
