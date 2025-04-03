
import React from "react";
import Navigation from "@/components/Navigation";
import ModelTraining from "@/components/ModelTraining";
import { RefreshCw, Layers } from "lucide-react";

const TrainPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-fitness-primary">
            <RefreshCw className="h-8 w-8" />
            <span>Train Model</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Select training data and retrain the experience level classification model
          </p>
        </header>

        <div className="mb-6 p-4 rounded-lg bg-white border shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-fitness-primary/10 p-2 rounded-full">
              <Layers className="h-5 w-5 text-fitness-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Experience Level Classification</h2>
              <p className="text-muted-foreground text-sm">
                The model analyzes workout parameters to classify users into three experience levels: 
                Beginner (Level 1), Intermediate (Level 2), and Advanced (Level 3). 
                Retraining with new data can improve classification accuracy.
              </p>
            </div>
          </div>
        </div>

        <ModelTraining />
      </main>
    </div>
  );
};

export default TrainPage;
