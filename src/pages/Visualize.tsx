
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import DataVisualizations from "@/components/DataVisualizations";
import { BarChart3, Layers, ChevronDown, Info, FileDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getVisualizationData, getTrainingFiles, TrainingFile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Visualize = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFile = searchParams.get("filename") || undefined;
  
  // Fetch visualization data
  const { data: visualizationData, isLoading: isLoadingVisualization, error: visualizationError } = useQuery({
    queryKey: ['visualization', currentFile],
    queryFn: () => getVisualizationData(currentFile),
  });
  
  // Fetch available training files
  const { data: trainingFiles, isLoading: isLoadingFiles } = useQuery({
    queryKey: ['trainingFiles'],
    queryFn: getTrainingFiles,
  });
  
  // Handle file selection
  const handleFileChange = (filename: string) => {
    if (filename === "default") {
      // Remove filename parameter to use default data
      searchParams.delete("filename");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ filename });
    }
  };

  // Process data for display
  const data = visualizationData?.data;
  
  // Build file selection options
  const fileOptions = React.useMemo(() => {
    const options: { value: string; label: string }[] = [
      { value: "default", label: "Default Dataset" }
    ];
    
    if (trainingFiles && trainingFiles.length > 0) {
      trainingFiles.forEach(file => {
        options.push({
          value: file.filename,
          label: `${file.datetime} (${file.filename})`
        });
      });
    }
    
    return options;
  }, [trainingFiles]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2 text-fitness-primary">
                <BarChart3 className="h-8 w-8" />
                <span>Data Visualizations</span>
              </h1>
              <p className="text-muted-foreground mt-2">
                Explore training data characteristics and experience level classification insights
              </p>
            </div>
            
            {/* File selector dropdown */}
            <div className="w-72">
              <div className="flex items-center gap-2">
                <FileDown className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Dataset:</span>
              </div>
              <Select 
                value={currentFile || "default"} 
                onValueChange={handleFileChange}
                disabled={isLoadingFiles}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Dataset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {fileOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {currentFile && (
                <p className="text-xs text-muted-foreground mt-1">
                  Showing data from: {currentFile}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* Loading state */}
        {isLoadingVisualization && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitness-primary"></div>
          </div>
        )}

        {/* Error state */}
        {visualizationError && (
          <Card className="mb-8 bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium text-red-800 mb-2">Error Loading Visualization Data</h2>
              <p className="text-red-600">
                There was a problem fetching the visualization data. Please try again or select a different dataset.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => handleFileChange("default")}>
                Reset to Default Dataset
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Only show content when data is loaded */}
        {data && !isLoadingVisualization && (
          <>
            {/* Introduction card with story overview */}
            <Card className="mb-8 bg-white border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-fitness-primary/10 p-2 rounded-full">
                    <Info className="h-5 w-5 text-fitness-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium">The Story Behind the Data</h2>
                    <p className="text-muted-foreground">
                      Our analysis reveals fascinating patterns about what differentiates fitness levels among members.
                    </p>
                  </div>
                </div>
                
                <div className="pl-12 space-y-4 text-sm">
                  <p>
                    This dashboard examines <strong>{data.summary.totalMembers} gym members</strong> across different age groups, workout preferences, and experience levels. 
                    The visualizations below tell the story of what distinguishes beginners from advanced athletes.
                  </p>
                  
                  <p>
                    <strong>Key Insights:</strong>
                  </p>
                  
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Advanced members spend <strong>{Math.round((data.experienceLevelData.durationByExperience[2].avgDuration - data.experienceLevelData.durationByExperience[0].avgDuration) / data.experienceLevelData.durationByExperience[0].avgDuration * 100)}% more time</strong> in their workout sessions compared to beginners</li>
                    <li>Members who exercise <strong>5 days per week</strong> have significantly lower body fat percentages ({data.experienceLevelData.workoutFrequencyData[3].avgFatPercentage}% on average)</li>
                    <li>Workout preferences shift from cardio-dominant to strength-focused as experience increases</li>
                    <li>Body fat percentage shows a <strong>{Math.round(data.experienceLevelData.bodyCompositionByExperience[0].avgBodyFat - data.experienceLevelData.bodyCompositionByExperience[2].avgBodyFat)}-point decrease</strong> from beginner to advanced levels</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Experience Level Analysis section with narrative */}
            <div className="mb-6 p-4 rounded-lg bg-white border shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-fitness-primary/10 p-2 rounded-full">
                  <Layers className="h-5 w-5 text-fitness-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-medium">Experience Level Analysis</h2>
                  <p className="text-muted-foreground text-sm">
                    The visualizations below provide insights into how different workout metrics relate to 
                    experience levels (Beginner, Intermediate, Advanced). These charts identify patterns 
                    that distinguish different fitness experience classifications.
                  </p>
                </div>
              </div>
            </div>

            {/* Narrative guidance - expandable interpretations */}
            <Accordion type="single" collapsible className="mb-8">
              <AccordionItem value="interpretation-1">
                <AccordionTrigger className="py-2 px-4 bg-white rounded-t-lg border border-b-0 font-medium text-fitness-primary hover:no-underline">
                  How to Interpret These Visualizations
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 bg-white border border-t-0 rounded-b-lg">
                  <div className="space-y-3 text-sm">
                    <p>
                      <strong>Age and Experience:</strong> The first chart shows the relationship between age and experience level. 
                      Notice that advanced members are typically older (average age {data.experienceLevelData.ageByExperience[2].avgAge}), suggesting that fitness experience often 
                      develops over years of consistent training.
                    </p>
                    
                    <p>
                      <strong>Workout Duration:</strong> The second chart reveals how workout length correlates with experience level. 
                      Advanced members train for about {data.experienceLevelData.durationByExperience[2].avgDuration} hours per session, while beginners average just over {data.experienceLevelData.durationByExperience[0].avgDuration} hours. This reflects the 
                      improved endurance and commitment that develops with experience.
                    </p>
                    
                    <p>
                      <strong>Workout Preferences:</strong> The third chart breaks down workout type preferences by experience level. 
                      Notice how beginners favor cardio ({data.experienceLevelData.workoutPreferencesByExperience.beginner.cardio}%) and yoga ({data.experienceLevelData.workoutPreferencesByExperience.beginner.yoga}%), while advanced members 
                      show stronger preference for strength training ({data.experienceLevelData.workoutPreferencesByExperience.advanced.strength}%).
                    </p>
                    
                    <p>
                      <strong>Body Composition:</strong> The fourth chart shows how body composition metrics change with experience level. 
                      Both BMI and body fat percentage decrease as experience increases, with the most dramatic improvements seen in the 
                      transition from intermediate to advanced.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Using the DataVisualizations component with the visualization data */}
            <DataVisualizations data={data} />
            
            {/* Insights section after visualizations */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white border shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium text-fitness-primary mb-2">Age Isn't Just a Number</h3>
                  <p className="text-sm">
                    Our data shows that experience levels tend to increase with age, but fitness metrics can improve at any stage. 
                    Members over 40 who train consistently achieve advanced metrics, challenging the notion that fitness declines with age.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium text-fitness-primary mb-2">Consistency Is Key</h3>
                  <p className="text-sm">
                    The dramatic improvement in body composition metrics for members who train 5 days per week (only {data.experienceLevelData.workoutFrequencyData[3].avgFatPercentage}% body fat) demonstrates that 
                    consistency is more important than workout type. Regular exercise creates a compound effect that leads to significant results.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border shadow-sm">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium text-fitness-primary mb-2">Balanced Training Evolution</h3>
                  <p className="text-sm">
                    As members gain experience, their workout preferences evolve to include more strength training ({data.experienceLevelData.workoutPreferencesByExperience.advanced.strength}% for advanced vs. {data.experienceLevelData.workoutPreferencesByExperience.beginner.strength}% for beginners) while maintaining 
                    some cardio and flexibility work. This balanced approach appears to correlate with better overall fitness outcomes.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Final takeaways section */}
            <Card className="mt-10 bg-white border shadow-sm">
              <CardContent className="pt-6">
                <h3 className="text-xl font-medium text-fitness-primary mb-3">Key Takeaways from Our Analysis</h3>
                <div className="space-y-4">
                  <p>
                    Our data tells a compelling story about the journey from beginner to advanced fitness levels. The most significant factors 
                    that distinguish experience levels are <strong>workout frequency</strong>, <strong>session duration</strong>, and 
                    <strong> training balance</strong>.
                  </p>
                  
                  <p>
                    For gym members looking to progress to more advanced levels, the data suggests focusing on:
                  </p>
                  
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Increasing workout frequency to 4-5 days per week</li>
                    <li>Gradually extending workout duration as endurance improves</li>
                    <li>Incorporating more strength training while maintaining cardio fitness</li>
                    <li>Focusing on consistency rather than intensity, especially for beginners</li>
                  </ol>
                  
                  <p>
                    These visualizations demonstrate that fitness progress is a journey with clear, measurable milestones that correlate 
                    with specific training behaviors and patterns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Visualize;
