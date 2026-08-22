import { BrandProfile } from "@/types/system-types/BrandProfile";
import { CustomerProfile } from "@/types/system-types/CustomerProfile";
import { User } from "@supabase/supabase-js";
import React from "react";
import { ROLE_CUSTOMER } from "@/lib/roles";

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
  return userSession?.user_metadata.role_id === ROLE_CUSTOMER ? (
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
