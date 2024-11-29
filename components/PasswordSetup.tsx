import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    PasswordSetup: undefined;
    Calculator: undefined;
    HiddenPhotos: undefined;
};

type PasswordSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PasswordSetup'>;

interface PasswordSetupProps {
    navigation: PasswordSetupScreenNavigationProp;
}

const PasswordSetup: React.FC<PasswordSetupProps> = ({ navigation }) => {
    const [password, setPassword] = useState('');

    useEffect(() => {
        const checkPassword = async () => {
            const savedPassword = await AsyncStorage.getItem('calculator_password');
            if (savedPassword) {
                // Redirect to Calculator if the password already exists
                navigation.replace('Calculator');
            }
        };
        checkPassword();
    }, [navigation]);

    const handlePasswordChange = (value: string) => {
        // Ensure only numeric input
        if (/^\d*$/.test(value)) {
            setPassword(value);
        } else {
            Alert.alert('Invalid Input', 'You can type only numbers.');
        }
    };

    const savePassword = async () => {
        if (password.length === 4) {
            await AsyncStorage.setItem('calculator_password', password);
            Alert.alert('Password Set', 'Your 4-digit password has been saved.');
            navigation.replace('Calculator');
        } else {
            Alert.alert('Invalid Password', 'Password must be exactly 4 digits.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Set a 4-digit password:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={4}
                value={password}
                onChangeText={handlePasswordChange}
                placeholder="Enter 4 digits"
                placeholderTextColor="#888"
            />
            <Button color="#5C0DF6" title="Save Password" onPress={savePassword} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#101010' },
    title: { color: 'white', fontSize: 18, marginBottom: 20 },
    input: {
        backgroundColor: 'white',
        width: '80%',
        height: 50,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        marginBottom: 20,
    },
});

export default PasswordSetup;