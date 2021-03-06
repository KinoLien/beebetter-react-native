import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, Pressable } from 'react-native';
import { AuthContext } from '../components/AuthProvider';
import { Text, View } from '../components/Themed';
import { ActivityIndicator } from "react-native";

export default function ListScreen({navigation} : {navigation: any}) {
    const { authToken } = useContext(AuthContext)
    
    const [deviceListState, setDeviceListState] = useState({
        isLoading: true,
        deviceList: Array<{[index: string]: any}>()
    })

    useEffect(() => {
        console.log("Token: " + authToken)
        async function loadDeviceListAsync() {
            const listRes = await fetch("https://console.beebetter.io/mobile/api/cells", {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + authToken
                }
            })
            const list = await listRes.json()
            
            setDeviceListState({
                isLoading: false,
                deviceList: list
            })
        }
        loadDeviceListAsync()
    }, [])

    const onDevicePress = (item: any) => {
        navigation.navigate('Detail', {
            cellId: item.id,
            cellTitle: item.name
        });
    }
 
    return (
        <View style={styles.container}>
            {deviceListState.isLoading ? 
                <ActivityIndicator/> :
                <FlatList
                    data={deviceListState.deviceList}
                    ItemSeparatorComponent={() => <View style={{height: 0.5,width: '100%',backgroundColor: '#C8C8C8'}}/>}
                    renderItem={({item}) => (
                        <Pressable onPress={() => onDevicePress(item)}>
                            <Text style={styles.item}>{item.name}</Text>
                        </Pressable>
                    )}
                />
            }
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 22
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    item: {
        padding: 10,
        fontSize: 18,
        margin: 10,
        height: 44,
    }
});
