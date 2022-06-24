import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, Pressable } from 'react-native';
import { useAuthorization } from '../components/AuthProvider';
import { Text, View } from '../components/Themed';
import { ActivityIndicator } from "react-native";

export default function ListScreen({navigation} : {navigation: any}) {
    const provider = useAuthorization()
    // console.log(provider.status)

    const [deviceListState, setDeviceListState] = useState({
        isLoading: true,
        deviceList: Array<string>()
    })

    useEffect(() => {
        async function loadDeviceListAsync() {
            const listRes = await fetch("http://localhost:5000/api/cells", {
                method: "GET"
            })
            const list = await listRes.json()
            
            setDeviceListState({
                isLoading: false,
                deviceList: list
            })
        }
        loadDeviceListAsync()
    }, [])

    const onDevicePress = (id: string) => {
        navigation.navigate('Detail', {
            cellId: id
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
                            <Text style={styles.item}>{item}</Text>
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
