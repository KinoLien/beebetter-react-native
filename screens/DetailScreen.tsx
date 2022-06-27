import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../components/AuthProvider';
import { FlatList, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, View } from '../components/Themed';

export default function DetailScreen({ route, navigation } : { route: any, navigation: any}) {
    const { authToken } = useContext(AuthContext)
    const { cellId } = route.params;

    const showProperties = [
        "Tem1", "Hum1", "Vol1", "Weight", "Time"
    ]

    const [cellDataState, setCellDataState] = useState({
        isLoading: true,
        cellData: {} as {[index: string] : any} | null
    })

    useEffect(() => {
        async function loadCellDataAsync() {            
            const dataRes = await fetch(`http://localhost:5000/mobile/api/cells/${cellId}/latest`, {
                method: "GET",
                headers: {
                    Authorization: 'Bearer ' + authToken
                }
            })
            const data = await dataRes.json()

            setCellDataState({
                isLoading: false,
                cellData: data
            })
        }
        loadCellDataAsync()
        navigation.setOptions({title: `Detail - ${cellId}` })
    }, [])

    const convertValues = () => {
        return showProperties.map(prop => {
            return {
                prop,
                value: cellDataState.cellData ? cellDataState.cellData[prop] : ""
            }
        })
    }

  return (
    <View style={styles.container}>
        {cellDataState.isLoading ? 
            <ActivityIndicator /> :
            cellDataState.cellData ? 
                <FlatList
                    data={convertValues()}
                    renderItem={({item}) => (
                        <View style={styles.propbox}>
                            <Text style={styles.propTitle}>{item.prop}</Text>
                            <Text style={styles.propValue}>{item.value}</Text>
                        </View>
                    )}
                    numColumns={2}
                /> :
                <View style={styles.noDataBox}>
                    <Text style={styles.noData}>No Data</Text>
                </View>
        }
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  propbox: {
    flex: 1,
    flexDirection: 'column',
    margin: 20,
    alignItems: 'center'
  },
  propTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  propValue: {
    fontSize: 20,
    padding: 8
  },
  noDataBox: {
    alignItems: 'center'
  },
  noData: {
    fontSize: 32,
    padding: 8
  }
});
