import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Divider, Icon } from "@rneui/themed";
import { useTheme } from "@/hooks";
import { IFormReminder, NavigationNewReminderProp } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { FormReminderState, updateFormReminder } from "@/store/formReminder";
import { useMemo } from "react";
import { capitalizeFirstLetter, formatTime, getDateLabel } from "@/utils";
import IconComponent from "@/components/Icon/IconComponent";

export default function NewReminder() {
    const {Layout, Fonts, Colors, darkMode: isDark} = useTheme();
    const screenHeight = Dimensions.get('window').height;
    const navigate = useNavigation<NavigationNewReminderProp>();
    //store
    const {formReminder} = useSelector((state: {formReminder: FormReminderState}) => state.formReminder);
    const dispatch = useDispatch();
    //react hooks
    const formatDetailDateTime = useMemo(() => {
        if(!formReminder?.detail?.date && !formReminder?.detail?.time) return '';
        const formatDate = formReminder.detail.date ? getDateLabel(formReminder.detail.date) : '';
        const formatTimeValue = formReminder.detail.time ? formatTime(new Date(formReminder.detail.time)) : '';
        let formatResult = formatTimeValue ? `${formatTimeValue} ${formatDate}` : formatDate
        if(formReminder.detail?.repeat) {
            formatResult += `, ${capitalizeFirstLetter(formReminder.detail?.repeat)}` 
        }
        return formatResult
    }, [formReminder.detail])
    //func
    const handleUpdateFormReminder = <
        K extends keyof IFormReminder
    >(
        field: K,
        value: IFormReminder[K]
    ) => {
        dispatch(updateFormReminder({formReminder: {...formReminder, [field]: value}}))
    };
    return (
        <View 
            style={[
                styles.sheet, 
                {
                    height: screenHeight - 50,
                }
            ]}
        >
            <ScrollView 
                contentContainerStyle={[
                    styles.contentContainer, 
                    Layout.col, 
                    Layout.gap
                ]}
            >
                <View 
                    style={[
                        Layout.card,
                        {
                            backgroundColor: isDark ? Colors.textGray600 : '#fff'
                        }
                    ]}
                >
                    <TextInput
                        placeholder="Title"
                        placeholderTextColor={'#afafaf'}
                        style={[
                            styles.input,
                            {
                                color: isDark ? '#fff' : '#2b2b2b'
                            }
                        ]}
                        value={formReminder.title}
                        onChangeText={(text) => handleUpdateFormReminder("title", text)}
                    />
                    <Divider style={[
                        styles.divider,
                        {
                            backgroundColor: isDark ? Colors.textGray600 : '#fff'
                        }
                    ]}/>
                    <TextInput
                        placeholder="Notes"
                        placeholderTextColor={'#afafaf'}
                        style={[styles.input, styles.inputNotes]}
                        value={formReminder.content}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        onChangeText={(text) => handleUpdateFormReminder("content", text)}
                    />
                </View>

                <TouchableOpacity 
                    style={[
                        Layout.card, 
                        Layout.rowVSpaceBetween, 
                        Layout.rowHCenter,
                        {
                            backgroundColor: isDark ? Colors.textGray600 : '#fff'
                        }
                    ]}
                    onPress={() => navigate.navigate('DetailsReminder')}
                >
                    <View>
                        <Text 
                            style={[
                                Fonts.textSmall, 
                                Fonts.textBold,
                                {
                                    color: isDark ? Colors.white : '#000'
                                }
                            ]}
                        >
                            Details
                        </Text>
                        {formatDetailDateTime && (
                            <Text style={[Fonts.textSmall]}>{formatDetailDateTime}</Text>
                        )}
                    </View>
                    <Icon name="keyboard-arrow-right" size={30} color={'#c9c9c9'}/>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[
                        Layout.card, 
                        Layout.rowVSpaceBetween, 
                        Layout.rowHCenter,
                        {
                            backgroundColor: isDark ? Colors.textGray600 : '#fff'
                        }
                    ]}
                    onPress={() => navigate.navigate('ListReminderOverview')}
                >
                    <View style={[Layout.rowHCenter, Layout.gapSmall]}> 
                        {formReminder.list?.iconName && formReminder.list?.iconColor && (
                            <IconComponent 
                                iconData={{
                                    iconColor: formReminder.list.iconColor, 
                                    iconName: formReminder.list.iconName
                                }}
                            />
                        )}
                        <Text 
                            style={[
                                Fonts.textSmall, 
                                Fonts.textBold,
                                {
                                    color: isDark ? Colors.white : '#000'
                                }
                            ]}
                        >
                            List
                        </Text>
                    </View>                    
                    <View style={Layout.rowHCenter}>
                        <View style={styles.dot} />
                        <Text 
                            style={[
                                styles.subText, 
                                {
                                    color: isDark ? Colors.textGray200 : '#000'
                                }
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {formReminder.list?.name}
                        </Text>
                        <Icon name="keyboard-arrow-right" size={30} color={'#c9c9c9'}/>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
  },
  contentContainer: {
    padding: 16,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
  },
  inputNotes: {
    color: '#7c7c7c',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
  },
  subText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#333',
    maxWidth: 120,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
});
