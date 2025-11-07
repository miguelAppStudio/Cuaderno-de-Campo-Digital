
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeIcon, NoteIcon, CalendarIcon, FarmIcon, LivestockIcon, DropletIcon, SyringeIcon } from './src/components/icons';
import { Platform } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import NotesScreen from './src/screens/NotesScreen';
import NoteEditScreen from './src/screens/NoteEditScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import FarmsScreen from './src/screens/FarmsScreen';
import FarmEditScreen from './src/screens/FarmEditScreen';
import FarmProductsScreen from './src/screens/FarmProductsScreen';
import FarmProductEditScreen from './src/screens/FarmProductEditScreen';
import LivestockScreen from './src/screens/LivestockScreen';
import LivestockEditScreen from './src/screens/LivestockEditScreen';
import LivestockCareScreen from './src/screens/LivestockCareScreen';
import LivestockCareEditScreen from './src/screens/LivestockCareEditScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const NotesStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="NotesList" component={NotesScreen} />
        <Stack.Screen name="NoteEdit" component={NoteEditScreen} />
    </Stack.Navigator>
);

const FarmsStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="FarmsList" component={FarmsScreen} />
        <Stack.Screen name="FarmEdit" component={FarmEditScreen} />
        <Stack.Screen name="FarmProducts" component={FarmProductsScreen} />
        <Stack.Screen name="FarmProductEdit" component={FarmProductEditScreen} />
    </Stack.Navigator>
);

const LivestockStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LivestockList" component={LivestockScreen} />
        <Stack.Screen name="LivestockEdit" component={LivestockEditScreen} />
        <Stack.Screen name="LivestockCare" component={LivestockCareScreen} />
        <Stack.Screen name="LivestockCareEdit" component={LivestockCareEditScreen} />
    </Stack.Navigator>
);


const App: React.FC = () => {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarActiveTintColor: '#22c55e',
                        tabBarInactiveTintColor: '#64748b',
                        tabBarStyle: {
                            height: Platform.OS === 'ios' ? 80 : 60,
                            paddingTop: 5,
                            backgroundColor: '#ffffff',
                            borderTopWidth: 1,
                            borderTopColor: '#e2e8f0',
                        },
                        tabBarLabelStyle: {
                            fontSize: 10,
                            fontWeight: '600',
                            marginBottom: Platform.OS === 'ios' ? -5 : 5,
                        },
                        tabBarIcon: ({ color, size, focused }) => {
                            let IconComponent;
                            if (route.name === 'Inicio') IconComponent = HomeIcon;
                            else if (route.name === 'Notas') IconComponent = NoteIcon;
                            else if (route.name === 'Calendario') IconComponent = CalendarIcon;
                            else if (route.name === 'Fincas') IconComponent = FarmIcon;
                            else if (route.name === 'Ganado') IconComponent = LivestockIcon;
                            return IconComponent ? <IconComponent color={color} width={size} height={size} /> : null;
                        },
                    })}
                >
                    <Tab.Screen name="Inicio" component={HomeScreen} />
                    <Tab.Screen name="Notas" component={NotesStack} />
                    <Tab.Screen name="Calendario" component={CalendarScreen} />
                    <Tab.Screen name="Fincas" component={FarmsStack} />
                    <Tab.Screen name="Ganado" component={LivestockStack} />
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default App;
