import MapView, { Marker } from "react-native-maps";
import Icon from '../../components/Icon';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

interface Cords{
    location:any,
    defaultLocation:any,
    destinationLocation?:any
}

const Mapshow = ({ location, defaultLocation, destinationLocation}:Cords)=> {

    return (
        <MapView
            style={{ flex: 1 }}
            region={location || defaultLocation}
            showsUserLocation={true}
            showsMyLocationButton={false}
            zoomEnabled={true}
            zoomControlEnabled={true}

        >
            {location && (
                <Marker coordinate={location}>
                    <FontAwesome6 name="car-side" size={32} color={'#ffffff'} />
                </Marker>
            )}
            {destinationLocation && (
                <Marker coordinate={destinationLocation}>
                    <FontAwesome6 name="location-dot" size={32} color={'#00ffcc'} />
                </Marker>
            )}
        </MapView>
    )

}

export default Mapshow;