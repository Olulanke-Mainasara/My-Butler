import { BrandProfile } from "@/types/BrandProfile";
import { CustomerProfile } from "@/types/CustomerProfile";
import { User } from "@supabase/supabase-js";
import React from "react";

const customerProfileContext = React.createContext<
  CustomerProfile | null | undefined
>(null);
export const useCustomerProfile = () =>
  React.useContext(customerProfileContext);

const brandProfileContext = React.createContext<
  BrandProfile | null | undefined
>(null);
export const useBrandProfile = () => React.useContext(brandProfileContext);

const UserProvider = ({
  children,
  userSession,
  customerProfile,
  brandProfile,
}: {
  children: React.ReactNode;
  userSession: User | null;
  customerProfile: CustomerProfile | null | undefined;
  brandProfile: BrandProfile | null | undefined;
}) => {
  return userSession?.user_metadata.role_id === 2 ? (
    <customerProfileContext.Provider value={customerProfile}>
      {children}
    </customerProfileContext.Provider>
  ) : (
    <brandProfileContext.Provider value={brandProfile}>
      {children}
    </brandProfileContext.Provider>
  );
};

export default UserProvider;
