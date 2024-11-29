import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    PasswordSetup: undefined;
    Calculator: undefined;
    HiddenPhotos: undefined;
};

type CalculatorScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Calculator'>;

interface CalculatorProps {
    navigation: CalculatorScreenNavigationProp;
}

const Calculator: React.FC<CalculatorProps> = ({ navigation }) => {
    const [input, setInput] = useState('');
    const [password, setPassword] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        const loadPassword = async () => {
            const savedPassword = await AsyncStorage.getItem('calculator_password');
            if (savedPassword) setPassword(savedPassword);
        };
        loadPassword();
    }, []);

    const handlePress = (value: string) => {
        setInput((prev) => prev + value);
    };

    const handleClear = () => {
        setInput('');
        setResult('');
    };

    const handleEquals = () => {
        try {
            // Redirect if input matches password
            if (input === password) {
                navigation.navigate('HiddenPhotos');
                return;
            }

            // Evaluate mathematical expression
            const calculatedResult = eval(input); // Use caution with eval; for production, use a safer parser like math.js
            setResult(String(calculatedResult));
        } catch {
            Alert.alert('Error', 'Invalid input. Please try again.');
            handleClear();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.display}>{result || input || '0'}</Text>
            <View style={styles.row}>
                {['7', '8', '9', 'DEL'].map((item) => (
                    <TouchableOpacity
                        key={item}
                        onPress={() => (item === 'DEL' ? handleClear() : handlePress(item))}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.row}>
                {['4', '5', '6', '+'].map((item) => (
                    <TouchableOpacity
                        key={item}
                        onPress={() => handlePress(item)}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.row}>
                {['1', '2', '3', '-'].map((item) => (
                    <TouchableOpacity
                        key={item}
                        onPress={() => handlePress(item)}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={styles.row}>
                {['0', '.', '/', '*'].map((item) => (
                    <TouchableOpacity
                        key={item}
                        onPress={() => handlePress(item)}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity onPress={handleEquals} style={[styles.button, styles.equals]}>
                    <Text style={styles.buttonText}>=</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#101010', justifyContent: 'flex-end', padding: 20 },
    display: { color: 'white', fontSize: 50, marginBottom: 20, textAlign: 'right' },
    row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    button: {
        width: 70,
        height: 70,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: { color: 'white', fontSize: 24 },
    // marginHorizontal: '24%'
    equals: { backgroundColor: '#5C0DF6' },
});

export default Calculator;