import React, { PureComponent } from 'react';
import { Text, Header, Input, Button } from 'react-native-elements';
import { View, ScrollView } from 'react-native'
import SqLiteHelper from './SqLiteHelper';
import ShowTables from './elements/ShowTables';
import ShowLogs from './elements/ShowLogs';

class SqLiteExplorer extends React.Component {

    state = {
        filename: '',
        loaded: false,
        reason: null,
        db: undefined,
        tables: [],
        logs: [], // { command, result}
        sql: '',
        sqlError: undefined,
    }

    componentDidMount() {
        this.setState({ filename: this.props.filename || ''})
    }

    helper = new SqLiteHelper()

    render() {
        let { filename, reason, loaded, tables, sql, sqlError, logs } = this.state
        return (
            <View style={{ flex: 1, flexDirection: 'column'}}>
                <Header
                    centerComponent={{ text: 'SqLiteExplorer' }}
                />
                <ScrollView style={{ flex: 1 }}>
                    <Input
                        placeholder="SqLite File Name"
                        value={filename}
                        onChangeText={this._onChangeText('filename')}
                        errorMessage={reason}
                    />
                    <Button
                        title="open / reload"
                        onPress={this._onFileOpen}
                    />
                    {loaded &&
                        <View style={{ marginBottom: 24 }}>
                            <Input
                                placeholder="Sql Command"
                                value={sql}
                                onChangeText={this._onChangeText('sql')}
                                errorMessage={sqlError}
                                numberOfLines={3}
                                multiline
                            />
                            <Button
                                title="run"
                                onPress={this._onRunSql}
                            />
                            <ShowTables tables={tables} onPress={this._onPressTable} onLongPress={this._onLongPressTable} />
                            <ShowLogs logs={logs} />
                        </View>
                    }
                </ScrollView>

            </View>
        )
    }

    _onChangeText = field => text => this.setState({ [field]: text })

    _onFileOpen = () => {
        let { filename } = this.state
        this.helper.open(filename).then(state => this.setState({ ...state, logs: [] }))
    }

    _onRunSql = () => {
        let { db, sql, logs } = this.state
        this.helper.executeSql(db, sql).then(data => {
            let sqlError = data.error || undefined
            if (!data.error) {
                let recent = logs.filter(log => log.sql != data.sql)
                logs = [data, ...recent]
            }
            this.setState({ sql, sqlError, logs })
        })
    }

    _onPressTable = table => {
        this.setState({ sql: `select * from "${table}"` })
    }

    _onLongPressTable = table => {
        let { db, logs } = this.state
        let sql = `PRAGMA table_info("${table}")`
        this.helper.executeSql(db, sql).then(data => {
            if (!data.error) {
                data.sql = table
                let recent = logs.filter(log => log.sql != data.sql)
                logs = [data, ...recent]
            }
            this.setState({ logs })
        })
    }


}

export default SqLiteExplorer