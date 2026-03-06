import React from 'react';
import Search_png from '../src/assets/search.png';

const CityCard = ({ 
  weatherData, 
  loading, 
  onSearch, 
  inputRef,
  cityNumber 
}) => {
  return (
    <div className="Card">
      <div className="InputButton">
        <input 
          placeholder={`City Name ${cityNumber}`} 
          type="text" 
          ref={inputRef} 
        />
        <div className="Search">
          <img 
            src={Search_png} 
            onClick={() => onSearch(inputRef.current.value)} 
            alt="search"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="Loading-text">
          <div className="spinner"></div> 
          Loading...
        </div>
      ) : weatherData ? (
        <div className="Weather-div">
          <h3>{weatherData.location.toUpperCase()}</h3>
          <div className="Line"></div>
          <div className="text">
            <p>TEMPERATURE: <span>{weatherData.temperature}°C</span></p>
            <p>HUMIDITY: <span>{weatherData.humidity}%</span></p>
            <p>WIND SPEED: <span>{weatherData.windSpeed} m/s</span></p>
          </div>
        </div>
      ) : (
        <div className="Error-text">Error loading data</div>
      )}
    </div>
  );
};

export default CityCard;