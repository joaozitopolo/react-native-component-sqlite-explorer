import React from 'react';

import { View } from 'react-native'
import { Text } from 'react-native-elements';

export default ({ logs }) => (
    <View style={{ margin: 8 }}>
        <Text>
            <Text h4>Logs</Text>
            &nbsp;(most recent on top)
        </Text>

        {logs && logs.map((log, i) => (
            <View key={i}>
                <Text style={{ fontWeight: 'bold' }}>{log.sql}</Text>
                {log.rowsAffected
                    ? <Text>Rows Affected: {log.rowsAffected}</Text>
                    : <Text>{JSON.stringify(log.rows._array, null, '  ')}</Text>
                }
            </View>)
        )}
    </View>
)
