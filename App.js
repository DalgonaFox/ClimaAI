import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Button, Card, Icon } from 'react-native-elements';
import axios from 'axios';
import moment from 'moment'; // Importe a biblioteca moment.js

const API_KEY = '08085d25'; // Substitua pela sua chave API

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

  const formatDate = (dateString) => {
    // Use moment.js para formatar a data
    const date = moment(dateString, 'YYYY-MM-DD'); // Crie um objeto moment a partir da string
    return date.format('LLLL'); // Formate a data como você quiser
  };

  if (!weatherData) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {formatDate(weatherData.date)}
        </Text>
        <Text style={styles.headerText}>
          {weatherData.temp}°C - {weatherData.description}
        </Text>
      </View>
      <View style={styles.body}>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>
            <Icon name="wind" type="font-awesome-5" />{' '}
            {weatherData.wind_speedy} km/h
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>
            <Icon name="cloud-rain" type="font-awesome-5" />{' '}
            {weatherData.humidity}% umidade
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoText}>
            <Icon name="cloud-showers-heavy" type="font-awesome-5" />{' '}
            {weatherData.rain}% de chuva
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <FlatList
          data={weatherData.forecast.slice(0, 5)}
          horizontal
          renderItem={({ item }) => (
            <Card containerStyle={styles.forecastCard}>
              <Text style={styles.forecastDate}>
                {formatDate(item.date)}
              </Text>
              <Icon
                name={item.condition_icon}
                type="font-awesome-5"
                size={30}
                color="#000"
              />
              <Text style={styles.forecastTemp}>{item.temp}°C</Text>
            </Card>
          )}
          keyExtractor={(item) => item.date.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
  },
  footer: {
    flex: 1,
    padding: 20,
  },
  forecastCard: {
    width: 100,
    height: 150,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forecastDate: {
    fontSize: 12,
    marginBottom: 10,
  },
  forecastTemp: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;