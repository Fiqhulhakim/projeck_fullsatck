import { getUser } from "../services/api";

// Custom hook untuk cek role
function useRole() {
  const user = getUser();
  return {
    isAdmin: user?.role === "admin",
    isUser:  user?.role === "user",
    role:    user?.role ?? null,
  };
}

export default useRole;