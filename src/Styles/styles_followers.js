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
    marginBottom: 15,
    textAlign: 'left',
  },

  cardUser: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },

  userUsername: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },

  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 30,
  },

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  paginationButton: {
    flex: 0.45,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  paginationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  buttonFollow: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  buttonUnfollow: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default styles;
