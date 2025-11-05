import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: '#4CAF50',
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 20,
  },
  followText: {
    color: '#000',
    fontSize: 15,
  },
  followCount: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#000',
  },
  tweetCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  tweetAuthor: {
    fontWeight: 'bold',
    color: '#000',
  },
  tweetDate: {
    color: '#777',
    fontSize: 12,
    marginBottom: 5,
  },
  tweetText: {
    color: '#333',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  likeCount: {
    color: '#333',
    fontWeight: 'bold',
  },
  noTweets: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  imageHeader: {
    width: 30,
    height: 30,
    alignSelf: 'center',
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
  headerIcon: {
    paddingHorizontal: 8,
  },
});

export default styles;
