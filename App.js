import React, { useState } from 'react';
import {View,Text,TextInput,Button,FlatList,TouchableOpacity,Alert,Vibration,StyleSheet,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Image,Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';



// Tela de Login
function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [senha, senhaArmazenada] = useState('');

  const handleLogin = async () => {
    const senhaArmazenada = await AsyncStorage.getItem(username);
    if (senhaArmazenada === senha) {
      navigation.replace('AppStack');
    } else {
      Alert.alert('Login Falhou', 'Usuário ou senha incorretos');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <DismissKeyboard>
        <View>
          <Text style={styles.title}>Login</Text>
          <TextInput
            placeholder="Usuário"
            placeholderTextColor="#aaa"
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry
            onChangeText={senhaArmazenada}
            style={styles.input}
          />
          <Button title="Login" onPress={handleLogin} />
        </View>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
}

// Tela de Cadastro
function CadastroScreen() {
  const [username, setUsername] = useState('');
  const [senha, senhaArmazenada] = useState('');

  const handleRegister = async () => {
    await AsyncStorage.setItem(username, senha);
    Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <DismissKeyboard>
        <View>
          <Text style={styles.title}>Cadastro</Text>
          <TextInput
            placeholder="Usuário"
            placeholderTextColor="#aaa"
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#aaa"
            secureTextEntry
            onChangeText={senhaArmazenada}
            style={styles.input}
          />
          <Button title="Registrar" onPress={handleRegister} />
        </View>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  );
}

// Navegação entre as telas
function AuthTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Login') {
            iconName = 'sign-in';
          } else if (route.name === 'Cadastro') {
            iconName = 'user-plus';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Login" component={LoginScreen} />
      <Tab.Screen name="Cadastro" component={CadastroScreen} />
    </Tab.Navigator>
  );
}

// Main App
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}