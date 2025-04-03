import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrainingFiles, retrainModel, getModelEvaluation, TrainingFile } from "@/lib/api";
import { toast } from "sonner";
import { RefreshCw, Zap, ChevronDown, ArrowUpRight, FileText, BarChart3, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ModelTraining = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const { data: trainingFiles, isLoading: filesLoading } = useQuery<TrainingFile[]>({
    queryKey: ["trainingFiles"],
    queryFn: getTrainingFiles,
  });

  const {
    data: modelEvaluation,
    isLoading: statsLoading,
    refetch: refetchStats
  } = useQuery({
    queryKey: ["modelStats"],
    queryFn: getModelEvaluation,
  });

  const handleTrainModel = async () => {
    if (!selectedFile) {
      toast.error("Please select a training file");
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    const progressInterval = setInterval(() => {
      setTrainingProgress((prev) => {
        const newProgress = prev + Math.random() * 5;
        return newProgress > 90 ? 90 : newProgress;
      });
    }, 300);

    try {
      await retrainModel(selectedFile);
      clearInterval(progressInterval);
      setTrainingProgress(100);
      toast.success("Model successfully retrained");

      refetchStats();
    } catch (error) {
      toast.error("Failed to retrain model");
      console.error("Training error:", error);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setIsTraining(false);
        setTrainingProgress(0);
      }, 1000);
    }
  };

  const prepareEvaluationData = () => {
    if (!modelEvaluation || !modelEvaluation.details) return null;

    try {
      const details = modelEvaluation.details;
      const metrics = [
        { name: 'Accuracy', value: Number(details.accuracy) },
        { name: 'Precision', value: Number(details.precision) },
        { name: 'Recall', value: Number(details.recall) },
        { name: 'F1 Score', value: Number(details.f1_score) },
      ];

      return metrics;
    } catch (error) {
      console.error("Error preparing evaluation data:", error);
      return null;
    }
  };

  const getClassLabel = (index: number) => {
    if (!modelEvaluation || !modelEvaluation.details || !modelEvaluation.details.class_labels) {
      return `Class ${index}`;
    }

    return modelEvaluation.details.class_labels[index] || `Class ${index}`;
  };

  const getExperienceLevelName = (classIndex: number) => {
    // Map class indices (0-2) to experience levels (1-3)
    const levelIndex = classIndex + 1;
    const levels = ["Beginner", "Intermediate", "Advanced"];
    return `${levels[classIndex]} (Level ${levelIndex})`;
  };

  const evaluationData = prepareEvaluationData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-fitness-primary" />
            <span>Retrain Model</span>
          </CardTitle>
          <CardDescription>
            Select a training file and trigger model retraining
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Training File</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="truncate">
                      {selectedFile || "Select a file"}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full" align="start">
                  {filesLoading ? (
                    <DropdownMenuItem disabled>Loading files...</DropdownMenuItem>
                  ) : trainingFiles && trainingFiles.length > 0 ? (
                    trainingFiles.map((file: TrainingFile) => (
                      <DropdownMenuItem
                        key={file.filename}
                        onClick={() => setSelectedFile(file.filename)}
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="truncate">{file.filename}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(file.datetime).toLocaleString()}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>No files available</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isTraining && (
              <div className="space-y-2">
                <Progress value={trainingProgress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Training model... {Math.round(trainingProgress)}%
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleTrainModel}
            className="w-full bg-fitness-primary hover:bg-fitness-dark"
            disabled={!selectedFile || isTraining}
          >
            <Zap className="h-4 w-4 mr-2" />
            {isTraining ? "Training in Progress..." : "Train Model"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-fitness-primary" />
            <span>Model Evaluation</span>
          </CardTitle>
          <CardDescription>
            View the current model's performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="h-64 flex items-center justify-center">
              <p>Loading model statistics...</p>
            </div>
          ) : modelEvaluation && modelEvaluation.details ? (
            <div className="space-y-4">
              <div className="h-64">
                {evaluationData && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={evaluationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 1]} />
                      <Tooltip formatter={(value) => [(Number(value) * 100).toFixed(2) + '%', 'Value']} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details">
                  <AccordionTrigger>
                    <span className="text-sm font-medium">Detailed Metrics</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Accuracy:</div>
                        <div>{(Number(modelEvaluation.details.accuracy) * 100).toFixed(2)}%</div>

                        <div className="font-medium">Precision:</div>
                        <div>{(Number(modelEvaluation.details.precision) * 100).toFixed(2)}%</div>

                        <div className="font-medium">Recall:</div>
                        <div>{(Number(modelEvaluation.details.recall) * 100).toFixed(2)}%</div>

                        <div className="font-medium">F1 Score:</div>
                        <div>{(Number(modelEvaluation.details.f1_score) * 100).toFixed(2)}%</div>
                      </div>

                      {modelEvaluation.details.confusion_matrix && (
                        <div className="pt-4">
                          <h4 className="font-medium mb-2">Confusion Matrix</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[100px]">Actual \ Predicted</TableHead>
                                {modelEvaluation.details.confusion_matrix[0].map((_, index) => (
                                  <TableHead key={index}>{getExperienceLevelName(index)}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {modelEvaluation.details.confusion_matrix.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                  <TableCell className="font-medium">{getExperienceLevelName(rowIndex)}</TableCell>
                                  {row.map((cell, cellIndex) => (
                                    <TableCell key={cellIndex} className={rowIndex === cellIndex ? "font-bold bg-muted/50" : ""}>
                                      {cell}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}

                      {modelEvaluation.details.classification_report && (
                        <div className="pt-4">
                          <h4 className="font-medium mb-2">Classification Report</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Precision</TableHead>
                                <TableHead>Recall</TableHead>
                                <TableHead>F1-Score</TableHead>
                                <TableHead>Support</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {Object.entries(modelEvaluation.details.classification_report)
                                .filter(([key]) => !isNaN(Number(key)))
                                .map(([key, value]: [string, any]) => (
                                  <TableRow key={key}>
                                    <TableCell className="font-medium">{getExperienceLevelName(Number(key))}</TableCell>
                                    <TableCell>{(Number(value.precision) * 100).toFixed(2)}%</TableCell>
                                    <TableCell>{(Number(value.recall) * 100).toFixed(2)}%</TableCell>
                                    <TableCell>{(Number(value["f1-score"]) * 100).toFixed(2)}%</TableCell>
                                    <TableCell>{value.support}</TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
              <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
              <p>No model evaluation data available</p>
              <Button
                variant="link"
                size="sm"
                onClick={() => refetchStats()}
                className="mt-2"
              >
                Refresh Data
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => refetchStats()}
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Refresh Model Stats
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ModelTraining;
