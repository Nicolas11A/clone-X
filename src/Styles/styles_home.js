import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerUsername: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  headerIcon: {
    paddingHorizontal: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  logoPlaceholder: {
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic',
  },
  tweetCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  tweetAuthor: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  tweetText: {
    color: '#333',
    marginBottom: 10,
  },
  tweetImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  noTweets: {
    textAlign: 'center',
    color: '#555',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#4CAF50',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 20,
    alignSelf: 'center',
  },
  imageHeader: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  tweetDate: {
    color: '#777',
    fontSize: 12,
    marginBottom: 20,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  likeCount: {
    color: '#333',
    fontWeight: 'bold',
    marginLeft: -6, // para que quede pegado al ícono
  },
  likeIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
});

export default styles;
