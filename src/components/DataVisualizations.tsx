
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  LineChart,
  Line
} from "recharts";
import { 
  Dumbbell, 
  Activity, 
  Clock, 
  Heart, 
  Flame, 
  Droplet,
  ArrowRight
} from "lucide-react";

// Color palette for consistent visualization
const COLOR_PALETTE = {
  MALE: '#3B82F6',   // Blue for Male
  FEMALE: '#EC4899', // Pink for Female
  BEGINNER: '#10B981', // Green for Beginner
  INTERMEDIATE: '#F59E0B', // Amber for Intermediate
  ADVANCED: '#6366F1',  // Indigo for Advanced
  CHART_ACCENT: '#7c3aed', // Violet accent color
  CHART_SECONDARY: '#60a5fa' // Blue secondary color
};

const DataVisualizations = ({ data }) => {
  // Transform API data into chart-ready formats
  
  // Age by Experience Level Chart Data
  const ageByExperienceData = data?.experienceLevelData?.ageByExperience || [
    { level: "Beginner", avgAge: 32, count: 312 },
    { level: "Intermediate", avgAge: 38, count: 427 },
    { level: "Advanced", avgAge: 44, count: 234 }
  ];
  
  // Duration by Experience Level Chart Data
  const durationByExperienceData = data?.experienceLevelData?.durationByExperience || [
    { level: "Beginner", avgDuration: 1.05, avgCalories: 780, count: 312 },
    { level: "Intermediate", avgDuration: 1.30, avgCalories: 895, count: 427 },
    { level: "Advanced", avgDuration: 1.50, avgCalories: 1050, count: 234 }
  ];
  
  // Workout Frequency vs Fat Percentage Chart Data
  const workoutFrequencyData = data?.experienceLevelData?.workoutFrequencyData || [
    { frequency: 2, avgFatPercentage: 27.4, count: 201 },
    { frequency: 3, avgFatPercentage: 27.6, count: 313 },
    { frequency: 4, avgFatPercentage: 23.7, count: 339 },
    { frequency: 5, avgFatPercentage: 14.7, count: 120 }
  ];
  
  // Body Composition by Experience Level Chart Data
  const bodyCompositionData = data?.experienceLevelData?.bodyCompositionByExperience || [
    { level: "Beginner", avgBMI: 26.8, avgBodyFat: 28.5 },
    { level: "Intermediate", avgBMI: 24.9, avgBodyFat: 22.7 },
    { level: "Advanced", avgBMI: 22.4, avgBodyFat: 15.8 }
  ];
  
  // Workout Preferences by Experience Level Chart Data
  const workoutPreferencesData = [];
  
  // Transform nested workout preferences data into chart-ready format
  const workoutPreferences = data?.experienceLevelData?.workoutPreferencesByExperience || {
    beginner: { cardio: 0, strength: 0, yoga: 0, hiit: 0 },
    intermediate: { cardio: 0, strength: 0, yoga: 0, hiit: 0 },
    advanced: { cardio: 0, strength: 0, yoga: 0, hiit: 0 }
  };
  
  // Transform nested preferences into a flat array for the chart
  Object.entries(workoutPreferences).forEach(([level, preferences]) => {
    Object.entries(preferences).forEach(([workoutType, percentage]) => {
      workoutPreferencesData.push({
        level: level.charAt(0).toUpperCase() + level.slice(1),
        workoutType: workoutType.charAt(0).toUpperCase() + workoutType.slice(1),
        percentage
      });
    });
  });
  
  // Calculate key insights for narrative elements
  const durationIncrease = Math.round((durationByExperienceData[2].avgDuration - durationByExperienceData[0].avgDuration) / durationByExperienceData[0].avgDuration * 100);
  const lowestBodyFat = Math.min(...workoutFrequencyData.map(item => item.avgFatPercentage));
  
  return (
    <div className="space-y-8">
      {/* Grid layout for visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visualization 1: Experience Level by Age */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-fitness-primary" />
              <span>Average Age by Experience Level</span>
            </CardTitle>
            <CardDescription>
              Member age distribution across different experience levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ageByExperienceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="level" />
                  <YAxis domain={[0, 50]} label={{ value: 'Age (years)', angle: -90, position: 'insideLeft', dy: 50 }} />
                  <Tooltip 
                    formatter={(value, name) => [`${value} years`, name === "avgAge" ? "Average Age" : name]}
                    labelFormatter={(label) => `Experience Level: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="avgAge" name="Average Age" fill={COLOR_PALETTE.CHART_ACCENT} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <p>Advanced members tend to be older on average ({ageByExperienceData[2].avgAge} years), suggesting that fitness experience builds over time.</p>
          </CardFooter>
        </Card>

        {/* Visualization 2: Average Session Duration by Experience Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-fitness-primary" />
              <span>Workout Duration by Experience Level</span>
            </CardTitle>
            <CardDescription>
              Average workout session length increases with experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={durationByExperienceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="level" />
                  <YAxis domain={[0, 2]} label={{ value: 'Duration (hours)', angle: -90, position: 'insideLeft', dy: 60 }} />
                  <Tooltip 
                    formatter={(value, name) => [name === "avgDuration" ? `${value} hours` : `${value} calories`, name === "avgDuration" ? "Avg Duration" : "Avg Calories"]}
                    labelFormatter={(label) => `Experience Level: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="avgDuration" name="Average Duration" fill={COLOR_PALETTE.CHART_ACCENT} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <p>Advanced members work out {durationIncrease}% longer than beginners, reflecting improved endurance and commitment.</p>
          </CardFooter>
        </Card>

        {/* Visualization 3: Body Fat % vs Workout Frequency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-fitness-primary" />
              <span>Body Fat % vs Workout Frequency</span>
            </CardTitle>
            <CardDescription>
              More frequent workouts correlate with lower body fat percentage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={workoutFrequencyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="frequency" label={{ value: 'Workout Days per Week', position: 'insideBottom', offset: -10 }} />
                  <YAxis domain={[10, 30]} label={{ value: 'Body Fat %', angle: -90, position: 'insideLeft', dy: 50 }} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Body Fat']}
                    labelFormatter={(label) => `${label} days per week`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgFatPercentage"
                    name="Body Fat Percentage"
                    stroke={COLOR_PALETTE.CHART_ACCENT}
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <p>A dramatic drop in body fat percentage occurs when members train 4-5 days per week, with 5 days showing the lowest average ({lowestBodyFat}%).</p>
          </CardFooter>
        </Card>

        {/* Visualization 4: Workout Preferences by Experience Level */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-fitness-primary" />
              <span>Workout Preferences by Experience Level</span>
            </CardTitle>
            <CardDescription>
              Workout type preferences evolve with increasing experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={workoutPreferencesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="workoutType" />
                  <YAxis domain={[0, 50]} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', dy: 50 }} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    labelFormatter={(label) => `Workout Type: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="percentage" name="Percentage">
                    {workoutPreferencesData.map((entry, index) => {
                      let color;
                      if (entry.level === "Beginner") color = COLOR_PALETTE.BEGINNER;
                      else if (entry.level === "Intermediate") color = COLOR_PALETTE.INTERMEDIATE;
                      else color = COLOR_PALETTE.ADVANCED;
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <div className="w-full">
              <p className="mb-2">Preferences shift from cardio-dominant to strength-focused as experience increases.</p>
              <div className="flex justify-between mt-2">
                {["Beginner", "Intermediate", "Advanced"].map((level, index) => {
                  let color;
                  if (level === "Beginner") color = COLOR_PALETTE.BEGINNER;
                  else if (level === "Intermediate") color = COLOR_PALETTE.INTERMEDIATE;
                  else color = COLOR_PALETTE.ADVANCED;
                  return (
                    <div key={level} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                      <span className="text-xs">{level}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Visualization 5: Body Composition by Experience Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-fitness-primary" />
            <span>Body Composition by Experience Level</span>
          </CardTitle>
          <CardDescription>
            BMI and body fat percentage decrease with greater experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={bodyCompositionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis yAxisId="left" domain={[20, 30]} label={{ value: 'BMI', angle: -90, position: 'insideLeft', dy: 40 }} />
                <YAxis yAxisId="right" orientation="right" domain={[10, 30]} label={{ value: 'Fat %', angle: 90, position: 'insideRight', dy: -40 }} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === "avgBMI" ? `${value}` : `${value}%`, 
                    name === "avgBMI" ? "Average BMI" : "Body Fat %"
                  ]}
                  labelFormatter={(label) => `Experience Level: ${label}`}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="avgBMI" 
                  name="Average BMI" 
                  stroke={COLOR_PALETTE.CHART_SECONDARY}
                  strokeWidth={2} 
                  dot={{ r: 6 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="avgBodyFat" 
                  name="Body Fat %" 
                  stroke={COLOR_PALETTE.CHART_ACCENT}
                  strokeWidth={2} 
                  dot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <p>Both BMI and body fat percentage show consistent improvement as experience level increases, with advanced members having {bodyCompositionData[2].avgBodyFat}% body fat compared to {bodyCompositionData[0].avgBodyFat}% for beginners.</p>
        </CardFooter>
      </Card>

      {/* Summary section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-fitness-primary" />
            <span>Experience Level Profile Summary</span>
          </CardTitle>
          <CardDescription>
            Key characteristics of members at different experience levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-fitness-primary mb-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_PALETTE.BEGINNER }}></div>
                Beginner Profile
              </h3>
              <ul className="text-sm space-y-2">
                <li>• Average age: {ageByExperienceData[0].avgAge} years</li>
                <li>• Workout duration: {ageByExperienceData[0].avgDuration || durationByExperienceData[0].avgDuration} hours</li>
                <li>• Body fat: {bodyCompositionData[0].avgBodyFat}%</li>
                <li>• Prefers: Cardio ({workoutPreferences.beginner.cardio}%) and Yoga ({workoutPreferences.beginner.yoga}%)</li>
                <li>• Typically trains 2-3 days per week</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-fitness-primary mb-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_PALETTE.INTERMEDIATE }}></div>
                Intermediate Profile
              </h3>
              <ul className="text-sm space-y-2">
                <li>• Average age: {ageByExperienceData[1].avgAge} years</li>
                <li>• Workout duration: {ageByExperienceData[1].avgDuration || durationByExperienceData[1].avgDuration} hours</li>
                <li>• Body fat: {bodyCompositionData[1].avgBodyFat}%</li>
                <li>• More balanced workout preferences</li>
                <li>• Typically trains 3-4 days per week</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-fitness-primary mb-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_PALETTE.ADVANCED }}></div>
                Advanced Profile
              </h3>
              <ul className="text-sm space-y-2">
                <li>• Average age: {ageByExperienceData[2].avgAge} years</li>
                <li>• Workout duration: {ageByExperienceData[2].avgDuration || durationByExperienceData[2].avgDuration} hours</li>
                <li>• Body fat: {bodyCompositionData[2].avgBodyFat}%</li>
                <li>• Stronger preference for Strength ({workoutPreferences.advanced.strength}%)</li>
                <li>• Typically trains 4-5 days per week</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Journey story */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-fitness-primary" />
            <span>The Fitness Journey Narrative</span>
          </CardTitle>
          <CardDescription>
            Understanding the progression from beginner to advanced
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative pl-8 pb-6 border-l-2 border-fitness-primary/30">
              <div className="absolute -left-1.5 top-0">
                <div className="w-3 h-3 rounded-full bg-fitness-primary"></div>
              </div>
              <h3 className="text-base font-medium mb-2">The Beginner Phase</h3>
              <p className="text-sm text-muted-foreground">
                New gym members typically start with cardio and yoga-focused workouts. At this stage, 
                members train 2-3 days per week, with shorter sessions averaging {durationByExperienceData[0].avgDuration} hours. 
                Beginners show higher body fat percentages (around {bodyCompositionData[0].avgBodyFat}%) and often lack 
                structured training routines.
              </p>
            </div>
            
            <div className="relative pl-8 pb-6 border-l-2 border-fitness-primary/30">
              <div className="absolute -left-1.5 top-0">
                <div className="w-3 h-3 rounded-full bg-fitness-primary"></div>
              </div>
              <h3 className="text-base font-medium mb-2">The Intermediate Transition</h3>
              <p className="text-sm text-muted-foreground">
                As members progress, they typically increase workout frequency to 3-4 days per week and 
                extend sessions to {durationByExperienceData[1].avgDuration} hours. Workout preferences become more balanced, 
                with increased focus on strength training ({workoutPreferences.intermediate.strength}% vs. {workoutPreferences.beginner.strength}% for beginners). 
                Body fat percentage drops to around {bodyCompositionData[1].avgBodyFat}%, and BMI improves to a healthier {bodyCompositionData[1].avgBMI}.
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute -left-1.5 top-0">
                <div className="w-3 h-3 rounded-full bg-fitness-primary"></div>
              </div>
              <h3 className="text-base font-medium mb-2">The Advanced Achievement</h3>
              <p className="text-sm text-muted-foreground">
                Advanced members demonstrate consistent training habits with 4-5 weekly workouts, 
                longer sessions ({durationByExperienceData[2].avgDuration} hours on average), and significantly better body composition metrics. 
                They show a strong preference for strength training ({workoutPreferences.advanced.strength}%) while still maintaining cardio fitness. 
                With body fat percentages at {bodyCompositionData[2].avgBodyFat}% and optimal BMI of {bodyCompositionData[2].avgBMI}, they represent the 
                outcome of consistent, progressive training practices.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataVisualizations;
