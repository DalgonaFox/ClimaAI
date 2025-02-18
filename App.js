import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';

const API_KEY = '08085d25';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.hgbrasil.com/weather?key=${API_KEY}&user_ip=remote`
      );
      setWeatherData(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  // Função para obter a data e hora atuais em português
  const getCurrentDateTime = () => {
    const now = new Date();
    moment.locale('pt-br'); // Define o locale como pt-br
    return moment(now).format('LLLL').charAt(0).toUpperCase() + moment(now).format('LLLL').slice(1);
  };

  // Função para corrigir a hora da API
  const fixHour = (hour) => {
    const [hours, minutes, seconds] = hour.split(':').map(Number);
    const correctedHours = (hours - 3 + 24) % 24;
    return `${correctedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!weatherData) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            {getCurrentDateTime()}
          </Text>
          <Text style={styles.headerText}>
            {weatherData.city_name}
          </Text>
        </View>
        <View style={styles.body}>
          <View style={styles.tempContainer}>
            <Text style={styles.tempText}>{weatherData.temp}°C</Text>
            <Text style={styles.descriptionText}>{weatherData.description}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Icon name="wind" type="font-awesome-5" size={32} />
            <Text style={styles.detailText}>
              {weatherData.wind_speedy} km/h
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="cloud-rain" type="font-awesome-5" size={32} />
            <Text style={styles.detailText}>
              {weatherData.humidity}% umidade
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="cloud-showers-heavy" type="font-awesome-5" size={32} />
            <Text style={styles.detailText}>
              {weatherData.rain} mm de chuva
            </Text>
          </View>
        </View>
        <View style={styles.forecastContainer}>
          <FlatList
            data={weatherData.forecast.slice(0, 5)}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.forecastItem}>
                <Text style={styles.forecastDate}>
                  {moment(item.date, 'DD/MM').format('ddd')}
                </Text>
                <Icon
                  name={getIconName(item.condition)}
                  type="ionicon"
                  size={32}
                  color="#000"
                />
                <Text style={styles.forecastTemp}>
                  {item.max}°C / {item.min}°C
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.date}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const getIconName = (condition) => {
  switch (condition) {
    case 'clear-day':
      return 'sunny-outline';
    case 'clear-night':
      return 'moon-outline';
    case 'rain':
      return 'rainy-outline';
    case 'snow':
      return 'snow-outline';
    case 'sleet':
      return 'cloudy-night'; 
    case 'wind':
      return 'wind-outline';
    case 'fog':
      return 'fog-outline';
    case 'cloudy':
      return 'cloudy-outline';
    case 'partly-cloudy-day':
      return 'partly-sunny-outline';
    case 'partly-cloudy-night':
      return 'cloudy-night';
    default:
      return 'cloud-outline';
  }
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  body: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  tempContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  tempTextContainer: {
    alignItems: 'center',
  },
  tempText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 24,
  },
  iconContainer: {
    alignItems: 'center',
  },
  icon: {
    width: 150,
    height: 150,
  },
  details: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  detailItem: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 18,
    marginTop: 5,
  },
  forecastContainer: {
    flex: 1,
    padding: 20,
  },
  forecastItem: {
    alignItems: 'center',
    width: 80,
    marginRight: 20,
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  forecastIcon: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  forecastTemp: {
    fontSize: 14,
  },
});

export default App;