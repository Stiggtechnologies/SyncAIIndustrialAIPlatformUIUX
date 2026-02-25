import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useAnalytics() {
  const trackSession = async (sessionType: string, queryText?: string, executiveMode?: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    try {
      await supabase.from('user_sessions').insert({
        user_id: user.id,
        session_type: sessionType,
        query_text: queryText,
        executive_mode: executiveMode || false,
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  const trackPageView = (page: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: page,
      });
    }
  };

  const trackConversion = (conversionType: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        conversion_type: conversionType,
        value: value,
      });
    }
  };

  return {
    trackSession,
    trackPageView,
    trackConversion,
  };
}

export function usePageView(pageName: string) {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(pageName);
  }, [pageName, trackPageView]);
}
