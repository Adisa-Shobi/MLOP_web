import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { uploadTrainingData, getTrainingFiles, deleteTrainingFile, TrainingFile } from "@/lib/api";
import { toast } from "sonner";
import { Upload, FileText, Trash2, FileX, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

const DataUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: trainingFiles, isLoading: filesLoading, refetch: refetchFiles } = useQuery<TrainingFile[]>({
    queryKey: ["trainingFiles"],
    queryFn: getTrainingFiles,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Please select a CSV file");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress during upload
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 200);

    try {
      await uploadTrainingData(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      toast.success("File uploaded successfully");

      // Reset file input and state
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFile(null);
      refetchFiles();
    } catch (error) {
      toast.error("Failed to upload file");
      console.error("Upload error:", error);
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (filename: string) => {
    try {
      await deleteTrainingFile(filename);
      toast.success(`Deleted ${filename}`);
      refetchFiles();
    } catch (error) {
      toast.error(`Failed to delete ${filename}`);
      console.error("Delete error:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Training Data</CardTitle>
        <CardDescription>
          Upload CSV files containing new training data. The data should follow the same format as
          the training data used to train the model.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="flex-1"
            />
            <Button onClick={handleUpload} disabled={!file || isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
          {isUploading && <Progress value={uploadProgress} className="w-full" />}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Uploaded Files</h3>
          {filesLoading ? (
            <div className="text-center py-4">Loading...</div>
          ) : trainingFiles && trainingFiles.length > 0 ? (
            <div className="space-y-2">
              {trainingFiles.map((file) => (
                <div
                  key={file.filename}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{file.filename}</div>
                      <div className="text-sm text-muted-foreground">
                        Uploaded: {new Date(file.datetime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFile(file.filename)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No files uploaded yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataUpload;
