import { useEffect, useState, useRef } from "react";
import './Weather.css'
import './Spinner.css'
import Search_png from '../src/assets/search.png';

const Weather = () => {
    const inputRef1 = useRef();
    const inputRef2 = useRef();
    const [weatherData1, setWeatherData1] = useState(null);
    const [weatherData2, setWeatherData2] = useState(null);
    const [loading1, setLoading1] = useState(false);  // Состояние загрузки
    const [loading2, setLoading2] = useState(false);

    const search = async (city, setWeatherData, setLoading) => {
        setLoading(true);  // Начать загрузку пока добывается информация
        try {
            const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + import.meta.env.VITE_APP_ID;
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            const icon = data.weather[0].icon; // Пока что не используется

            setWeatherData({
                location: data.name,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                icon: icon,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);  // Прекратить загрузки после добытой информации
        }
    };

    useEffect(() => {
        search("Gudermes", setWeatherData1, setLoading1); // Дефолтные города
        search("Grozny", setWeatherData2, setLoading2);
    }, []);

    // Расчитываем разницу и показываем див с разницей после
    const calculateDifference = () => {
        if (weatherData1 && weatherData2) {
            const tempDifference = weatherData1.temperature - weatherData2.temperature;
            const humidityDifference = weatherData1.humidity - weatherData2.humidity;
            const FixedDifference = weatherData1.windSpeed - weatherData2.windSpeed // Здесь храним разницу температуры, но возвращает слишком большое число
            const windSpeedDifference = FixedDifference.toFixed(2); // Поэтому здесь даем лимит до трех чисел (это превращает числа в текст)

            return ( // Покажет разницу температуры
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
        return ( // Пока данные не получены, покажет этот див но без информации, без этого дива, див сверху не показывался бы пока не будут получены данные, что выглядит не красиво
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
                <div className="Card">
                    <div className="InputButton">
                        <input placeholder="City Name 1" type="text" ref={inputRef1} />
                        <div className="Search">
                            <img src={Search_png} onClick={() => search(inputRef1.current.value, setWeatherData1, setLoading1)}></img>
                        </div>
                    </div>
                    {loading1 ? ( // Если данные не получены показывай загрузку
                        <div className="Loading-text"> <div className="spinner"></div> Loading...</div> // spinner Анимированный круг
                    ) : weatherData1 ? ( // это проверяет есть ли информация про этот город, то-есть получен ли api объект, без него не показывало бы всю страницу, а так если не получилось получить данные, просто не покажет то что снизу, а не всю страницу
                        <div className="Weather-div">
                            <h3>{weatherData1.location.toUpperCase()}</h3>
                            <div className="Line"></div>
                            <div className="text">
                                <p>TEMPERATURE: <span>{weatherData1.temperature}°C</span></p>
                                <p>HUMIDITY: <span>{weatherData1.humidity}%</span></p>
                                <p>WIND SPEED: <span>{weatherData1.windSpeed} m/s</span></p>
                            </div>
                        </div>
                    ) : (
                        <div className="Error-text">Error loading data</div>
                    )}
                </div>

                {calculateDifference()}

                <div className="Card">
                    <div className="InputButton">
                        <input placeholder="City Name 2" type="text" ref={inputRef2} />
                        <div className="Search">
                            <img src={Search_png} onClick={() => search(inputRef2.current.value, setWeatherData2, setLoading2)}></img>
                        </div>
                    </div>

                    {loading2 ? (
                        <div className="Loading-text"> <div className="spinner"></div> Loading...</div>
                    ) : weatherData2 ? (
                        <div className="Weather-div">
                            <h3>{weatherData2.location.toUpperCase()}</h3>
                            <div className="Line"></div>
                            <div className="text">
                                <p>TEMPERATURE: <span>{weatherData2.temperature}°C</span></p>
                                <p>HUMIDITY: <span>{weatherData2.humidity}%</span></p>
                                <p>WIND SPEED: <span>{weatherData2.windSpeed} m/s</span></p>
                            </div>
                        </div>
                    ) : (
                        <div className="Error-text">Error loading data</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Weather;

// Добавлена загрузка и див с разницей покажется даже пока не получены данные