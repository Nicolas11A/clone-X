import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#000',
  },
  cardUser: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2, // sombra sutil
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  userUsername: {
    color: '#4CAF50',
    fontSize: 14,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
});

export default styles;
