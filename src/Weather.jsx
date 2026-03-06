import { useEffect, useState, useRef } from "react";
import './Weather.css';
import './Spinner.css';
import CityCard from "./city-card";

const Weather = () => {
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  
  const [weatherData1, setWeatherData1] = useState(null);
  const [weatherData2, setWeatherData2] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const search = async (city, setWeatherData, setLoading) => {
    if (!city) return; // Добавляем проверку на пустой город
    
    setLoading(true);
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setWeatherData({
          location: data.name,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          icon: data.weather[0].icon,
        });
      } else {
        console.error("City not found");
        setWeatherData(null); // Сбрасываем данные если город не найден
      }
    } catch (error) {
      console.log(error);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Оборачиваем функции поиска для каждого города
  const handleSearch1 = (city) => search(city, setWeatherData1, setLoading1);
  const handleSearch2 = (city) => search(city, setWeatherData2, setLoading2);

  useEffect(() => {
    handleSearch1("Gudermes");
    handleSearch2("Grozny");
  }, []);

  const calculateDifference = () => {
    // Разница показывается только когда есть оба набора данных
    if (weatherData1 && weatherData2) {
      const tempDifference = weatherData1.temperature - weatherData2.temperature;
      const humidityDifference = weatherData1.humidity - weatherData2.humidity;
      const windSpeedDifference = (weatherData1.windSpeed - weatherData2.windSpeed).toFixed(2);

      return (
        <div className="Card-difference">
          <div>
            <h1>DIFFERENCE</h1>
            <div className="Difference-text">
              <p>TEMPERATURE DIFFERENCE: <span>{tempDifference}°C</span></p>
              <p>HUMIDITY DIFFERENCE: <span>{humidityDifference}%</span></p>
              <p>WIND SPEED DIFFERENCE: <span>{windSpeedDifference} m/s</span></p>
            </div>
          </div>
        </div>
      );
    }
    
    // Показываем заглушку пока нет данных
    return (
      <div className="Card-difference">
        <div>
          <h1>DIFFERENCE</h1>
          <div className="Difference-text">
            <p>Temperature Difference: <span>—</span></p>
            <p>Humidity Difference: <span>—</span></p>
            <p>Wind Speed Difference: <span>—</span></p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="Container">
      <div className="Header">
        <h4>CITY TEMPERATURE DIFFERENCE</h4>
      </div>

      <div className="Card-container">
        <CityCard
          weatherData={weatherData1}
          loading={loading1}
          onSearch={handleSearch1}
          inputRef={inputRef1}
          cityNumber={1}
        />

        {calculateDifference()}

        <CityCard
          weatherData={weatherData2}
          loading={loading2}
          onSearch={handleSearch2}
          inputRef={inputRef2}
          cityNumber={2}
        />
      </div>
    </div>
  );
};

export default Weather;