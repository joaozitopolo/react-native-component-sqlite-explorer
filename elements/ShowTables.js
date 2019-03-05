import React from 'react';

import { View, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-elements';

export default ({ tables, onPress, onLongPress }) => (
    <View style={{ margin: 8 }}>
        <Text>
            <Text h4>Tables</Text>
            &nbsp;(long press for desc)
        </Text>
        {tables && tables.map(table => (
            <View key={table.name}>
                <TouchableOpacity 
                    onPress={() => onPress(table.name)}
                    onLongPress={() => onLongPress(table.name)}
                >
                    <Text>{table.name}</Text>
                </TouchableOpacity>
            </View>)
        )}
    </View>
)
