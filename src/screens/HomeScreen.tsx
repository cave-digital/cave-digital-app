import React, { useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, 
  ActivityIndicator, StyleSheet, Image, SafeAreaView 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchTasks } from '../redux/slices/taskSlice';
import { logout } from '../redux/slices/authSlice';

// Import images
import LogoutIcon from '../../assets/images/logout.png';
import AddIcon from '../../assets/images/add.png';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state: any) => state.tasks);

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchTasks());
    }, [dispatch])
  );

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('LoginScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Task Manager</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => navigation.navigate('AddTaskScreen')} style={styles.iconButton}>
              <Image source={AddIcon} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.iconButton}>
              <Image source={LogoutIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Task List */}
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
        ) : tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks added yet.</Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item, index) => (item?._id ? item._id.toString() : index.toString())}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.taskItem}
                onPress={() => navigation.navigate('TaskDetailsScreen', { task: item })}
              >
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskDescription}>{item.description}</Text>
              </TouchableOpacity>
            )}
            refreshing={loading}
            onRefresh={() => dispatch(fetchTasks())}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#007bff' },
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Header Styles
  header: {
    backgroundColor: '#007bff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerButtons: { flexDirection: 'row', gap: 10 },
  iconButton: { padding: 10, borderRadius: 10 },
  icon: { width: 28, height: 28, tintColor: '#fff' },

  // Task List Styles
  taskItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  taskDescription: { fontSize: 14, color: '#666' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#777', marginTop: 20 },
  loader: { marginTop: 20 },
});
