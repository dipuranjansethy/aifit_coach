import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const MotivationQuote = () => {
  const [quote, setQuote] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQuote();
  }, []);

  const generateQuote = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-motivation", {
        body: {},
      });

      if (error) throw error;
      setQuote(data.quote);
    } catch (error: any) {
      console.error("Error generating quote:", error);
      toast.error("Failed to generate motivation quote");
      setQuote("Your only limit is you. Push harder today!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Daily Motivation</h3>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">{quote}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
