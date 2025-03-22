import React, { useState } from 'react';
import { 
  SafeAreaView, View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../redux/slices/taskSlice';

const AddTaskScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.tasks.loading);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddTask = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Both fields are required.');
      return;
    }

    const newTask = { title, description };
    
    dispatch(addTask(newTask))
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'Task added successfully.');
        navigation.goBack(); // Go back to HomeScreen
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to add task.');
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddTask} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Task'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddTaskScreen;

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  label: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5, 
    color: '#333', 
    alignSelf: 'flex-start' 
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    opacity: 0.8,
  },
  buttonText: { 
    fontSize: 18, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
});
