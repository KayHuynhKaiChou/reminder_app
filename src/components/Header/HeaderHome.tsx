import { useTheme } from '@/hooks';
import { changeEdit, HomeState } from '@/store/home';
import { changeTheme } from '@/store/theme';
import { Button, SearchBar, Switch } from '@rneui/themed';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';

interface IHeaderHomeProps {
    searchText: string;
    onChangeSearchText: (text: string) => void
}

export default function HeaderHome({
    searchText,
    onChangeSearchText
}: IHeaderHomeProps) {
    const {
        Layout,
        Fonts,
        Colors,
        darkMode: isDark
    } = useTheme();
    const dispatch = useDispatch();
    const isEdit = useSelector((state: {home: HomeState}) => state.home.isEdit)
    const handleEdit = () => {
        dispatch(changeEdit({ isEdit: !isEdit }));
    }

    const handleChangeTheme = () => {
        dispatch(changeTheme({ darkMode: !isDark }));
    };
    return (
        <View style={[
            Layout.col,
            Layout.gapSmall,
            styles.headerContainer
        ]}>
            <View style={[Layout.rowVSpaceBetween, {height: 40}]}>
                <View style={[Layout.rowHCenter]}>
                    <Text 
                        style={[
                            Fonts.textSmall,
                            {color: isDark ? '#fff' : '#000'}
                        ]}
                    >
                        {isDark ? 'Dark' : 'Light'}
                    </Text>
                    <Switch value={isDark} onValueChange={handleChangeTheme} />
                </View>
                {!searchText && (
                    <Button 
                        title={isEdit ? 'Done' : 'Edit'} 
                        type="clear" 
                        onPress={handleEdit}
                    />
                )}
            </View>
            <SearchBar 
                placeholder='search'
                round
                lightTheme
                containerStyle={styles.searchContainer}
                inputContainerStyle={{
                    backgroundColor: isDark ? Colors.textGray600 : '#e2e2e2'
                }}
                disabled={isEdit}
                value={searchText}
                onChangeText={onChangeSearchText}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        marginBottom: 10
    },
    searchContainer: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        borderBottomWidth: 0,
        padding: 0,
    },
    inputContainer: {
        backgroundColor: '#e2e2e2',
    }
})
