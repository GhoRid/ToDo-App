import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import { useEffect, useState } from "react";
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({}); // [{text: "text", id: 1}, {text: "text2", id: 2}

  const travel = () => setWorking(false);
  const work = () => setWorking(true);

  const onChangeText = (payload) => setText(payload);

  /**
   * toDos를 모바일 localstorage에 저장하는 함수
   */
  const saveTodosInStorage = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDosFromStorage = async () => {
    if (await AsyncStorage.getItem(STORAGE_KEY)) {
      setToDos(JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)));
    }
  };

  const addTodo = () => {
    if (text === "") {
      return;
    }
    //동기적 처리를 위해 새로운 변수를 만들어서 처리함.
    setToDos((prev) => {
      const newTodos = {
        ...prev,
        [Date.now()]: { text, working },
      };
      saveTodosInStorage(newTodos);
      return newTodos;
    });

    alert(text);
    setText("");
  };

  const deleteTodo = (id) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "I'm Sure",
        style: "destructive",
        onPress: () => {
          const newTodos = { ...toDos };
          delete newTodos[id];
          setToDos(newTodos);
          saveTodosInStorage(newTodos);
        },
      },
    ]);
  };

  useEffect(() => {
    loadToDosFromStorage();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.grey : "white" }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onChangeText={onChangeText}
          onSubmitEditing={addTodo}
          value={text}
          returnKeyType="done"
          style={styles.input}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        />
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? ( //toDos에서 working이 현재 working과 같은 것만 보여줌. false면 false인 것만 보여주는데 이것이 travel임.
            <View key={key} style={styles.toDo}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  deleteTodo(key);
                }}
              >
                <Fontisto name="trash" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 40,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.todoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
