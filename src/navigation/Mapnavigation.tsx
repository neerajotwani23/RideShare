import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostRideScreen from "src/screens/Ride/PostRideScreen";
import LocationSelect from "src/screens/Ride/LocationSelectionScreen";
import FindRideScreen from "src/screens/Ride/FindRideScreen";
import { NavigationContainer } from "@react-navigation/native";
const Stack = createNativeStackNavigator();

function location_Autocomplete ()
{
    return(

    <Stack.Navigator screenOptions={{headerShown:false}}>
        
        <Stack.Screen  name="PostRide" component={PostRideScreen} />
        <Stack.Screen name="FindRide" component={FindRideScreen}/>
        <Stack.Screen name="LocationSelection" component={LocationSelect}/>

    </Stack.Navigator>
 
    );
}

export default location_Autocomplete