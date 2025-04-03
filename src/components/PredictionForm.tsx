import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { makePrediction, PredictionData, PredictionResult } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Activity, Target, Dumbbell } from "lucide-react";
import PredictionInsights from "./PredictionInsights";

const formSchema = z.object({
  age: z.coerce.number().min(10).max(100),
  gender: z.enum(["Male", "Female"]),
  weight: z.coerce.number().min(30).max(200),
  height: z.coerce.number().min(1).max(2.5),
  max_bpm: z.coerce.number().min(100).max(240),
  avg_bpm: z.coerce.number().min(50).max(200),
  resting_bpm: z.coerce.number().min(40).max(120),
  session_duration: z.coerce.number().min(0.25).max(5),
  calories_burned: z.coerce.number().min(100).max(2000),
  workout_type: z.enum(["HIIT", "Cardio", "Strength", "Yoga"]),
  fat_percentage: z.coerce.number().min(5).max(50),
  water_intake: z.coerce.number().min(0.5).max(6),
  workout_frequency: z.coerce.number().min(1).max(14),
  bmi: z.coerce.number().min(16).max(45),
});

const experienceLevels = ["Beginner", "Intermediate", "Advanced"];

const PredictionForm = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PredictionData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      gender: "Male",
      weight: 75.5,
      height: 1.75,
      max_bpm: 185,
      avg_bpm: 145,
      resting_bpm: 65,
      session_duration: 1.5,
      calories_burned: 450,
      workout_type: "HIIT",
      fat_percentage: 15.5,
      water_intake: 2.5,
      workout_frequency: 4,
      bmi: 24.6,
    },
  });

  const onSubmit = async (data: PredictionData) => {
    setIsLoading(true);
    try {
      const result = await makePrediction(data);
      setPredictionResult(result);
      toast.success("Prediction generated successfully!");
    } catch (error) {
      console.error("Prediction error:", error);
      // Error toast is handled by the API interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBmi = () => {
    const weight = form.getValues("weight");
    const height = form.getValues("height");
    if (weight && height) {
      const bmi = weight / (height * height);
      form.setValue("bmi", parseFloat(bmi.toFixed(1)));
    }
  };

  const getExperienceLevelLabel = (classValue: number): string => {
    return experienceLevels[classValue] || "Unknown";
  };

  const formatProbability = (probability: number): string => {
    return (probability * 100).toFixed(2) + "%";
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-fitness-primary" />
            <span>Make a Fitness Prediction</span>
          </CardTitle>
          <CardDescription>
            Enter the details below to get a prediction based on your workout data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (years)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            calculateBmi();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (m)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            calculateBmi();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="max_bpm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Heart Rate (BPM)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avg_bpm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Average Heart Rate (BPM)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="resting_bpm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resting Heart Rate (BPM)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="session_duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Duration (hours)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calories_burned"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories Burned</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workout_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select workout type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HIIT">HIIT</SelectItem>
                          <SelectItem value="Cardio">Cardio</SelectItem>
                          <SelectItem value="Strength">Strength</SelectItem>
                          <SelectItem value="Yoga">Yoga</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fat_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Fat Percentage (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="water_intake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Intake (liters)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workout_frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Frequency (per week)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BMI (Auto-calculated)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} readOnly />
                      </FormControl>
                      <FormDescription>Calculated from height and weight</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-fitness-primary hover:bg-fitness-dark"
                disabled={isLoading}
              >
                {isLoading ? "Generating Prediction..." : "Generate Prediction"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-fitness-primary" />
              <span>Prediction Result</span>
            </CardTitle>
            <CardDescription>
              Your fitness experience level prediction will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {predictionResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-fitness-light/10 border border-fitness-primary/20">
                  <h3 className="text-lg font-medium mb-2">Predicted Experience Level:</h3>
                  {predictionResult.prediction && (
                    <>
                      <p className="text-2xl font-bold text-fitness-primary">
                        {getExperienceLevelLabel(predictionResult.prediction.class)}
                      </p>
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-gray-600">Probabilities:</h4>
                        <div className="space-y-1">
                          {predictionResult.prediction.probabilities &&
                            predictionResult.prediction.probabilities.map((prob, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{experienceLevels[index]}:</span>
                                <span className="font-medium">{formatProbability(prob)}</span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-center p-4">
                  <Dumbbell className="w-16 h-16 text-fitness-primary" />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Dumbbell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Fill out the form and submit to see your prediction</p>
              </div>
            )}
          </CardContent>
        </Card>

        {predictionResult && predictionResult.prediction && (
          <div>
            <h3 className="text-lg font-medium mb-3">Prediction Insights:</h3>
            <PredictionInsights predictionResult={predictionResult} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionForm;
