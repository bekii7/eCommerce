import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useSupabase } from "./useSupabase";

const useUserData = () => {
  const [user, setUser] = useState<null | User>(null);
  const { session, authenticated, loading, error } = useSupabase();

  useEffect(() => {
    if (authenticated) {
      setUser(session?.user ?? null);
    } else {
      setUser(null);
    }
  }, [session]);

  return { user, loading, error };
};

export default useUserData;
