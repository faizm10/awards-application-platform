'use client'
import { createContext, useContext, ReactNode } from "react";

export type UserRole = "super_admin" | "admin" | "committee";

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const UserRoleContext = createContext<UserRoleContextType>({
  role: "committee",
  setRole: () => {},
});

export const useUserRole = () => useContext(UserRoleContext);

export function UserRoleProvider({ children, role, setRole }: { children: ReactNode; role: UserRole; setRole: (role: UserRole) => void }) {
  return (
    <UserRoleContext.Provider value={{ role, setRole }}>
      {children}
    </UserRoleContext.Provider>
  );
} 