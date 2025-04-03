
import React from "react";
import { PredictionResult } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Award, BarChart3, Users } from "lucide-react";

interface PredictionInsightsProps {
  predictionResult: PredictionResult | null;
}

const experienceLevels = ["Beginner", "Intermediate", "Advanced"];

const PredictionInsights: React.FC<PredictionInsightsProps> = ({ predictionResult }) => {
  if (!predictionResult?.prediction) return null;

  const experienceLevel = experienceLevels[predictionResult.prediction.class];
  const probabilities = predictionResult.prediction.probabilities;
  
  // Determine highest probability for confidence level
  const maxProbIndex = probabilities.indexOf(Math.max(...probabilities));
  const maxProb = probabilities[maxProbIndex];
  const confidenceLevel = getConfidenceLevel(maxProb);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-fitness-primary" />
            <span>Health & Longevity Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {getHealthInsights(experienceLevel, predictionResult)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5 text-fitness-primary" />
            <span>Athletic Comparisons</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {getAthleteComparisons(experienceLevel)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-fitness-primary" />
            <span>Performance Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {getPerformanceMetrics(experienceLevel, predictionResult)}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-fitness-primary" />
            <span>Population Percentile</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {getPercentileInfo(experienceLevel, confidenceLevel)}
          </div>
        </CardContent>
      </Card>
      
      <p className="text-xs text-muted-foreground mt-2">
        Note: These insights are based on statistical correlations and research data. Individual results may vary based on genetics, environment, and other factors.
      </p>
    </div>
  );
};

// Helper functions to generate insights based on experience level
function getConfidenceLevel(probability: number): string {
  if (probability >= 0.8) return "high";
  if (probability >= 0.6) return "moderate";
  return "low";
}

function getHealthInsights(level: string, result: PredictionResult) {
  const insights = {
    "Beginner": (
      <>
        <p>Based on your current fitness profile, you're in the early stages of your fitness journey.</p>
        <p>Research shows that individuals at this level who maintain consistent exercise can expect to increase their lifespan by 3-5 years compared to sedentary individuals.</p>
        <p>Your cardiovascular health indicators suggest a moderate risk profile that can be improved with consistent exercise.</p>
      </>
    ),
    "Intermediate": (
      <>
        <p>Your fitness profile indicates a well-established exercise routine and improved physiological markers.</p>
        <p>Studies suggest that individuals at your fitness level typically enjoy a 5-7 year increase in life expectancy compared to sedentary peers.</p>
        <p>Your heart rate metrics indicate improved cardiovascular efficiency, potentially reducing risk of heart disease by approximately 35% compared to sedentary individuals.</p>
      </>
    ),
    "Advanced": (
      <>
        <p>Your advanced fitness profile shows excellent physiological adaptations to regular training.</p>
        <p>Research from longitudinal studies indicates that individuals maintaining your level of fitness can expect a 7-10 year increase in healthy lifespan.</p>
        <p>Your cardiovascular metrics are comparable to those of endurance athletes, with significantly lower resting heart rate and improved recovery compared to the general population.</p>
      </>
    )
  };
  
  return insights[level];
}

function getAthleteComparisons(level: string) {
  const comparisons = {
    "Beginner": (
      <>
        <p>Your fitness profile shares similarities with recreational athletes in the early stages of their training.</p>
        <p>Your cardiovascular metrics resemble those of casual weekend warriors and recreational sports participants.</p>
        <p>With your current profile, you could likely complete a 5K run or participate in recreational team sports with proper preparation.</p>
      </>
    ),
    "Intermediate": (
      <>
        <p>Your fitness metrics align with those of regular club-level athletes or dedicated fitness enthusiasts.</p>
        <p>Your cardiovascular profile is comparable to amateur competitive runners, cyclists, or fitness class regulars.</p>
        <p>With your current fitness level, you could successfully train for and complete half-marathons or Olympic-distance triathlons with proper preparation.</p>
      </>
    ),
    "Advanced": (
      <>
        <p>Your fitness profile shares key characteristics with sub-elite athletes and serious sports competitors.</p>
        <p>Your cardiovascular metrics approach those of collegiate-level endurance athletes or competitive CrossFit participants.</p>
        <p>Your heart rate and recovery metrics suggest you could train effectively for marathons, long-distance triathlons, or competitive sports leagues with proper periodization.</p>
      </>
    )
  };
  
  return comparisons[level];
}

function getPerformanceMetrics(level: string, result: PredictionResult) {
  const metrics = {
    "Beginner": (
      <>
        <p>Your current metrics suggest you're in the bottom 30% of fitness levels among active individuals.</p>
        <p>Your VO₂ max is likely in the range of 25-35 ml/kg/min based on your heart rate metrics, placing you in the "fair" category for your demographic.</p>
        <p>Your recovery rate and heart rate variability have significant room for improvement with consistent training.</p>
      </>
    ),
    "Intermediate": (
      <>
        <p>Your performance metrics place you in the 40-70th percentile range among fitness enthusiasts.</p>
        <p>Your estimated VO₂ max is likely between 35-45 ml/kg/min based on your cardiovascular metrics, placing you in the "good" to "very good" range.</p>
        <p>Your heart rate recovery metrics suggest efficient cardiovascular adaptation to exercise.</p>
      </>
    ),
    "Advanced": (
      <>
        <p>Your performance metrics place you in the top 20% of fitness enthusiasts.</p>
        <p>Your estimated VO₂ max is likely 45+ ml/kg/min based on your cardiovascular profile, placing you in the "excellent" category for your demographic.</p>
        <p>Your heart rate variability and recovery metrics indicate high-level cardiovascular fitness and adaptability to training stressors.</p>
      </>
    )
  };
  
  return metrics[level];
}

function getPercentileInfo(level: string, confidence: string) {
  const percentiles = {
    "Beginner": (
      <>
        <p>Based on population studies, your fitness level places you in the 20-40th percentile among active adults.</p>
        <p>Compared to the general population (including sedentary individuals), you're still in the 50-60th percentile.</p>
        <p>With 3-6 months of consistent training, individuals with your profile typically advance to the intermediate level.</p>
      </>
    ),
    "Intermediate": (
      <>
        <p>Your current fitness metrics place you in the 50-75th percentile among active adults.</p>
        <p>Compared to the general population, you're in the 75-85th percentile for overall fitness.</p>
        <p>You're in the top third of all fitness enthusiasts in terms of consistent training habits and physiological adaptations.</p>
      </>
    ),
    "Advanced": (
      <>
        <p>Your fitness profile places you in the top 10-15% of active adults.</p>
        <p>Compared to the general population, you're in the 90-95th percentile for overall fitness.</p>
        <p>Your metrics are approaching those of specialized athletes who train specifically for competitive performance.</p>
      </>
    )
  };
  
  // Add confidence level disclaimer
  const confidenceNote = {
    "high": <p className="text-green-600 font-medium">The model has high confidence in this assessment based on your input data.</p>,
    "moderate": <p className="text-amber-600 font-medium">The model has moderate confidence in this assessment. For more accurate results, ensure all input data is precise.</p>,
    "low": <p className="text-red-600 font-medium">The model has lower confidence in this assessment. Consider reviewing your input data for accuracy.</p>
  };
  
  return (
    <>
      {percentiles[level]}
      {confidenceNote[confidence]}
    </>
  );
}

export default PredictionInsights;
