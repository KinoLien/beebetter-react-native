import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect, useReducer, useMemo, createContext, useContext } from 'react';
import { ColorSchemeName, Pressable, TextInput, Button, Platform, StyleSheet, ActivityIndicator } from 'react-native';

import { AuthContext } from '../components/AuthProvider'
import ListScreen from '../screens/ListScreen';
import DetailScreen from '../screens/DetailScreen';
import { RootStackParamList } from '../types';
import { Text, View } from '../components/Themed';
import { StatusBar } from 'expo-status-bar';
import {
  getItem as getToken,
  setItem as setToken,
  removeItem as removeToken,
} from '../components/async-storage';

function SignInScreen({ route, navigation } : { route: any, navigation: any}) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signIn } = useContext(AuthContext);

  const onSignInPress = () => {
      console.log("before sign in")
      signIn(email, password)
      // signIn()
      console.log("after sign in")
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder='Email' onChangeText={setEmail}></TextInput>
      <TextInput style={styles.input} placeholder='Password' onChangeText={setPassword} secureTextEntry={true}></TextInput>
      <Pressable style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
  },
  input: {
      fontSize: 20,
      padding: 8,
      borderColor: 'black',
      borderRadius: 4,
      borderWidth: 1,
      marginBottom: 12,
      width: '50%',
      minWidth: 300
  },
  button: {
      marginTop: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'black'
  },
  buttonText: {
      fontSize: 24,
      color: 'white'
  }
});

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SIGN_OUT':
      return {
        ...state,
        status: 'signOut',
        authToken: null,
      };
    case 'SIGN_IN':
      return {
        ...state,
        status: 'signIn',
        authToken: action.token,
      };
  }
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  // const { authToken, signOut } = useAuthorization()
  // signOut()
  const [state, dispatch] = useReducer(reducer, {
    status: 'idle',
    authToken: null as string | null,
  });

  useEffect(() => {
    const initState = async () => {
      try {
        const authToken = await getToken();
        if (authToken !== null) {
          dispatch({type: 'SIGN_IN', token: authToken});
        } else {
          dispatch({type: 'SIGN_OUT'});
        }
      } catch (e) {
        console.log(e);
      } 
    };

    initState();
  }, []);

  const actions = useMemo(
    () => ({
      signIn: async (email: string, password: string) => {
        // just for test
        console.log("memo here")
        const loginRes = await fetch("http://localhost:5000/mobile/api/login", {
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        })

        const tokenRes = await loginRes.json()
        const token = tokenRes.token
        
        dispatch({type: 'SIGN_IN', token});
        await setToken(token);
      },
      signOut: async () => {
        dispatch({type: 'SIGN_OUT'});
        await removeToken();
      },
    }), []
  );

  return (
    <AuthContext.Provider value={{...state, ...actions}}>
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
        {state.authToken ? 
          <Stack.Group>
            <Stack.Screen name="List" component={ListScreen} options={{ 
              title: 'Device List',
              headerRight: () => (
                <Button
                  onPress={() => actions.signOut()}
                  title="Sign Out"
                />
              ),
            }} />
            <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Detail' }} />
          </Stack.Group> :
          <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
