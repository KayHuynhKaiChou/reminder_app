import React from 'react'
import WidgetSummary from '@/components/Widget/WidgetSummary'
import { useTheme } from '@/hooks'
import { StyleSheet, View } from 'react-native'
import { HomeState, updateWidgets } from '@/store/home'
import { useDispatch, useSelector } from 'react-redux'
import ItemSummary from './ItemSummary'
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { Divider } from '@rneui/themed'
import { IWidgetSummary } from '@/types'

export default function Summary() {
    //hooks
    const {Layout, Colors, darkMode: isDark} = useTheme()
    const {isEdit, widgets} = useSelector((state: {home: HomeState}) => state.home)
    const [widgetsState, setWidgetsState] = React.useState(widgets)
    const dispatch = useDispatch()
    //func
    const handleUpdateWidgets = (widgets: IWidgetSummary[]) => {
        setWidgetsState(widgets)
    }
    return (
        <>
            {isEdit ? (
                <DraggableFlatList
                    data={widgetsState}
                    // activationDistance={70}
                    initialNumToRender={6}
                    onDragEnd={({ data }) => handleUpdateWidgets(data)}
                    keyExtractor={item => item.id}
                    contentContainerStyle={[
                        styles.summaryContainer,
                        {backgroundColor: isDark ? Colors.textGray600 : '#fff'}
                    ]}
                    renderItem={
                        ({item, drag, isActive}) => (
                            <ScaleDecorator key={item.id} activeScale={1.05}>
                                <ItemSummary 
                                    widgetData={item} 
                                    onPressIn={drag}
                                    isActive={isActive}
                                />
                            </ScaleDecorator>
                        )
                    }
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => <Divider style={styles.divider}/>}
                />
            ) : (
                <View style={[Layout.rowWrap, Layout.gap]}>
                    {
                        widgets
                            .filter(widget => widget.checked)
                            .map(widget => (
                                <WidgetSummary
                                    key={widget.id}
                                    widgetData={widget}
                                />
                            ))
                    }
                </View>
            )}
        </>
        
    )
}

const styles = StyleSheet.create({
  summaryContainer: {
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 100
  },
});
