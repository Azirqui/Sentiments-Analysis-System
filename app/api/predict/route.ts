import { type NextRequest, NextResponse } from "next/server"

// Mock data for predictions
const MOCK_PREDICTIONS = [
  { prediction: 0, probabilities: [0.85, 0.15] },
  { prediction: 1, probabilities: [0.25, 0.75] },
]

export async function POST(request: NextRequest) {
  try {
    // Parse the request body - handle any input format
    let data
    try {
      data = await request.json()
    } catch (error) {
      // If parsing fails, use default data
      data = [50, 1, 0, 120, 200, 0, 0, 150, 0, 0, 0, 0, 0]
    }

    // Ensure data is an array
    if (!Array.isArray(data)) {
      data = Object.values(data)
    }

    // If array is empty or invalid, use default values
    if (!data.length) {
      data = [50, 1, 0, 120, 200, 0, 0, 150, 0, 0, 0, 0, 0]
    }

    // Convert all values to numbers
    const numericData = data.map((val) => Number(val) || 0)

    // Generate a deterministic prediction based on input data
    // This ensures consistent results for the same inputs
    const sum = numericData.reduce((acc, val) => acc + val, 0)

    // Create more varied predictions based on the input data
    let predictionIndex

    // Use different factors to determine prediction
    if (numericData[0] > 60) {
      // Age > 60
      predictionIndex = 1 // Higher risk for older people
    } else if (numericData[4] > 240) {
      // Cholesterol > 240
      predictionIndex = 1 // Higher risk for high cholesterol
    } else if (numericData[3] > 140) {
      // Blood pressure > 140
      predictionIndex = 1 // Higher risk for high blood pressure
    } else if (numericData[7] < 120) {
      // Max heart rate < 120
      predictionIndex = 1 // Higher risk for low max heart rate
    } else if (numericData[2] === 3) {
      // Asymptomatic chest pain
      predictionIndex = 1 // Higher risk for asymptomatic chest pain
    } else {
      // Default to lower risk
      predictionIndex = 0
    }

    // Get the prediction result
    const mockResult = MOCK_PREDICTIONS[predictionIndex]

    // Adjust probabilities to be more varied based on input
    const adjustedProbabilities = [...mockResult.probabilities]

    // Make probabilities more dynamic based on input values
    if (predictionIndex === 1) {
      // For high risk, adjust probability based on risk factors
      const riskFactorCount = [
        numericData[0] > 60, // Age > 60
        numericData[1] === 1, // Male
        numericData[2] === 3, // Asymptomatic chest pain
        numericData[3] > 140, // High blood pressure
        numericData[4] > 240, // High cholesterol
        numericData[5] === 1, // High fasting blood sugar
        numericData[7] < 120, // Low max heart rate
        numericData[8] === 1, // Exercise induced angina
        numericData[9] > 1.0, // ST depression
        numericData[10] === 2, // Downsloping ST segment
        numericData[11] > 0, // Major vessels affected
        numericData[12] === 2, // Reversible defect
      ].filter(Boolean).length

      // Adjust probability based on number of risk factors (0.6 to 0.95)
      const highRiskProb = 0.6 + (riskFactorCount / 12) * 0.35
      adjustedProbabilities[0] = 1 - highRiskProb
      adjustedProbabilities[1] = highRiskProb
    } else {
      // For low risk, make probability more varied
      const protectiveFactorCount = [
        numericData[0] < 50, // Age < 50
        numericData[1] === 0, // Female
        numericData[2] < 2, // Less severe chest pain
        numericData[3] < 120, // Normal blood pressure
        numericData[4] < 200, // Normal cholesterol
        numericData[5] === 0, // Normal fasting blood sugar
        numericData[7] > 150, // Good max heart rate
        numericData[8] === 0, // No exercise induced angina
        numericData[9] < 0.5, // Low ST depression
        numericData[10] === 0, // Upsloping ST segment
        numericData[11] === 0, // No major vessels affected
        numericData[12] === 0, // Normal
      ].filter(Boolean).length

      // Adjust probability based on protective factors (0.7 to 0.95)
      const lowRiskProb = 0.7 + (protectiveFactorCount / 12) * 0.25
      adjustedProbabilities[0] = lowRiskProb
      adjustedProbabilities[1] = 1 - lowRiskProb
    }

    // Return prediction with adjusted probabilities
    return NextResponse.json({
      prediction: mockResult.prediction,
      probabilities: adjustedProbabilities,
      mockData: true,
    })
  } catch (error) {
    console.error("Error in prediction API:", error)

    // Even if there's an error, return a valid prediction
    return NextResponse.json({
      prediction: 0,
      probabilities: [0.7, 0.3],
      mockData: true,
      error: "An error occurred, showing default prediction",
    })
  }
}
