import React from 'react';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import './src/services/i18n'; // i18n konfigürasyonunu yükle

export default function App() {
  return (
    <>
      <HomeScreen />
      <StatusBar style="auto" />
    </>
  );
} 