import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ onLogin }) {
  const [phoneNumber, setPhoneNumber] = React.useState('');

  const handleLogin = () => {
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      Alert.alert('Atenção', 'Digite um número de telefone válido com DDD');
      return;
    }

    // Login automático
    Alert.alert('Sucesso', 'Login realizado com sucesso!', [
      { text: 'OK', onPress: onLogin }
    ]);
  };

  const formatPhone = (text) => {
    const clean = text.replace(/\D/g, '');
    if (clean.length <= 2) return clean;
    if (clean.length <= 6) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    if (clean.length <= 10) return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`;
  };

  return React.createElement(
    ScrollView,
    {
      contentContainerStyle: styles.container
    },
    [
      React.createElement(
        View,
        {
          key: 'header',
          style: styles.header
        },
        [
          React.createElement(Ionicons, {
            key: 'icon',
            name: 'cut',
            size: 80,
            color: '#007AFF'
          }),
          React.createElement(Text, {
            key: 'title',
            style: styles.title
          }, 'App Barber'),
          React.createElement(Text, {
            key: 'subtitle',
            style: styles.subtitle
          }, 'Sistema de Gestão')
        ]
      ),

      React.createElement(
        View,
        {
          key: 'form',
          style: styles.form
        },
        [
          React.createElement(Text, {
            key: 'label',
            style: styles.label
          }, 'Número de Telefone'),
          React.createElement(TextInput, {
            key: 'input',
            style: styles.input,
            placeholder: '(11) 99999-9999',
            value: phoneNumber,
            onChangeText: (text) => setPhoneNumber(formatPhone(text)),
            keyboardType: 'phone-pad'
          }),
          React.createElement(TouchableOpacity, {
            key: 'button',
            style: styles.button,
            onPress: handleLogin
          },
            React.createElement(Text, {
              style: styles.buttonText
            }, 'Entrar no Sistema')
          )
        ]
      ),

      React.createElement(
        TouchableOpacity,
        {
          key: 'devButton',
          style: styles.devButton,
          onPress: onLogin
        },
        React.createElement(Text, {
          style: styles.devButtonText
        }, 'Entrar como Desenvolvedor')
      )
    ]
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  header: {
    alignItems: 'center',
    marginBottom: 50
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  devButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  devButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});