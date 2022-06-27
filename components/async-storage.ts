import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem() {
    return Platform.OS === "web" ? await AsyncStorage.getItem('token') : await SecureStore.getItemAsync('token')
}
export async function setItem(value: string) {
    return Platform.OS === "web" ? await AsyncStorage.setItem('token', value) : await SecureStore.setItemAsync('token', value)
}
export async function removeItem() {  
    return Platform.OS === "web" ? await AsyncStorage.removeItem('token') : await SecureStore.deleteItemAsync('token')
}