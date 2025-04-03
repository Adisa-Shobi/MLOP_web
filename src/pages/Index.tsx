
import React from "react";
import Navigation from "@/components/Navigation";
import PredictionForm from "@/components/PredictionForm";
import { Activity, LineChart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-fitness-primary">
            <Activity className="h-8 w-8" />
            <span>Fitness Experience Level Prediction</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Predict your fitness experience level and get personalized insights based on your workout data
          </p>
        </header>

        <div className="mb-6 p-4 rounded-lg bg-white border shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-fitness-primary/10 p-2 rounded-full">
              <LineChart className="h-5 w-5 text-fitness-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Make a Prediction</h2>
              <p className="text-muted-foreground text-sm">
                Enter your workout data to predict your fitness experience level (Beginner, Intermediate, or Advanced)
                and receive insights about your health, athletic comparisons, and percentile rankings.
              </p>
            </div>
          </div>
        </div>

        <PredictionForm />
      </main>
    </div>
  );
};

export default Index;
