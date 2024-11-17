import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,Button,FlatList,TouchableOpacity,Alert,Vibration,StyleSheet,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Image,Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

// Fechar teclado quando clicar em outro lugar
function DismissKeyboard({ children }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
}

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

// Rela To-Do List
function TodoScreen() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: task, done: false }]);
      setTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <DismissKeyboard>
        <View>
          <Text style={styles.title}>To-Do List</Text>
          <View style={styles.addTaskContainer}>
            <TextInput
              placeholder="Digite a tarefa aqui..."
              placeholderTextColor="#aaa"
              value={task}
              onChangeText={setTask}
              style={styles.input}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Text style={styles.addButtonText}>Adicionar Tarefa</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskContainer}>
                <TouchableOpacity onPress={() => toggleTask(item.id)}>
                  <Text style={item.done ? styles.taskDone : styles.task}>
                    {item.text}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.doneButton}>
                  <Text style={styles.doneButtonText}>Tarefa Concluída</Text>
                </TouchableOpacity>
              </View>
            )}
          />
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