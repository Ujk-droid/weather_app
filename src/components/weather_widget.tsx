"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

export default function WeatherWidget() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid location");
      setWeather(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );
      if (!response.ok) {
        throw new Error("City not found.");
      }

      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  function getTemperatureMessage(temperature: number, unit: string): string {
    if (unit === "C") {
      if (temperature < 0) {
        return `It's freezing at ${temperature}°C! Bundle up!`;
      } else if (temperature < 10) {
        return `It's cold at ${temperature}°C. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `It's chilly at ${temperature}°C. Comfortable with a light jacket.`;
      } else if (temperature < 30) {
        return `It's pleasant at ${temperature}°C. Enjoy the nice weather!`;
      } else if (temperature < 40) {
        return `It's warm at ${temperature}°C. Very hot, wear light clothing.`;
      } else if (temperature < 50) {
        return `It's warm at ${temperature}°C. Very hot, wear light clothing and drink water.`;
      } else {
        return `${temperature}° ${unit}`;
      }
    }
    return "";
  }

  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Some clouds and sunshine.";
      case "cloudy":
        return "It's cloudy today.";
      case "overcast":
        return "The sky is overcast.";
      case "rain":
        return "Don't forget your umbrella, it's raining!";
      case "storm":
        return "Thunderstorms are expected today.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return description;
    }
  }

  function getLocationMessage(location: string): string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;
    return `${location} ${isNight ? "at night" : "during the day"}`;
  }

  return (
    <div
      className="flex justify-center items-center h-screen bg-gradient-to-r from-orange-200 via-blue-300 to-red-300 "
    
    >
      <Card className="w-full max-w-md mx-auto text-center bg-red-100">
        <CardHeader>
          <CardTitle className="text-blue-800 text-3xl">Weather Widget</CardTitle>
          <CardDescription  className="text-blue-800 text-2xl">Search current weather in this city.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input  className="text-blue-800"
              type="text"
              placeholder="Enter a city name"
              value={location}
              onChange={handleLocationChange}
            />
            <Button   className="text-blue-800 " type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </form>
          {error && <div className="mt-4 text-red-500">{error}</div>}
          {weather && (
            <div className="mt-4 grid gap-2">
              <div className="flex items-center gap-2">
                <ThermometerIcon className="w-6 h-6 bg-gradient-to-r from-orange-200 via-blue-300 to-red-300" />
                {getTemperatureMessage(weather.temperature, weather.unit)}
              </div>
              <div className="flex items-center gap-2">
                <CloudIcon className="w-6 h-6 bg-gradient-to-r from-orange-200 via-blue-300 to-red-300" />
                {getWeatherMessage(weather.description)}
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 bg-gradient-to-r from-orange-200 via-blue-300 to-red-300" />
                {getLocationMessage(weather.location)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
