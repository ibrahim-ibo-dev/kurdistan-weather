export interface KLocation {
  id: string;
  nameKu: string;
  nameEn: string;
  lat: number;
  lon: number;
}

export type ConditionId =
  | "clear"
  | "partly_cloudy"
  | "cloudy"
  | "overcast"
  | "fog"
  | "mist"
  | "haze"
  | "dust"
  | "wind"
  | "drizzle"
  | "freezing_drizzle"
  | "rain_light"
  | "rain_moderate"
  | "rain_heavy"
  | "freezing_rain"
  | "sleet"
  | "snow_light"
  | "snow"
  | "snow_heavy"
  | "thunderstorm"
  | "thunderstorm_hail";

export type SkyPhase = "day" | "night" | "dawn" | "dusk";

export interface ConditionInfo {
  id: ConditionId;
  labelKu: string;
  labelEn: string;
}

export interface CurrentWeather {
  time: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
  cloudCover: number;
  precipitation: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
  visibility: number;
  precipProb: number;
}

export interface HourlyPoint {
  time: string;
  temp: number;
  weatherCode: number;
  isDay: boolean;
  precipProb: number;
  precip: number;
  windSpeed: number;
  humidity: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
}

export interface DailyPoint {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
  precipSum: number;
  precipProbMax: number;
  uvIndexMax: number;
  windSpeedMax: number;
  windDirection: number;
  hours: HourlyPoint[];
}

export interface LocationWeather {
  location: KLocation;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  fetchedAt: number;
}

export interface CitySummary {
  location: KLocation;
  temp: number;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  isDay: boolean;
  precipProbMax: number;
}
