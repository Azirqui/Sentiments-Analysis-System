"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Heart, AlertCircle, CheckCircle2 } from "lucide-react"
import Recommendations from "./recommendations"

interface PredictionResultProps {
  prediction: number
  probabilities?: number[]
  onReset: () => void
}

export default function PredictionResult({ prediction, probabilities, onReset }: PredictionResultProps) {
  const [riskFactors, setRiskFactors] = useState<string[]>([])

  // Calculate risk score based on prediction probability
  const riskScore = probabilities
    ? probabilities[1] * 10
    : // Use actual probability if available
      prediction === 1
      ? 7
      : 3 // Fallback values

  return (
    <Card className={prediction === 1 ? "border-red-300" : "border-green-300"}>
      <CardHeader className={prediction === 1 ? "bg-red-50" : "bg-green-50"}>
        <CardTitle className="flex items-center gap-2">
          {prediction === 1 ? (
            <>
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Increased Risk Detected</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Low Risk Detected</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="mb-4">
          {prediction === 1
            ? "Based on the provided information, our model predicts an increased risk of heart disease."
            : "Based on the provided information, our model predicts a lower risk of heart disease."}
        </p>

        {probabilities && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Prediction Confidence:</h3>
            <div className="flex justify-between mb-1">
              <span>Low Risk: {(probabilities[0] * 100).toFixed(1)}%</span>
              <span>High Risk: {(probabilities[1] * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${prediction === 1 ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${prediction === 1 ? probabilities[1] * 100 : probabilities[0] * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-medium mb-2">Risk Score: {riskScore.toFixed(1)}</h3>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                riskScore < 3 ? "bg-green-500" : riskScore < 5 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min(riskScore * 10, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Score ranges from 0 (lowest risk) to 10 (highest risk)</p>
        </div>

        <Alert className={prediction === 1 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}>
          <Heart className={`h-4 w-4 ${prediction === 1 ? "text-red-500" : "text-green-500"}`} />
          <AlertTitle>Important Note</AlertTitle>
          <AlertDescription>
            This is not a medical diagnosis. Please consult with a healthcare professional for proper evaluation and
            advice.
          </AlertDescription>
        </Alert>
        <Recommendations prediction={prediction} />
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onReset}>
          Start New Prediction
        </Button>
      </CardFooter>
    </Card>
  )
}
