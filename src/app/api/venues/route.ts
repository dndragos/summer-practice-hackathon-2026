import { NextRequest, NextResponse } from "next/server";
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sportName = searchParams.get("sportName");

  if (!sportName) {
    return NextResponse.json({ error: "sportName is required" }, { status: 400 });
  }

  const query = `sports facilities for ${sportName} near Timisoara, Romania`;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.PLACES_API_KEY;

  if (!apiKey) {
    // Return mock data for hackathon demo if key is missing
    return NextResponse.json({
      results: [
        { name: `Mock ${sportName} Arena`, address: "Strada Mock 1, Timisoara", rating: 4.8 },
        { name: `${sportName} Center Timisoara`, address: "Bulevardul Demo 2, Timisoara", rating: 4.5 },
        { name: `City ${sportName} Club`, address: "Piata Falsa 3, Timisoara", rating: 4.2 }
      ]
    });
  }

  try {
    const response = await client.textSearch({
      params: {
        query: query,
        key: apiKey,
      },
    });

    const results = response.data.results.slice(0, 3).map((place: any) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating || 0,
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Google Places API error:", error);
    return NextResponse.json({ error: "Failed to fetch venues" }, { status: 500 });
  }
}
