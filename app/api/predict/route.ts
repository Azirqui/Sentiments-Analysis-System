import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Make a request to the Flask backend
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        age: data[0],
        sex: data[1],
        cp: data[2],
        trestbps: data[3],
        chol: data[4],
        fbs: data[5],
        restecg: data[6],
        thalach: data[7],
        exang: data[8],
        oldpeak: data[9],
        slope: data[10],
        ca: data[11],
        thal: data[12]
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error connecting to backend:', error);
    
    // Return mock data for development/fallback
    return NextResponse.json({
      prediction: 1,
      probabilities: [0.3, 0.7],
      mockData: true,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}