"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, InfoIcon } from "lucide-react"
import PredictionResult from "./result"

// Define feature ranges from the Python model
const FEATURE_RANGES = {
  age: { min: 18, max: 100, step: 1 },
  sex: {
    options: [
      { value: "0", label: "Female" },
      { value: "1", label: "Male" },
    ],
  },
  cp: {
    options: [
      { value: "0", label: "Typical Angina" },
      { value: "1", label: "Atypical Angina" },
      { value: "2", label: "Non-anginal Pain" },
      { value: "3", label: "Asymptomatic" },
    ],
  },
  trestbps: { min: 80, max: 200, step: 1 },
  chol: { min: 100, max: 600, step: 1 },
  fbs: {
    options: [
      { value: "0", label: "No (< 120 mg/dl)" },
      { value: "1", label: "Yes (> 120 mg/dl)" },
    ],
  },
  restecg: {
    options: [
      { value: "0", label: "Normal" },
      { value: "1", label: "ST-T Wave Abnormality" },
      { value: "2", label: "Left Ventricular Hypertrophy" },
    ],
  },
  thalach: { min: 60, max: 220, step: 1 },
  exang: {
    options: [
      { value: "0", label: "No" },
      { value: "1", label: "Yes" },
    ],
  },
  oldpeak: { min: 0, max: 6.5, step: 0.1 },
  slope: {
    options: [
      { value: "0", label: "Upsloping" },
      { value: "1", label: "Flat" },
      { value: "2", label: "Downsloping" },
    ],
  },
  ca: {
    options: [
      { value: "0", label: "0" },
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
    ],
  },
  thal: {
    options: [
      { value: "0", label: "Normal" },
      { value: "1", label: "Fixed Defect" },
      { value: "2", label: "Reversible Defect" },
      { value: "3", label: "Unknown" },
    ],
  },
}

// Feature descriptions for tooltips
const FEATURE_DESCRIPTIONS = {
  age: "Age in years",
  sex: "Gender (0 = female, 1 = male)",
  cp: "Chest pain type",
  trestbps: "Resting blood pressure (in mm Hg)",
  chol: "Serum cholesterol in mg/dl",
  fbs: "Fasting blood sugar > 120 mg/dl",
  restecg: "Resting electrocardiographic results",
  thalach: "Maximum heart rate achieved",
  exang: "Exercise induced angina",
  oldpeak: "ST depression induced by exercise relative to rest",
  slope: "Slope of the peak exercise ST segment",
  ca: "Number of major vessels colored by fluoroscopy",
  thal: "Thalassemia (a blood disorder)",
}

export default function PredictPage() {
  const [formData, setFormData] = useState({
    age: 50,
    sex: "1",
    cp: "0",
    trestbps: 120,
    chol: 200,
    fbs: "0",
    restecg: "0",
    thalach: 150,
    exang: "0",
    oldpeak: 0,
    slope: "0",
    ca: "0",
    thal: "0",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [prediction, setPrediction] = useState<number | null>(null)
  const [probabilities, setProbabilities] = useState<number[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMockData, setIsMockData] = useState(false)

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Check each field against its range
    Object.entries(formData).forEach(([key, value]) => {
      const range = FEATURE_RANGES[key as keyof typeof FEATURE_RANGES]

      if ("min" in range && "max" in range) {
        const numValue = Number(value)
        if (isNaN(numValue) || numValue < range.min || numValue > range.max) {
          newErrors[key] = `Must be between ${range.min} and ${range.max}`
        }
      } else if ("options" in range) {
        const validOptions = range.options.map((opt) => opt.value)
        if (!validOptions.includes(value.toString())) {
          newErrors[key] = "Please select a valid option"
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      // Convert form data to the format expected by the model
      const modelInput = Object.entries(formData).map(([key, value]) => {
        return typeof value === "string" ? Number.parseInt(value, 10) : value
      })

      // Call the prediction API
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modelInput),
      })

      // Try to parse the response as JSON
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        console.error("Failed to parse response as JSON:", jsonError)
        throw new Error("Failed to parse response")
      }

      // Check if the response contains an error
      if (data.error) {
        console.warn("API returned an error but with mock data:", data.error)
      }

      // Set the prediction and probabilities
      setPrediction(data.prediction)
      setProbabilities(data.probabilities || null)
      setIsMockData(data.mockData || false)
    } catch (error) {
      console.error("Error making prediction:", error)

      // Set mock data for demonstration purposes
      setPrediction(1)
      setProbabilities([0.3, 0.7])
      setIsMockData(true)

      setErrors({
        form: `We're experiencing technical difficulties with our prediction service. Showing demo results instead.`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetPrediction = () => {
    setPrediction(null)
    setProbabilities(null)
    setIsMockData(false)
  }

  const renderField = (name: keyof typeof FEATURE_RANGES, label: string) => {
    const range = FEATURE_RANGES[name]

    if ("options" in range) {
      return (
        <div className="space-y-2">
          <Label htmlFor={name} className="flex items-center gap-1">
            {label}
            <span className="text-xs text-gray-500" title={FEATURE_DESCRIPTIONS[name]}>
              (?)
            </span>
          </Label>
          <Select value={formData[name].toString()} onValueChange={(value) => handleInputChange(name, value)}>
            <SelectTrigger id={name} className={errors[name] ? "border-red-500" : ""}>
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {range.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
        </div>
      )
    } else if ("min" in range && "max" in range) {
      if (name === "oldpeak") {
        return (
          <div className="space-y-2">
            <Label htmlFor={name} className="flex items-center gap-1">
              {label}
              <span className="text-xs text-gray-500" title={FEATURE_DESCRIPTIONS[name]}>
                (?)
              </span>
            </Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Slider
                  id={name}
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  value={[Number(formData[name])]}
                  onValueChange={(value) => handleInputChange(name, value[0])}
                  className={errors[name] ? "border-red-500" : ""}
                />
              </div>
              <Input
                type="number"
                value={formData[name]}
                onChange={(e) => handleInputChange(name, Number.parseFloat(e.target.value))}
                className="w-20"
                min={range.min}
                max={range.max}
                step={range.step}
              />
            </div>
            {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
          </div>
        )
      }

      return (
        <div className="space-y-2">
          <Label htmlFor={name} className="flex items-center gap-1">
            {label}
            <span className="text-xs text-gray-500" title={FEATURE_DESCRIPTIONS[name]}>
              (?)
            </span>
          </Label>
          <Input
            id={name}
            type="number"
            value={formData[name]}
            onChange={(e) => handleInputChange(name, Number.parseInt(e.target.value, 10))}
            min={range.min}
            max={range.max}
            step={range.step}
            className={errors[name] ? "border-red-500" : ""}
          />
          {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
        </div>
      )
    }

    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Heart Disease Prediction Test</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fill in your health information below to get an assessment of your heart disease risk. All fields are
            required for an accurate prediction.
          </p>
        </div>

        <Alert className="mb-6 bg-gray-100 border-gray-200">
          <InfoIcon className="h-4 w-4 text-darkblue" />
          <AlertTitle className="text-darkblue">Demo Mode</AlertTitle>
          <AlertDescription className="text-gray-700">
            This is an AI trained model, results might fluctuate from actual ones. This is for educational purposes
            only.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Health Data</CardTitle>
              <CardDescription>Please provide accurate information for the most reliable results.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {renderField("age", "Age")}
                  {renderField("sex", "Gender")}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {renderField("cp", "Chest Pain Type")}
                  {renderField("trestbps", "Resting Blood Pressure")}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {renderField("chol", "Cholesterol")}
                  {renderField("fbs", "Fasting Blood Sugar")}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {renderField("restecg", "Resting ECG")}
                  {renderField("thalach", "Max Heart Rate")}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {renderField("exang", "Exercise Induced Angina")}
                  {renderField("oldpeak", "ST Depression")}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {renderField("slope", "ST Slope")}
                  {renderField("ca", "Number of Major Vessels")}
                </div>

                <div className="grid grid-cols-1 gap-4">{renderField("thal", "Thalassemia")}</div>

                {errors.form && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Note</AlertTitle>
                    <AlertDescription>{errors.form}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-darkblue hover:bg-opacity-90" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Get Prediction"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Understanding the Parameters</CardTitle>
                <CardDescription>Learn about the health metrics used in our prediction model.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Chest Pain Type (cp)</h3>
                  <p className="text-sm text-gray-600">
                    0: Typical angina, 1: Atypical angina, 2: Non-anginal pain, 3: Asymptomatic
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Resting ECG (restecg)</h3>
                  <p className="text-sm text-gray-600">
                    0: Normal, 1: ST-T wave abnormality, 2: Left ventricular hypertrophy
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">ST Slope (slope)</h3>
                  <p className="text-sm text-gray-600">0: Upsloping, 1: Flat, 2: Downsloping</p>
                </div>
                <div>
                  <h3 className="font-medium">Number of Major Vessels (ca)</h3>
                  <p className="text-sm text-gray-600">Number of major vessels (0-4) colored by fluoroscopy</p>
                </div>
                <div>
                  <h3 className="font-medium">Thalassemia (thal)</h3>
                  <p className="text-sm text-gray-600">0: Normal, 1: Fixed defect, 2: Reversible defect, 3: Unknown</p>
                </div>
              </CardContent>
            </Card>

            {prediction !== null && (
              <PredictionResult
                prediction={prediction}
                probabilities={probabilities || undefined}
                onReset={resetPrediction}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
