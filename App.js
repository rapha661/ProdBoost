import React, { useState } from 'react';
import {View,Text,TextInput,Button,FlatList,TouchableOpacity,Alert,Vibration,StyleSheet,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Image,Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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