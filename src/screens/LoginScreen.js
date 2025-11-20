import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { databaseService } from '../../services/databaseService';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Erro', 'Digite um email válido');
      return;
    }

    setLoading(true);
    const result = await authService.sendVerificationCode(email);
    setLoading(false);

    if (result.success) {
      setSentCode(result.code);
      setStep(2);
      Alert.alert('Sucesso', 'Código enviado para seu email!');
    } else {
      Alert.alert('Erro', result.error);
    }
  };

  const handleVerifyCode = async () => {
    if (!authService.validateCode(code, sentCode)) {
      Alert.alert('Erro', 'Código inválido');
      return;
    }

    const userResult = await databaseService.getUserByEmail(email);
    let userData;

    if (userResult.success) {
      if (userResult.user) {
        userData = userResult.user;
      } else {
        userData = {
          email,
          type: 'client',
          createdAt: new Date().toISOString()
        };
        const saveResult = await databaseService.create('users', userData);
        if (!saveResult.success) {
          Alert.alert('Erro', 'Falha ao criar usuário');
          return;
        }
        userData.id = saveResult.id;
      }
      
      Alert.alert('Sucesso', 'Login realizado!', [
        { text: 'OK', onPress: () => onLogin(userData) }
      ]);
    } else {
      Alert.alert('Erro', 'Falha no login');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="cut" size={80} color="#007AFF" />
        <Text style={styles.title}>App Barber</Text>
        <Text style={styles.subtitle}>Sistema de Gestão</Text>
      </View>

      <View style={styles.form}>
        {step === 1 ? (
          <>
            <Text style={styles.label}>Email de Acesso</Text>
            <TextInput
              style={styles.input}
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleSendCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Enviando...' : 'Enviar Código'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>Código de Verificação</Text>
            <Text style={styles.subLabel}>Enviamos para {email}</Text>
            <TextInput
              style={styles.input}
              placeholder="000000"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
              <Text style={styles.buttonText}>Verificar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(1)}>
              <Text style={styles.secondaryButtonText}>Voltar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.devButton} onPress={() => onLogin({ id: 'dev', email: 'dev@barber.com', type: 'admin' })}>
        <Text style={styles.devButtonText}>Entrar como Desenvolvedor</Text>
      </TouchableOpacity>
    </ScrollView>
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
  subLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF'
  },
  secondaryButtonText: {
    color: '#007AFF',
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