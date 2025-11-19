import { useState } from "react";
import { UserForm, UserFormData } from "@/components/UserForm";
import { PlanDisplay } from "@/components/PlanDisplay";
import { MotivationQuote } from "@/components/MotivationQuote";
import { ImageModal } from "@/components/ImageModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dumbbell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import jsPDF from "jspdf";

interface Plan {
  workout?: string;
  diet?: string;
  tips?: string;
}

const Index = () => {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  const [imageModal, setImageModal] = useState({ isOpen: false, url: null as string | null, title: "", isLoading: false });
  const { theme, setTheme } = useTheme();

  const handleFormSubmit = async (userData: UserFormData) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("generate-plan", {
        body: { userData },
      });

      if (error) throw error;

      setPlan(data.plan);
      localStorage.setItem("fitnessplan", JSON.stringify(data.plan));
      toast.success("Your personalized plan is ready!");
    } catch (error: any) {
      console.error("Error generating plan:", error);
      if (error.message?.includes("429")) {
        toast.error("Rate limit exceeded. Please try again in a moment.");
      } else if (error.message?.includes("402")) {
        toast.error("Please add credits to continue using AI features.");
      } else {
        toast.error("Failed to generate plan. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceRead = async (section: "workout" | "diet") => {
    if (!plan) return;

    try {
      setIsVoiceLoading(true);
      setIsVoicePlaying(true);
      const text = section === "workout" ? plan.workout : plan.diet;
      
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onend = () => {
          setIsVoiceLoading(false);
          setIsVoicePlaying(false);
        };
        utterance.onerror = () => {
          setIsVoiceLoading(false);
          setIsVoicePlaying(false);
        };
        window.speechSynthesis.speak(utterance);
        toast.success(`Reading ${section} plan aloud`);
      } else {
        toast.error("Text-to-speech not supported in your browser");
        setIsVoiceLoading(false);
        setIsVoicePlaying(false);
      }
    } catch (error) {
      console.error("Error reading aloud:", error);
      setIsVoiceLoading(false);
      setIsVoicePlaying(false);
      toast.error("Failed to read plan aloud");
    } finally {
      setIsVoiceLoading(false);
    }
  };

  const handleItemClick = async (item: string, type: "exercise" | "meal") => {
    try {
      setImageModal({ isOpen: true, url: null, title: item, isLoading: true });
      
      const { data, error } = await supabase.functions.invoke("generate-image", {
        body: { prompt: item, type },
      });

      if (error) throw error;

      setImageModal(prev => ({ ...prev, url: data.imageUrl, isLoading: false }));
    } catch (error: any) {
      console.error("Error generating image:", error);
      if (error.message?.includes("429")) {
        toast.error("Rate limit exceeded for image generation.");
      } else if (error.message?.includes("402")) {
        toast.error("Please add credits for image generation.");
      } else {
        toast.error("Failed to generate image");
      }
      setImageModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleExportPDF = () => {
    if (!plan) return;

    try {
      const pdf = new jsPDF();
      let yPosition = 20;

      pdf.setFontSize(20);
      pdf.text("Your Fitness Plan", 20, yPosition);
      yPosition += 15;

      if (plan.workout) {
        pdf.setFontSize(16);
        pdf.text("Workout Plan", 20, yPosition);
        yPosition += 10;
        pdf.setFontSize(10);
        const workoutLines = pdf.splitTextToSize(plan.workout, 170);
        pdf.text(workoutLines, 20, yPosition);
        yPosition += workoutLines.length * 5 + 10;
      }

      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      if (plan.diet) {
        pdf.setFontSize(16);
        pdf.text("Diet Plan", 20, yPosition);
        yPosition += 10;
        pdf.setFontSize(10);
        const dietLines = pdf.splitTextToSize(plan.diet, 170);
        pdf.text(dietLines, 20, yPosition);
      }

      pdf.save("fitness-plan.pdf");
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    }
  };

  const stopVoiceRead = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsVoiceLoading(false);
      setIsVoicePlaying(false);
      toast.info("Stopped reading");
    }
  };

  const handleRegenerate = async () => {
    setPlan(null);
    toast.info("Ready to generate a new plan");
  };

  const loadSavedPlan = () => {
    const saved = localStorage.getItem("fitnessplan");
    if (saved) {
      setPlan(JSON.parse(saved));
      toast.success("Loaded your previous plan");
    } else {
      toast.info("No saved plan found");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12 space-y-4 animate-fade-in">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Dumbbell className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
              FitAI Coach
            </h1>
            <Sparkles className="w-12 h-12 text-secondary" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered fitness companion for personalized workout and diet plans
          </p>
          <div className="flex gap-3 justify-center items-center">
            <Button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              variant="outline"
              size="icon"
              className="border-primary/30"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            {!plan && (
              <Button onClick={loadSavedPlan} variant="outline" className="border-primary/30">
                Load Saved Plan
              </Button>
            )}
          </div>
        </header>

        {/* Motivation Quote */}
        <div className="mb-8">
          <MotivationQuote />
        </div>

        {/* Main Content */}
        {!plan ? (
          <UserForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        ) : (
          <PlanDisplay
            plan={plan}
            onVoiceRead={handleVoiceRead}
            onStopVoice={stopVoiceRead}
            onExport={handleExportPDF}
            onRegenerate={handleRegenerate}
            onItemClick={handleItemClick}
            isVoiceLoading={isVoiceLoading}
            isVoicePlaying={isVoicePlaying}
          />
        )}

        {/* Image Modal */}
        <ImageModal
          isOpen={imageModal.isOpen}
          onClose={() => setImageModal({ isOpen: false, url: null, title: "", isLoading: false })}
          imageUrl={imageModal.url}
          title={imageModal.title}
          isLoading={imageModal.isLoading}
        />
      </div>
    </div>
  );
};

export default Index;
