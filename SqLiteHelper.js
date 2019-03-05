import { SQLite, FileSystem } from 'expo'

class SqLiteHelper {

    static SQLitePath = FileSystem.documentDirectory + 'SQLite/'

    static ALL_TABLES = "select name from sqlite_master where type='table' and name not like 'sqlite_%'"

    /** open SqLite db and prepare the table list */
    open(filename) {
        return new Promise(async (resolve, reject) => {
            try {
                let fileInfo = await this.exists(SqLiteHelper.SQLitePath + filename)
                if(fileInfo.exists) {
                    let db = SQLite.openDatabase(filename, null, null, null)
                    let tx = await new Promise(resolve => db.transaction(resolve))
                    let rs = await new Promise(resolve => tx.executeSql(SqLiteHelper.ALL_TABLES, null, (tx, rs) => resolve(rs)))
                    let tables = rs.rows._array
                    resolve({loaded: true, db, tables })
                } else {
                    let files = await FileSystem.readDirectoryAsync(SqLiteHelper.SQLitePath)
                    console.log('files', files)
                    resolve({ loaded: false })
                }
            } catch (error) {
                reject(error)
            }
        })

    }

    executeSql(db, sql) {
        return new Promise(async resolve => {
            let tx = await new Promise(resolve => db.transaction(resolve))
            tx.executeSql(sql, null, (tx, rs) => {
                resolve({ ...rs, sql })
            }, error => {
                resolve({ error: JSON.stringify(error) })
            })
        })
    }

    exists(file) {
        return new Promise(resolve => {
            FileSystem.getInfoAsync(file).then(resolve) // { exists: false } | { exists: true } 
        })
    }



}

export default SqLiteHelper