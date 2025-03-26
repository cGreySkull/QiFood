import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import { View, Text } from "react-native";
import CameraTabButton from "../components/CameraTabButton";

export default function TabLayout() {
    return (
        
        <Tabs screenOptions={{headerShown: false, tabBarShowLabel: true,
            tabBarStyle: {
                height: 74,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                paddingBottom: 10,
                paddingTop: 10,
                borderTopWidth: 0
            }
        }}>

            <Tabs.Screen name="index" options={{ href: null }} />

            <Tabs.Screen name="recipes/index" options={{
                tabBarIcon: ({color , size, focused}) => (
                    <View style={{alignContent:'center', alignItems:'center'}}>
                        <Ionicons name={focused?"home":"home-outline"} size={size} color={color}/>
                        
                    </View>
                ), title: "Recipes"
            }} />

            <Tabs.Screen name="camera" options={{
                tabBarButton: (props) => <CameraTabButton {...props}/>,
                tabBarItemStyle: {height: 74}
            }}/>

            <Tabs.Screen name="profile/index" options={{
                tabBarIcon: ({color, size, focused}) => (
                    <View style={{alignContent:'center', alignItems:'center'}}>
                        <Ionicons name={focused?"person":"person-outline"} size={size} color={color}/>
                    </View>
                ), title: "My Profile"
            }}/>

            <Tabs.Screen name="profile/settings" options={{ href: null }} />
            <Tabs.Screen name="recipes/[id]" options={{ href: null }} />
        </Tabs>
    );
};