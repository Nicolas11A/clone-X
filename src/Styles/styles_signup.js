import { StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

export const styles = StyleSheet.create({
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        marginLeft: 10
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
        alignSelf: 'center',
    },
    toggleButton: {
        position: 'absolute',
        right: 10,
        top: 55,
        padding: 5,
    },
    Card:{
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 20,
    },
    buttonLogIn: {
        width: 200,
        height: 50,
        marginTop: 10,
    },
    buttonTextLogIn: {
        color: '#000000ff',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    
        
});
export default styles;
