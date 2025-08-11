import { useTheme } from "@/hooks";
import { IDetailReminderForm, IImage } from "@/types";
import { generateUuid } from "@/utils";
import { Button, Divider, Icon } from "@rneui/themed";
import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import ImageViewing from "react-native-image-viewing";

interface IDetailImagesReminderProps {
    images: IImage[];
    onChangeDetailReminderForm
        <T extends keyof IDetailReminderForm>
        (key: T, value: IDetailReminderForm[T]) : void
}

export default function DetailImagesReminder({
    images,
    onChangeDetailReminderForm
}: IDetailImagesReminderProps) {
    const { Layout, Fonts, Colors, darkMode: isDark } = useTheme();
    //state
    const [visible, setVisible] = useState(false);
    const [indexImage, setIndexImage] = useState(0);
    //func
    const handlePreviewImage = (index: number) => {
        setVisible(true);
        setIndexImage(index);
    }
    const handleAddImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 1,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled');
                } else if (response.errorMessage) {
                    console.log('Error:', response.errorMessage);
                } else if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
                    onChangeDetailReminderForm(
                        'images', 
                        [
                            ...images, 
                            {
                                id: generateUuid(),
                                url: response.assets[0].uri
                            }
                        ]
                    );
                }
            }
        );
    };

    const handleRemoveImage = (imageId: string) => {
        onChangeDetailReminderForm(
            'images', 
            images.filter(item => item.id !== imageId
        ))
    }
    
    return (
        <View 
            style={[
                Layout.col,
                Layout.card,
                images.length > 0 && Layout.gapSmall,
                { backgroundColor: isDark ? Colors.textGray600 : '#fff' }
            ]}
        >
            <View style={[Layout.rowHStart]}>
                <Button title="Add image" type="clear" onPress={handleAddImage}/>
            </View>
            <FlatList
                data={images}
                keyExtractor={(item) => item.id}
                renderItem={({ item: image , index}) => (        
                    <View style={[Layout.rowVSpaceBetween, Layout.paddingLayout]}>
                        <View style={[Layout.rowHCenter, Layout.gapSmall]}>
                            <TouchableOpacity onPress={() => handleRemoveImage(image.id)}>
                                <Icon name="do-not-disturb-on" size={30} color={'#ff0000'}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handlePreviewImage(index)}>
                                <Image 
                                    key={image.id}
                                    source={{ uri: image.url }} 
                                    style={Layout.imageDetail} 
                                    resizeMode="cover" 
                                />
                            </TouchableOpacity>
                            <ImageViewing
                                images={images.map(item => ({ uri: item.url }))}
                                imageIndex={indexImage}
                                visible={visible}
                                onRequestClose={() => setVisible(false)}
                            />
                            <Text style={[Fonts.textSmall, Fonts.textBold]}>Image</Text>
                        </View>
                        <Icon name="menu" size={30} color={'#959595'}/>
                    </View>
                )}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <Divider style={styles.divider}/>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 100
  },
});
