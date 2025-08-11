import { Text, View } from "react-native";
import ReminderToggleItem from "../CardSettingReminder/ReminderToggleItem";
import { useLocation } from "@/hooks/useLocation";
import { IDetailReminderForm } from "@/types";
import useEffectSkipFirstRender from "@/hooks/useEffectSkipRender";
import { useTheme } from "@/hooks";
import { Divider } from "@rneui/themed";

interface IDetailLocationProps {
    addressDetail: IDetailReminderForm['addressDetail'];
    isToggleLocation: IDetailReminderForm['isToggleLocation'];
    onChangeDetailReminderForm
        <T extends keyof IDetailReminderForm>
        (key: T, value: IDetailReminderForm[T]) : void
}

export default function DetailLocation({
    addressDetail,
    isToggleLocation,
    onChangeDetailReminderForm
}: IDetailLocationProps) {
    //theme
    const {Layout, Colors, darkMode: isDark} = useTheme();
    //hook
    const {getLocation, reverseGeocodeWithLocationIQ} = useLocation();
    //life cycle
    useEffectSkipFirstRender(() => {
        getLocation()
        .then((res) => {
            if(!res) return
                onChangeDetailReminderForm(
                    'location', 
                    isToggleLocation ? {
                        latitude: res.coords.latitude,
                        longitude: res.coords.longitude
                    } : undefined
                );
                reverseGeocodeWithLocationIQ(
                    res.coords.latitude, 
                    res.coords.longitude
                )  
                    .then(address => {
                        onChangeDetailReminderForm(
                            'addressDetail', 
                            isToggleLocation ? address : undefined
                        );
                    })
                    .catch(error => console.log(error))
            })
    }, [isToggleLocation])
    
    return (
        <View
            style={[
                Layout.col, 
                Layout.card,
                {
                    padding: 0,
                    backgroundColor: isDark ? Colors.textGray600 : '#fff'
                }, 
            ]}
        >
            <ReminderToggleItem
                iconColor="#0387fa"
                iconName="near-me"
                label="Location"
                value={isToggleLocation}
                onValueChange={(value) => onChangeDetailReminderForm('isToggleLocation', value)}
            />
            {
                isToggleLocation && (
                    <>
                        <Divider style={{marginHorizontal: 10}}/>
                        <Text 
                            style={[
                                Layout.paddingLayout,
                                {color: isDark ? Colors.textGray800 : '#000'}
                            ]}
                        >
                            {addressDetail ? addressDetail : 'Detecting your current location...'}
                        </Text>
                    </>
                )
            }
        </View>
    )
}
