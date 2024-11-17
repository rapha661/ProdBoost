import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,Button,FlatList,TouchableOpacity,Alert,Vibration,StyleSheet,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Image,Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

// Tela pomodoro
const um_segundo = 1000;
function PomodoroScreen() {
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timer, setTimer] = useState(focusTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(true);

  useEffect(() => {
    setTimer(focusTime * 60);
  }, [focusTime]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            Vibration.vibrate(um_segundo * 10);
            setIsFocusMode(!isFocusMode);
            setTimer(isFocusMode ? breakTime * 60 : focusTime * 60);
            return 0;
          }
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, isFocusMode, focusTime, breakTime]);

  const resetTimer = () => {
    setIsRunning(false);
    setIsFocusMode(true); // Retorna sempre para o modo foco ao resetar
    setTimer(focusTime * 60);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <DismissKeyboard>
        <View>
          <Text style={styles.title}>Pomodoro Timer</Text>
          <Text style={styles.timer}>{formatTime(timer)}</Text>
          <Text style={styles.mode}>
            {isFocusMode ? 'Modo Foco' : 'Modo Descanso'}
          </Text>
          <Image
            source={isFocusMode ? require('./assets/livro_foco.png') : require('./assets/cafe_descanso.png')}
            style={styles.pomodoroImage}
          />
          <View style={styles.buttonContainer}>
            <Button
              title={isRunning ? 'Pausar' : 'Iniciar'}
              onPress={() => setIsRunning(!isRunning)}
            />
            <Button title="Resetar" onPress={resetTimer} />
          </View>
          <View style={styles.adjustTimeContainer}>
            <Text style={styles.sectionTitle}>Ajustar Tempos</Text>
            <Text style={styles.label}>Foco (min):</Text>
            <TextInput
              style={styles.input}
              placeholder="25"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={focusTime.toString()}
              onChangeText={(text) => setFocusTime(Number(text) || 0)}
            />
            <Text style={styles.label}>Descanso (min):</Text>
            <TextInput
              style={styles.input}
              placeholder="5"
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={breakTime.toString()}
              onChangeText={(text) => setBreakTime(Number(text) || 0)}
            />
          </View>
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

// Stack das telas
function AppStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'To-Do List') {
            iconName = 'list';
          } else if (route.name === 'Pomodoro') {
            iconName = 'clock-o';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="To-Do List" component={TodoScreen} />
      <Tab.Screen name="Pomodoro" component={PomodoroScreen} />
    </Tab.Navigator>
  );
}

// Main App
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthTabs} />
        <Stack.Screen name="AppStack" component={AppStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}