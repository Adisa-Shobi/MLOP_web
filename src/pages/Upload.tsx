
import React from "react";
import Navigation from "@/components/Navigation";
import DataUpload from "@/components/DataUpload";
import { Upload } from "lucide-react";

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-fitness-primary">
            <Upload className="h-8 w-8" />
            <span>Upload Training Data</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload new data to improve the model's prediction accuracy
          </p>
        </header>

        <div className="mb-6 p-4 rounded-lg bg-white border shadow-sm">
          <div className="flex items-start gap-3">
            <div className="bg-fitness-primary/10 p-2 rounded-full">
              <Upload className="h-5 w-5 text-fitness-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Data Upload</h2>
              <p className="text-muted-foreground text-sm">
                Upload CSV files containing new training data. The data should follow the same format as 
                the prediction inputs, including all required fields. These files will be used for model retraining.
              </p>
            </div>
          </div>
        </div>

        <DataUpload />
      </main>
    </div>
  );
};

export default UploadPage;
