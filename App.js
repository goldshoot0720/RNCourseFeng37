import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Image, Platform, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Feng37() {
  const [bankSavings, setBankSavings] = useState(Array(10).fill(0));
  const [saving, setSaving] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sumSaving, setSumSaving] = useState(0);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setSaving(bankSavings[0]);
    setSelectedIndex(0);
    setSumSaving(bankSavings.reduce((sum, num) => sum + parseInt(num), 0));

    const fetchUserName = async () => {
      try {
        const storedUserName = await AsyncStorage.getItem("userName");
        if (storedUserName) {
          setUserName(storedUserName);
          fetchUserData(storedUserName);
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };
    fetchUserName();
  }, []);

  function fetchUserData(user) {
    fetch("https://rncoursefeng37.onrender.com/LoadData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: user }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.bankSavings);  // Log the bankSavings array to check its content
        if (data.success) {
          const cleanedSavings = data.bankSavings.map(value => {
            // Ensure every value is an integer or default to 0
            return isNaN(value) ? 0 : parseInt(value);
          });
          setBankSavings(cleanedSavings);
          setSumSaving(cleanedSavings.reduce((sum, num) => sum + num, 0));
          setSaving(cleanedSavings[selectedIndex]);
        } else {
          showAlert("錯誤", "無法讀取該使用者的資料");
        }
      })
      .catch(() =>
        showAlert("錯誤", "無法連接到伺服器")
      );
  }

  function showAlert(title, message) {
    if (Platform.OS === 'web') {
      alert(message);
    } else {
      Alert.alert(title, message, [{ text: "OK" }]);
    }
  }

  function handleSelectChange(itemValue) {
    let index = itemValue;
    setSelectedIndex(index);
    setSaving(bankSavings[index]);
  }

  function handleInputChange(text) {
    const value = parseInt(text);
    if (isNaN(value) || value < 0) {
      setSumSaving("請輸入正整數或零");
      setSaving(0);
      let updatedSavings = [...bankSavings];
      updatedSavings[selectedIndex] = 0;
      setBankSavings(updatedSavings);
    } else {
      let updatedSavings = [...bankSavings];
      updatedSavings[selectedIndex] = value;
      setBankSavings(updatedSavings);
      setSaving(value);
      setSumSaving(updatedSavings.reduce((sum, num) => sum + num, 0));
    }
  }

  function handleUserNameChange(text) {
    setUserName(text);
  }

  function handleLoadData() {
    if (!userName) {
      showAlert("讀檔", "臨時使用者名稱不得為空值");
      return;
    }
    AsyncStorage.setItem("userName", userName);
    fetchUserData(userName);
  }

  function handleSaveData() {
    if (!userName) {
      showAlert("存檔", "臨時使用者名稱不得為空值");
      return;
    }
    AsyncStorage.setItem("userName", userName);

    fetch("https://rncoursefeng37.onrender.com/SaveData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: userName,
        bankSavings: bankSavings,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showAlert("成功", "資料已成功儲存");
        } else {
          showAlert("錯誤", "儲存資料時發生錯誤");
        }
      })
      .catch(() =>
        showAlert("錯誤", "無法連接到伺服器")
      );
  }

  function handleEgg() {
    showAlert(
      "㊣高考三級資訊處理榜首㊣",
      "委任第五職等\n簡任第十二職等\n第12屆臺北市長\n第23任總統\n中央銀行鋒兄分行"
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          React Native_鋒兄三七_銀行
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>臨時使用者名稱：</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={handleUserNameChange}
            placeholder="請輸入使用者名稱"
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>金融機構：</Text>
          <Picker
            selectedValue={selectedIndex}
            style={styles.picker}
            onValueChange={handleSelectChange}
          >
            <Picker.Item label="(006)合作金庫(5880)" value={0} />
            <Picker.Item label="(012)台北富邦(2881)" value={1} />
            <Picker.Item label="(013)國泰世華(2882)" value={2} />
            <Picker.Item label="(017)兆豐銀行(2886)" value={3} />
            <Picker.Item label="(048)王道銀行(2897)" value={4} />
            <Picker.Item label="(103)新光銀行(2888)" value={5} />
            <Picker.Item label="(700)中華郵政" value={6} />
            <Picker.Item label="(808)玉山銀行(2884)" value={7} />
            <Picker.Item label="(812)台新銀行(2887)" value={8} />
            <Picker.Item label="(822)中國信託(2891)" value={9} />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>存款金額：</Text>
          <TextInput
            style={styles.input}
            value={String(saving)}
            onChangeText={handleInputChange}
            keyboardType="numeric"
            placeholder="請輸入存款金額"
            placeholderTextColor="#6B7280"
          />
        </View>

        <Text style={styles.total}>累積存款：</Text>
        <Text style={styles.sumText}>{sumSaving}</Text>

        <View style={styles.buttonContainer}>
          <Button title="讀檔" onPress={handleLoadData} />
          <Button title="存檔" onPress={handleSaveData} />
          <Button title="彩蛋" onPress={handleEgg} />
        </View>

        <View style={styles.imageContainer}>
          <Image source={require('./assets/YuShan.jpg')} style={styles.image} />
          <Image source={require('./assets/PiggyBank.jpg')} style={styles.image} />
          <Image source={require('./assets/IMG_0032.jpg')} style={styles.image} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 22,
    color: '#1F2937',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    width: '90%',
    maxWidth: 350,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 60,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#A5B4FC',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 10,
    marginTop: 10,
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
    boxShadow: '0 2px 3px rgba(0, 0, 0, 0.2)', // Replace shadow properties with boxShadow
    minWidth: 150, // Set a minimum width to ensure enough space
  },
  total: {
    fontSize: 18,
    color: '#374151',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  sumText: {
    fontSize: 22,
    color: '#34D399',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    maxWidth: 350,
    marginTop: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  image: {
    width: 60,
    height: 60,
    marginHorizontal: 10,
    borderRadius: 8,
  },
});
