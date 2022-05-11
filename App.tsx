import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import * as fs from 'react-native-fs';

const downloadFile = async (url: string, fileName: string) =>
  new Promise(async (resolve, reject) => {
    try {
      const {promise} = fs.downloadFile({
        fromUrl: url,
        toFile: `${fs.DownloadDirectoryPath}/${fileName}`,
      });
      const res = await promise;
      resolve(res);
    } catch (error) {
      console.log({error});
      reject(error);
    }
  });

const App = () => {
  const [loading, setLoading] = useState(false);

  const handleDownloadFile = async () => {
    setLoading(true);
    const url = 'http://samples.leanpub.com/thereactnativebook-sample.pdf';
    const res = await downloadFile(url, 'sample2.pdf');
    console.log({res});
    setLoading(false);
  };

  return (
    <View style={styles.center}>
      <Button title="Descargar" onPress={handleDownloadFile} />
      {loading && <Text>Descargando...</Text>}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
