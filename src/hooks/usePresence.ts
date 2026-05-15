import { useEffect } from 'react';
import { supabase } from '../services/supabase';

export function usePresence() {
  useEffect(() => {
    const updatePresence = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('profiles')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', user.id);
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);
}
