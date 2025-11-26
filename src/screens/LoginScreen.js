import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { databaseService } from '../../services/databaseService';

export default function LoginScreen({ onLogin }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [step, setStep] = useState(1); // 1 = email, 2 = código, 3 = cadastro
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Erro', 'Digite um email válido');
      return;
    }

    setLoading(true);
    
    // Primeiro verifica se o usuário existe
    const userResult = await databaseService.getUserByEmail(email);
    
    if (userResult.success) {
      if (userResult.user) {
        // Usuário existe - envia código para login
        setIsNewUser(false);
        const result = await authService.sendVerificationCode(email);
        setLoading(false);

        if (result.success) {
          setSentCode(result.code);
          setStep(2);
          Alert.alert('Código Enviado', 'Verifique seu email para o código de acesso');
        } else {
          Alert.alert('Erro', result.error);
        }
      } else {
        // Usuário não existe - envia código para cadastro
        setIsNewUser(true);
        const result = await authService.sendVerificationCode(email);
        setLoading(false);

        if (result.success) {
          setSentCode(result.code);
          setStep(2);
          Alert.alert('Cadastro', 'Email não cadastrado. Use o código para criar sua conta');
        } else {
          Alert.alert('Erro', result.error);
        }
      }
    } else {
      setLoading(false);
      Alert.alert('Erro', 'Falha ao verificar usuário');
    }
  };

  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert('Erro', 'Digite o código de verificação');
      return;
    }

    if (!authService.validateCode(code, sentCode)) {
      Alert.alert('Erro', 'Código inválido');
      return;
    }

    setVerifying(true);

    try {
      if (isNewUser) {
        // CADASTRO DE NOVO USUÁRIO - CORRIGIDO
        const userData = {
          email: email.toLowerCase().trim(),
          type: 'admin', // Novo usuário é admin
          nome: 'Administrador', // Nome padrão
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        const createResult = await databaseService.createUser(userData);
        
        if (createResult.success) {
          const userDataWithId = { 
            ...userData, 
            id: createResult.id,
            userId: createResult.id // Adiciona userId para compatibilidade
          };
          console.log('✅ Novo usuário cadastrado:', userDataWithId);
          
          setTimeout(() => {
            setVerifying(false);
            onLogin(userDataWithId);
          }, 1000);
        } else {
          Alert.alert('Erro no Cadastro', createResult.error || 'Erro ao criar usuário');
          setVerifying(false);
        }
      } else {
        // LOGIN DE USUÁRIO EXISTENTE - CORRIGIDO
        const userResult = await databaseService.getUserByEmail(email);
        
        if (userResult.success && userResult.user) {
          // CORREÇÃO: Não precisa atualizar lastLogin aqui se não for crítico
          // Ou usar um método específico para atualizar usuário global
          console.log('✅ Login realizado:', userResult.user);
          
          // Preparar dados do usuário para compatibilidade
          const userData = {
            ...userResult.user,
            userId: userResult.user.id // Garantir que userId existe
          };
          
          setTimeout(() => {
            setVerifying(false);
            onLogin(userData);
          }, 1000);
        } else {
          Alert.alert('Erro', 'Usuário não encontrado');
          setVerifying(false);
        }
      }
    } catch (error) {
      console.error('💥 Erro no processo:', error);
      Alert.alert('Erro', 'Erro inesperado: ' + error.message);
      setVerifying(false);
    }
  };

  // Função alternativa para atualizar lastLogin (se necessário)
  const updateUserLastLogin = async (userId) => {
    try {
      // Usar update diretamente no nó do usuário
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, {
        lastLogin: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao atualizar lastLogin:', error);
      // Não bloquear o login por esse erro
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.header}>
        <Ionicons name="cut" size={80} color="#007AFF" />
        <Text style={styles.title}>Studio</Text>
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
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Continuar</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>
              {isNewUser ? 'Cadastro - Código de Verificação' : 'Login - Código de Verificação'}
            </Text>
            <Text style={styles.subLabel}>Enviamos para {email}</Text>
            
            {isNewUser && (
              <Text style={styles.newUserText}>
                🎉 Nova conta será criada para este email
              </Text>
            )}
            
            <TextInput
              style={styles.input}
              placeholder="000000"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              maxLength={6}
            />
            
            <TouchableOpacity 
              style={[styles.button, verifying && styles.buttonDisabled]} 
              onPress={handleVerifyCode}
              disabled={verifying}
            >
              {verifying ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>
                  {isNewUser ? 'Criar Conta' : 'Entrar'}
                </Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(1)}>
              <Text style={styles.secondaryButtonText}>↩️ Voltar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    color: '#333',
    textAlign: 'center'
  },
  subLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center'
  },
  newUserText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    backgroundColor: '#f0fff4',
    padding: 10,
    borderRadius: 8
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
  }
});