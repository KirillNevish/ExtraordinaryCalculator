import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, FlatList, Image, StyleSheet, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

const STORAGE_KEY = 'SAVED_IMAGES';

const HiddenPhotos = ({ navigation }: any) => {
    const [selectedImages, setSelectedImages] = useState<any[]>([]);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    useEffect(() => {
        const loadSavedImages = async () => {
            try {
                const savedImages = await AsyncStorage.getItem(STORAGE_KEY);
                if (savedImages) {
                    setSelectedImages(JSON.parse(savedImages));
                }
            } catch (err) {
                console.error('Error loading saved images:', err);
            }
        };

        loadSavedImages();
    }, []);

    // Save images to AsyncStorage
    const saveImagesToStorage = async (images: any[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(images));
        } catch (err) {
            console.error('Error saving images:', err);
        }
    };


    const choosePhotosFromGallery = () => {
        ImagePicker.openPicker({
            multiple: true,
            cropping: false,
            mediaType: 'photo',
        })
            .then((images) => {
                const updatedImages = [...selectedImages, ...images];
                setSelectedImages(updatedImages);
                saveImagesToStorage(updatedImages); // Save updated images to storage
                Alert.alert('Images Selected', `${images.length} images added.`);
            })
            .catch((err) => {
                console.error('Error fetching images from gallery:', err);
            });
    };

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
        })
            .then((image) => {
                const updatedImages = [...selectedImages, image];
                setSelectedImages(updatedImages);
                saveImagesToStorage(updatedImages); // Save updated images to storage
                Alert.alert('Image Captured', 'Photo added successfully.');
            })
            .catch((err) => {
                console.error('Error taking photo:', err);
            });
    };

    const toggleFullscreen = (imagePath: string | null) => {
        setFullscreenImage(imagePath);
    };

    const removeImage = (imagePath: string) => {
        const updatedImages = selectedImages.filter((img) => img.path !== imagePath);
        setSelectedImages(updatedImages);
        saveImagesToStorage(updatedImages);
        setFullscreenImage(null); // Close the modal
        Alert.alert('Image Removed', 'The image has been successfully removed.');
    };

    return (
        <View style={styles.container}>

            {/* Button to navigate back */}
            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#f54242' }]}
                onPress={() => navigation.navigate('Calculator')}
            >
                <Text style={styles.buttonText}>Back to Calculator</Text>
            </TouchableOpacity>

            {/* Button to choose photos */}
            <TouchableOpacity style={styles.button} onPress={choosePhotosFromGallery}>
                <Text style={styles.buttonText}>Choose Photos from Gallery</Text>
            </TouchableOpacity>

            {/* Button to take a photo */}
            <TouchableOpacity style={styles.button} onPress={takePhotoFromCamera}>
                <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            {selectedImages.length > 0 && (
                <View style={styles.imageList}>
                    {selectedImages.map((item, index) => (
                        <Pressable key={index} onPress={() => toggleFullscreen(item.path)}>
                            <Image source={{ uri: item.path }} style={styles.image} />
                        </Pressable>
                    ))}
                </View>
            )}

            {/* Fullscreen Modal */}
            {fullscreenImage && (
                <Modal visible={true} transparent={true}>
                    <Pressable style={styles.modalBackground} onPress={() => toggleFullscreen(null)}>
                        <Image source={{ uri: fullscreenImage }} style={styles.fullscreenImage} />


                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeImage(fullscreenImage)}
                        >
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#101010' },
    button: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#5C0DF6',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16 },
    imageList: {
        marginTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: "center"
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#e0e0e0',
    },

    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreenImage: {
        width: '90%',
        height: '80%',
        resizeMode: 'contain',
    },

    removeButton: {
        position: 'absolute',
        bottom: 80,
        backgroundColor: '#f54242',
        padding: 10,
        borderRadius: 5,
    },
    removeButtonText: { color: '#fff', fontSize: 16 },
    closeModal: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#5C0DF6',
        padding: 10,
        borderRadius: 5,
    },
    closeModalText: { color: '#fff', fontSize: 16 },
});

export default HiddenPhotos;
