import { StyleSheet } from 'react-native';
import { transparent } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

export const styles = StyleSheet.create({
    card:{
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
        
        
    },
    button_: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    buttonSignUp: {
        width: 250,
        height: 50,
        marginTop: 10,
    },
    buttonTextSignUp: {
        color: '#000000ff',
        textAlign: 'left',
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
});
export default styles;