import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, deleteTask } from '../redux/slices/taskSlice';

const TaskDetailsScreen = ({ route, navigation }: any) => {
  const { task } = route.params;
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.tasks.loading);
  
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateTask = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Both fields are required.');
      return;
    }
  
    console.log("v==task", task);
  
    const updatedTask = { 
      id: task._id,  // Fix: Pass 'id' instead of '_id'
      title, 
      description,
      status: task.status // Preserve existing status if needed
    };
  
    dispatch(updateTask(updatedTask))
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'Task updated successfully.');
        setIsEditing(false);
      })
      .catch(() => {
        Alert.alert('Error', 'Failed to update task.');
      });
  };
  const handleDeleteTask = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteTask(task._id))
              .unwrap()
              .then(() => {
                Alert.alert('Deleted', 'Task deleted successfully.');
                navigation.goBack();
              })
              .catch(() => {
                Alert.alert('Error', 'Failed to delete task.');
              });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
  
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={[styles.input, isEditing ? styles.editable : styles.disabled]}
          value={title}
          onChangeText={setTitle}
          editable={isEditing}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, isEditing ? styles.editable : styles.disabled]}
          value={description}
          onChangeText={setDescription}
          multiline
          editable={isEditing}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.updateButton]} 
            onPress={isEditing ? handleUpdateTask : () => setIsEditing(true)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{isEditing ? (loading ? 'Updating...' : 'Update Task') : 'Edit Task'}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]} 
            onPress={handleDeleteTask}
          >
            <Text style={styles.buttonText}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TaskDetailsScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  editable: {
    borderColor: '#007bff',
    backgroundColor: '#fff',
  },
  disabled: {
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  updateButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
});
