import React, {useEffect, useState} from 'react';
import {
  Button,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';
import * as fs from 'react-native-fs';

const checkRead = async () => {
  const PERMISSION = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
  const permiso = await PermissionsAndroid.check(PERMISSION);

  if (!permiso) {
    await PermissionsAndroid.request(PERMISSION);
  }

  return permiso;
};

const checkWrite = async () => {
  const PERMISSION = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  const permiso = await PermissionsAndroid.check(PERMISSION);

  if (!permiso) {
    await PermissionsAndroid.request(PERMISSION);
  }

  return permiso;
};

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
  const [dirs, setDirs] = useState(null);
  const [status, setStatus] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permisos, setPermisos] = useState({
    read: false,
    write: false,
  });

  const checkPermissions = async () => {
    const read = await checkRead();
    const write = await checkWrite();

    setPermisos({read, write});
  };

  const handleDownloadFile = async () => {
    setLoading(true);
    const url = 'http://samples.leanpub.com/thereactnativebook-sample.pdf';
    const res = await downloadFile(url, 'sample2.pdf').catch(err =>
      setError(err),
    );
    console.log({res});
    setStatus((res as any).statusCode);
    setLoading(false);
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    fs.readDir(fs.DownloadDirectoryPath)
      .then(data => {
        setDirs(data as any);
      })
      .catch(err => setError(err));
  }, []);

  useEffect(() => {
    fs.getAllExternalFilesDirs().then(data =>
      console.log(JSON.stringify({data}, null, 4)),
    );
  }, []);

  return (
    <ScrollView style={styles.center}>
      <Text> READ: {permisos.read ? 'CON ACCESOS' : 'SIN ACCESOS'} </Text>
      <Text> WRITE: {permisos.write ? 'CON ACCESOS' : 'SIN ACCESOS'} </Text>
      <Text> STATUS: {status}</Text>
      <Button title="Descargar" onPress={handleDownloadFile} />
      {loading && <Text>Descargando...</Text>}
      <Text> Dir: {JSON.stringify(dirs, null, 4)}</Text>
      <Text> Error: {JSON.stringify(error, null, 4)}</Text>
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  center: {flex: 1},
});
