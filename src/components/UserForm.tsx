import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export interface UserFormData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  fitnessGoal: string;
  fitnessLevel: string;
  workoutLocation: string;
  dietaryPreference: string;
  medicalHistory?: string;
  stressLevel?: string;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

export const UserForm = ({ onSubmit, isLoading }: UserFormProps) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    fitnessGoal: "",
    fitnessLevel: "",
    workoutLocation: "",
    dietaryPreference: "",
    medicalHistory: "",
    stressLevel: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="p-6 md:p-8 bg-card/50 backdrop-blur-sm border-primary/20 shadow-glow">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              required
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="border-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger className="border-primary/30 focus:border-primary">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Height (cm) *</Label>
            <Input
              id="height"
              type="number"
              required
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="border-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              required
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="border-primary/30 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fitnessGoal">Fitness Goal *</Label>
            <Select value={formData.fitnessGoal} onValueChange={(value) => setFormData({ ...formData, fitnessGoal: value })}>
              <SelectTrigger className="border-primary/30 focus:border-primary">
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                <SelectItem value="general-fitness">General Fitness</SelectItem>
                <SelectItem value="endurance">Endurance</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fitnessLevel">Fitness Level *</Label>
            <Select value={formData.fitnessLevel} onValueChange={(value) => setFormData({ ...formData, fitnessLevel: value })}>
              <SelectTrigger className="border-primary/30 focus:border-primary">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workoutLocation">Workout Location *</Label>
            <Select value={formData.workoutLocation} onValueChange={(value) => setFormData({ ...formData, workoutLocation: value })}>
              <SelectTrigger className="border-primary/30 focus:border-primary">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="gym">Gym</SelectItem>
                <SelectItem value="outdoor">Outdoor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dietaryPreference">Dietary Preference *</Label>
            <Select value={formData.dietaryPreference} onValueChange={(value) => setFormData({ ...formData, dietaryPreference: value })}>
              <SelectTrigger className="border-primary/30 focus:border-primary">
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stressLevel">Stress Level</Label>
            <Select value={formData.stressLevel} onValueChange={(value) => setFormData({ ...formData, stressLevel: value })}>
              <SelectTrigger className="border-primary/30 focus:border-primary">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
          <Textarea
            id="medicalHistory"
            value={formData.medicalHistory}
            onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
            placeholder="Any medical conditions or injuries we should know about..."
            className="border-primary/30 focus:border-primary min-h-[100px]"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-strong transition-all duration-300"
          size="lg"
        >
          {isLoading ? "Generating Your Plan..." : "Generate My Plan"}
        </Button>
      </form>
    </Card>
  );
};
