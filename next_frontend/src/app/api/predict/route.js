import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  try {
    const data = await req.json();

    // The FastAPI backend is running on port 8000
    const FASTAPI_URL = 'http://127.0.0.1:8000/predict';

    // Forward the request to the Python ML server
    const response = await axios.post(FASTAPI_URL, data);

    // Return the prediction to the Next.js frontend
    return NextResponse.json(response.data);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx (e.g. 422 Unprocessable Entity)
      console.error("FastAPI Error:", error.response.data);
      return NextResponse.json(
        { error: error.response.data.detail || "Validation error from the ML backend." },
        { status: error.response.status }
      );
    } else {
      console.error("Node.js Proxy Error:", error.message);
      // Provide a clear error message
      return NextResponse.json(
        { error: "Failed to communicate with the ML backend. Ensure FastAPI is running." },
        { status: 502 }
      );
    }
  }
}
