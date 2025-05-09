// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Button } from "@/components/ui/button"
// import { Heart, AlertCircle, CheckCircle2 } from "lucide-react"
// import Recommendations from "./recommendations"

// interface PredictionResultProps {
//   prediction: number
//   probabilities?: number[]
//   onReset: () => void
// }

// export default function PredictionResult({ prediction, probabilities, onReset }: PredictionResultProps) {
//   const [riskFactors, setRiskFactors] = useState<string[]>([])

//   // Calculate risk score based on prediction probability
//   const riskScore = probabilities
//     ? probabilities[1] * 10
//     : // Use actual probability if available
//       prediction === 1
//       ? 7
//       : 3 // Fallback values

//   return (
//     <Card className={prediction === 1 ? "border-red-300" : "border-green-300"}>
//       <CardHeader className={prediction === 1 ? "bg-red-50" : "bg-green-50"}>
//         <CardTitle className="flex items-center gap-2">
//           {prediction === 1 ? (
//             <>
//               <AlertCircle className="h-5 w-5 text-red-500" />
//               <span>Increased Risk Detected</span>
//             </>
//           ) : (
//             <>
//               <CheckCircle2 className="h-5 w-5 text-green-500" />
//               <span>Low Risk Detected</span>
//             </>
//           )}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="pt-6">
//         <p className="mb-4">
//           {prediction === 1
//             ? "Based on the provided information, our model predicts an increased risk of heart disease."
//             : "Based on the provided information, our model predicts a lower risk of heart disease."}
//         </p>

//         {probabilities && (
//           <div className="mb-4">
//             <h3 className="font-medium mb-2">Prediction Confidence:</h3>
//             <div className="flex justify-between mb-1">
//               <span>Low Risk: {(probabilities[0] * 100).toFixed(1)}%</span>
//               <span>High Risk: {(probabilities[1] * 100).toFixed(1)}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2.5">
//               <div
//                 className={`h-2.5 rounded-full ${prediction === 1 ? "bg-red-500" : "bg-green-500"}`}
//                 style={{ width: `${prediction === 1 ? probabilities[1] * 100 : probabilities[0] * 100}%` }}
//               ></div>
//             </div>
//           </div>
//         )}

//         <div className="mb-4">
//           <h3 className="font-medium mb-2">Risk Score: {riskScore.toFixed(1)}</h3>
//           <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div
//               className={`h-2.5 rounded-full ${
//                 riskScore < 3 ? "bg-green-500" : riskScore < 5 ? "bg-yellow-500" : "bg-red-500"
//               }`}
//               style={{ width: `${Math.min(riskScore * 10, 100)}%` }}
//             ></div>
//           </div>
//           <p className="text-xs text-gray-500 mt-1">Score ranges from 0 (lowest risk) to 10 (highest risk)</p>
//         </div>

//         <Alert className={prediction === 1 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
//           <Heart className={`h-4 w-4 ${prediction === 1 ? "text-red-500" : "text-green-500"}`} />
//           <AlertTitle>Important Note</AlertTitle>
//           <AlertDescription>
//             This is not a medical diagnosis. Please consult with a healthcare professional for proper evaluation and
//             advice.
//           </AlertDescription>
//         </Alert>
//         <Recommendations prediction={prediction} />
//       </CardContent>
//       <CardFooter>
//         <Button variant="outline" className="w-full" onClick={onReset}>
//           Start New Prediction
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }
'use client'

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, HeartPulse, Heart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface Props {
  prediction: number;
  probabilities?: number[];
  onReset?: () => void;
  isMockData?: boolean;
}

const PredictionResult: React.FC<Props> = ({ 
  prediction, 
  probabilities = [0.5, 0.5], 
  onReset,
  isMockData = false
}) => {
  const hasDisease = prediction === 1;
  const noDiseaseProbability = (probabilities[0] * 100).toFixed(2);
  const diseaseProb = (probabilities[1] * 100).toFixed(2);
  
  return (
    <Card className={`${hasDisease ? 'border-red-200' : 'border-green-200'}`}>
      <CardHeader className={`${hasDisease ? 'bg-red-50' : 'bg-green-50'} rounded-t-lg`}>
        <CardTitle className="flex items-center gap-2">
          {hasDisease ? (
            <>
              <HeartPulse className="h-5 w-5 text-red-500" />
              <span className="text-red-700">Heart Disease Risk Detected</span>
            </>
          ) : (
            <>
              <Heart className="h-5 w-5 text-green-500" />
              <span className="text-green-700">Low Heart Disease Risk</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="text-center mb-4">
          <p className="text-lg font-medium">
            {hasDisease 
              ? "You may have a higher risk of heart disease." 
              : "You likely do not have heart disease."}
          </p>
          {isMockData && (
            <div className="flex items-center justify-center gap-2 mt-2 text-amber-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Using demo data - connect to backend for accurate results</span>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>No Heart Disease</span>
              <span>{noDiseaseProbability}%</span>
            </div>
            <Progress value={parseFloat(noDiseaseProbability)} className="h-2 bg-gray-100" />
          </div>
          
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span>Heart Disease</span>
              <span>{diseaseProb}%</span>
            </div>
            <Progress value={parseFloat(diseaseProb)} className="h-2 bg-gray-100" />
          </div>
        </div>
        
        <div className="pt-4">
          <h4 className="font-medium mb-2">What does this mean?</h4>
          <p className="text-sm text-gray-600">
            {hasDisease 
              ? "This prediction suggests you may have risk factors associated with heart disease. Please consult with a healthcare professional for proper diagnosis and advice."
              : "Based on the provided information, you have a lower risk of heart disease. However, maintaining a healthy lifestyle is still important."}
          </p>
        </div>
        
        {onReset && (
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="w-full mt-4"
          >
            Start New Prediction
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictionResult;