import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

export const MaterialBottomTab = createMaterialBottomTabNavigator();
export const Tab = createBottomTabNavigator();
export const Stack = createNativeStackNavigator();
export const TopTab = createMaterialTopTabNavigator();
