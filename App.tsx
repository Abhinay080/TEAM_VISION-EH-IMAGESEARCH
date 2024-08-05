import React, { useState } from 'react';
import { View, Text, FlatList, Image as NativeImage, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

interface UnsplashImage {
  id: number;
  url: string;
  description: string;
  user: string;
  profile_image: string;
}

const ExampleComponent = () => {
  const [query, setQuery] = useState<string>('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    if (query.length > 0) {
      setLoading(true);
      axios.get(`http://10.0.2.2:5000/api/images?query=${query}`)
        .then(response => {
          const typedImages: UnsplashImage[] = response.data;
          setImages(typedImages);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching images:', error);
          setError('Failed to fetch images. Please try again.');
          setLoading(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search images..."
        value={query}
        onChangeText={setQuery}
      />
      <Button
        title="Search"
        onPress={handleSearch}
        color="#007BFF"
      />
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <NativeImage source={{ uri: item.url }} style={styles.image} />
            <Text>{item.description}</Text>
            <Text>Photo by {item.user}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  item: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
  },
  error: {
    color: 'red',
  },
});

export default ExampleComponent;
