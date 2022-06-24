import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem() {
    const value = Platform.OS === "web" ? await AsyncStorage.getItem('token') : await SecureStore.getItemAsync('token')
    return value
}
export async function setItem(value: string) {
    return Platform.OS === "web" ? AsyncStorage.setItem('token', value) : SecureStore.setItemAsync('token', value)
}
export async function removeItem() {  
    return Platform.OS === "web" ? AsyncStorage.removeItem('token') : SecureStore.deleteItemAsync('token')
}