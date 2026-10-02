import { Image, StyleSheet, Text, View } from 'react-native';

export default function DriverMap() {
  const token = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;
  return <View style={[StyleSheet.absoluteFill, { backgroundColor: '#e3edf2' }]}>{token ? <Image source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/17.0832,-22.5609,12/700x1000?access_token=' + token }} style={StyleSheet.absoluteFill} accessibilityLabel="Windhoek map preview" /> : <Text>Map unavailable</Text>}</View>;
}
