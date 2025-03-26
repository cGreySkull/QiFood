import {Tabs} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import { View, Text } from "react-native";

export default function TabLayout() {
    return (
        
        <Tabs screenOptions={{headerShown: false, tabBarShowLabel: false,
            tabBarStyle: {
                height: 74,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                paddingBottom: 8,
                paddingTop: 6,
                borderTopWidth: 0
            }
        }}>

            <Tabs.Screen name="index" options={{ href: null }} />

            <Tabs.Screen name="recipes/index" options={{
                tabBarIcon: ({color , size, focused}) => (
                    <View style={{alignContent:'center', alignItems:'center'}}>
                        <Ionicons name={focused?"home":"home-outline"} size={size} color={color}/>
                        <Text style={{fontWeight: focused?"600":"500"}}>Recipes</Text>
                    </View>
                )
            }} />

            <Tabs.Screen name="camera" options={{
                tabBarIcon: ({color, size, focused}) => (
                    <View style={{position:"absolute", top: -40, alignItems:"center"}}>
                        <View style={{
                            width: 65, height: 65,
                            borderRadius: 65,
                            backgroundColor: focused?'#1976D2':'#2196F3',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderColor: "#fff",
                            borderWidth: 6
                        }}>
                            <Ionicons name="camera" size={size * 1.5} color="#fff"/>
                            
                        </View>
                        <Text style={{fontWeight: focused?"600":"500"}}>Recipe</Text>
                    </View>
            ), tabBarItemStyle: {}
            }}/>

            <Tabs.Screen name="profile/index" options={{
                tabBarIcon: ({color, size, focused}) => (
                    <View style={{alignContent:'center', alignItems:'center'}}>
                        <Ionicons name={focused?"person":"person-outline"} size={size} color={color}/>
                        <Text style={{fontWeight: focused?"600":"500"}}>Profile</Text>
                    </View>
                )
            }}/>

            <Tabs.Screen name="profile/settings" options={{ href: null }} />
            <Tabs.Screen name="recipes/[id]" options={{ href: null }} />
        </Tabs>
    );
};