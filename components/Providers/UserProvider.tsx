import { BrandProfile } from "@/types/BrandProfile";
import { CustomerProfile } from "@/types/CustomerProfile";
import { User } from "@supabase/supabase-js";
import React from "react";

const customerProfileContext = React.createContext<CustomerProfile | null>(
  null
);
export const useCustomerProfile = () =>
  React.useContext(customerProfileContext);

const brandProfileContext = React.createContext<BrandProfile | null>(null);
export const useBrandProfile = () => React.useContext(brandProfileContext);

const UserProvider = ({
  children,
  userSession,
  customerProfile,
  brandProfile,
}: {
  children: React.ReactNode;
  userSession: User | null;
  customerProfile: CustomerProfile | null;
  brandProfile: BrandProfile | null;
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
