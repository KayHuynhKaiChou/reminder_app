import IconComponent from '@/components/Icon/IconComponent';
import { COLORS_NEW_LIST, ICONS_NEW_LIST } from '@/constants';
import { useTheme } from '@/hooks';
import { IList } from '@/types';
import { memo, useMemo } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface IListForm {
    name: IList['name'];
    iconColor: IList['iconColor'];
    iconName: IList['iconName'];
    onChangeFormList: <K extends keyof IList>(key: K, value: IList[K]) => void;
}

function ListForm({
    name,
    iconColor,
    iconName,
    onChangeFormList
}: IListForm) {
    //theme
    const { Layout , Colors, darkMode: isDark} = useTheme();
    //width
    const widthScreen = Dimensions.get('window').width;
    //width circle
    const NUMBER_CIRCLE = 8;
    const GAP_CIRCLE = Layout.gapSmall.gap;
    // 20 là padding 2 bên screen
    const widthCircle = useMemo(() => {
        return (widthScreen - 20 - (NUMBER_CIRCLE + 1) * GAP_CIRCLE) / NUMBER_CIRCLE;    
    },[])
    return (
        <ScrollView
            contentContainerStyle={[
                Layout.paddingLayout, 
                Layout.col, 
                Layout.gap,
                {flexGrow: 1}
            ]}
        >
            <View 
                style={[
                    Layout.card, 
                    Layout.colVCenter, 
                    Layout.gapSmall,
                    {backgroundColor: isDark ? Colors.textGray600 : '#fff'}
                ]}
            >
                <IconComponent
                    sizeIcon={80}
                    iconData={{
                        iconColor: iconColor,
                        iconName: iconName,
                    }}
                />
                <TextInput
                    placeholder="List Name"
                    value={name}
                    autoFocus={!name}
                    style={[
                        styles.inputName,
                        {
                            color: iconColor,
                            backgroundColor: isDark ? Colors.textGray800 : '#f2f2f2'
                        }
                    ]}
                    placeholderTextColor="#999"
                    onChangeText={text => onChangeFormList('name', text)}
                />
            </View>

            {/* Color Picker */}
            <View 
                style={[
                    Layout.card, 
                    Layout.row, 
                    Layout.rowWrap, 
                    Layout.gapSmall,
                    {backgroundColor: isDark ? Colors.textGray600 : '#fff'}
                ]}
            >
                {COLORS_NEW_LIST.map((color, idx) => {
                    return (
                        <View style={Layout.relative}>
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    // styles.colorCircle,
                                    {
                                        width: widthCircle,
                                        height: widthCircle,
                                        borderRadius: widthCircle / 2,
                                        backgroundColor: color,
                                    }
                                ]}
                                onPress={() => onChangeFormList('iconColor', color)}
                            />
                            {color === iconColor && (    
                                <View 
                                    style={{
                                        position: 'absolute',
                                        top: -(GAP_CIRCLE / 2),
                                        left: -(GAP_CIRCLE / 2),
                                        width: widthCircle + GAP_CIRCLE,
                                        height : widthCircle + GAP_CIRCLE,
                                        borderRadius: (widthCircle + GAP_CIRCLE) / 2,
                                        borderWidth: (GAP_CIRCLE / 4),
                                        borderColor: Colors.textGray200
                                    }}
                                />
                            )}
                        </View>
                    )
                })}
            </View>

            {/* Icon Picker */}
            <View 
                style={[
                    Layout.card, 
                    Layout.row, 
                    Layout.rowWrap, 
                    Layout.gapSmall,
                    {backgroundColor: isDark ? Colors.textGray600 : '#fff'}
                ]}
            >
                {ICONS_NEW_LIST.map((icon, idx) => (
                    <View style={Layout.relative}>
                        <TouchableOpacity
                            key={idx}
                            onPress={() => onChangeFormList('iconName', icon)}
                        >
                            <IconComponent
                                sizeIcon={widthCircle}
                                isBorder={false}
                                iconColorText="#131313"
                                iconData={{ iconColor: '#f2f2f2', iconName: icon }}
                            />
                        </TouchableOpacity>
                        {icon === iconName && (    
                            <View 
                                style={{
                                    position: 'absolute',
                                    top: -(GAP_CIRCLE / 2),
                                    left: -(GAP_CIRCLE / 2),
                                    width: widthCircle + GAP_CIRCLE,
                                    height : widthCircle + GAP_CIRCLE,
                                    borderRadius: (widthCircle + GAP_CIRCLE) / 2,
                                    borderWidth: (GAP_CIRCLE / 4),
                                    borderColor: Colors.textGray200
                                }}
                            />
                        )}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

export default memo(ListForm);

const styles = StyleSheet.create({
  inputName: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
