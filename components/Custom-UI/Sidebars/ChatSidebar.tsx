"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/Shad-UI/sidebar";

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

import { useTransitionRouter } from "next-view-transitions";
import { Link } from "next-view-transitions";
import { Edit, Trash2 } from "lucide-react";
import { useCustomerProfile } from "@/components/Providers/UserProvider";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useChats } from "@/hooks/use-user-info";
import { deleteChat } from "@/lib/mutations";
import { supabase } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function ChatSidebar() {
  const customerProfile = useCustomerProfile();
  const userId = customerProfile?.id;
  const { toggleSidebar } = useSidebar();
  const router = useTransitionRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { data: conversations, isLoading, error } = useChats(userId);

  const { mutate: handleChatDelete } = useMutation({
    mutationFn: (chatId: string) => deleteChat(supabase, chatId),

    onSuccess: () => {
      toast.success("Conversation deleted");

      // Simply invalidate all chat queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey.includes("chats"),
      });
    },

    onError: () => {
      toast.error("Failed to delete conversation");
    },
  });

  const loading = isLoading;

  return (
    <Sidebar side="right">
      <SidebarHeader className="flex flex-row items-center justify-between pt-4">
        <p className="text-2xl">
          Butler{" "}
          <span className="text-brandLight dark:text-brandDark">A.I</span>
        </p>
        <button
          onClick={() => {
            toggleSidebar();
            router.push("/butler");
          }}
        >
          <Edit size={20} />
        </button>
      </SidebarHeader>
      <SidebarSeparator className="bg-darkBackground dark:bg-lightBackground w-full ml-0" />
      <SidebarContent className="gap-0">
        <div>
          {!conversations || conversations.length === 0 ? (
            <p className="text-base p-3">No conversations available</p>
          ) : loading ? (
            <div className="space-y-3">
              <div className="h-8 animate-pulse bg-gray-400 rounded-md"></div>
              <div className="h-8 animate-pulse bg-gray-400 rounded-md"></div>
              <div className="h-8 animate-pulse bg-gray-400 rounded-md"></div>
            </div>
          ) : conversations && !error ? (
            <SidebarGroup className="p-0 gap-0">
              <SidebarGroupLabel className="text-black dark:text-white font-bold text-xl">
                Conversations
              </SidebarGroupLabel>
              <SidebarGroupContent className="p-2">
                <SidebarMenu>
                  {conversations.map((convo) => (
                    <SidebarMenuItem key={convo.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/butler/${convo.id}`}
                        onClick={() => {
                          toggleSidebar();
                          router.push(`/butler/${convo.id}`);
                        }}
                      >
                        <Link href={`/butler/${convo.id}`}>
                          <span className="truncate text-sm">
                            {convo.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <SidebarMenuAction className="text-red-500">
                            <Trash2 />{" "}
                            <span className="sr-only">Delete chat</span>
                          </SidebarMenuAction>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-lightBackground dark:bg-darkBackground">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete this ({convo.title})
                              conversation and remove its data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleChatDelete(convo.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : error ? (
            <p>{error.message}</p>
          ) : null}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
