import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  textInput: {
    backgroundColor: '#fff',
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  counter: {
    textAlign: 'right',
    color: '#555',
    marginTop: 5,
  },
  button: {
    marginTop: 15,
    backgroundColor: '#4CAF50',
    padding: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  cancelText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default styles;
