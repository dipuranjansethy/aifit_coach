import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Download, RefreshCw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlanDisplayProps {
  plan: {
    workout?: string;
    diet?: string;
    tips?: string;
  };
  onVoiceRead: (section: "workout" | "diet") => void;
  onStopVoice: () => void;
  onExport: () => void;
  onRegenerate: () => void;
  onItemClick: (item: string, type: "exercise" | "meal") => void;
  isVoiceLoading?: boolean;
  isVoicePlaying?: boolean;
}

export const PlanDisplay = ({ 
  plan, 
  onVoiceRead, 
  onStopVoice, 
  onExport, 
  onRegenerate, 
  onItemClick, 
  isVoiceLoading = false, 
  isVoicePlaying = false 
}: PlanDisplayProps) => {
  const parseSection = (text: string | undefined) => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim());
  };

  const renderClickableItems = (lines: string[], type: "exercise" | "meal") => {
    return lines.map((line, index) => {
      const isClickable = line.includes('-') || line.includes('•');
      return (
        <p
          key={index}
          className={`${isClickable ? 'cursor-pointer hover:text-primary hover:translate-x-1 transition-all duration-200' : ''} ${
            line.startsWith('#') ? 'font-bold text-lg mt-4 mb-2' : ''
          }`}
          onClick={() => isClickable && onItemClick(line, type)}
        >
          {line}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Your Personalized Plan
        </h2>
        <div className="flex gap-2">
          <Button onClick={onRegenerate} variant="outline" className="border-primary/30">
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
          <Button onClick={onExport} variant="outline" className="border-primary/30">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {plan.workout && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 shadow-glow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Badge variant="default" className="bg-primary">Workout Plan</Badge>
            </h3>
            <Button
              onClick={isVoicePlaying ? onStopVoice : () => onVoiceRead("workout")}
              disabled={isVoiceLoading && !isVoicePlaying}
              variant="outline"
              size="sm"
              className="border-primary/30"
            >
              {isVoicePlaying ? (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isVoiceLoading ? "Loading..." : "Read Aloud"}
                </>
              )}
            </Button>
          </div>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2 text-muted-foreground">
              {renderClickableItems(parseSection(plan.workout), "exercise")}
            </div>
          </ScrollArea>
        </Card>
      )}

      {plan.diet && (
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-secondary/20 shadow-glow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Badge variant="secondary" className="bg-secondary">Diet Plan</Badge>
            </h3>
            <Button
              onClick={isVoicePlaying ? onStopVoice : () => onVoiceRead("diet")}
              disabled={isVoiceLoading && !isVoicePlaying}
              variant="outline"
              size="sm"
              className="border-secondary/30"
            >
              {isVoicePlaying ? (
                <>
                  <VolumeX className="w-4 h-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  {isVoiceLoading ? "Loading..." : "Read Aloud"}
                </>
              )}
            </Button>
          </div>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2 text-muted-foreground">
              {renderClickableItems(parseSection(plan.diet), "meal")}
            </div>
          </ScrollArea>
        </Card>
      )}

      {plan.tips && (
        <Card className="p-6 bg-accent/10 backdrop-blur-sm border-accent/30">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
            AI Tips & Motivation
          </h3>
          <div className="space-y-2 text-muted-foreground">
            {parseSection(plan.tips).map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
