import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, TextInput, ScrollView, Modal} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { databaseService } from '../../services/databaseService';

export default function FuncionariosScreen({ theme, styles, user }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState(null);
  const [showFuncoes, setShowFuncoes] = useState(false);

  const [formData, setFormData] = useState({ 
    nome: '', 
    telefone: '', 
    email: '', 
    funcao: 'Barbeiro', 
    status: 'ativo' 
  });

  const [errors, setErrors] = useState({});

  // PERMITIR TODOS OS USUÁRIOS ADMINISTRAR FUNCIONÁRIOS
  const canEdit = true; // Remover restrição

  const funcoes = ['Barbeiro', 'Barbeira', 'Recepcionista', 'Gerente', 'Auxiliar'];

  useEffect(() => { 
    loadFuncionarios(); 
  }, []);

  const loadFuncionarios = async () => {
    const result = await databaseService.read('funcionarios');
    if (result.success) setFuncionarios(result.data);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome || formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.telefone || formData.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = 'Telefone deve ter pelo menos 10 dígitos';
    }

    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Email deve ser válido';
    }

    if (!formData.funcao) {
      newErrors.funcao = 'Selecione uma função';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Corrija os erros antes de salvar');
      return;
    }

    const result = editingFuncionario 
      ? await databaseService.update('funcionarios', editingFuncionario.id, formData)
      : await databaseService.create('funcionarios', formData);

    if (result.success) {
      await loadFuncionarios();
      setModalVisible(false);
      resetForm();
      Alert.alert('Sucesso', editingFuncionario ? 'Funcionário atualizado!' : 'Funcionário adicionado!');
    } else {
      Alert.alert('Erro', result.error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirmar', 'Excluir este funcionário?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        onPress: async () => {
          const result = await databaseService.delete('funcionarios', id);
          if (result.success) {
            await loadFuncionarios();
            Alert.alert('Sucesso', 'Funcionário excluído!');
          }
        }
      }
    ]);
  };

  const toggleStatus = async (id) => {
    const funcionario = funcionarios.find(f => f.id === id);
    const novoStatus = funcionario.status === 'ativo' ? 'inativo' : 'ativo';
    
    const result = await databaseService.update('funcionarios', id, { status: novoStatus });
    if (result.success) {
      await loadFuncionarios();
      Alert.alert('Sucesso', `Status alterado para ${novoStatus}`);
    }
  };

  const resetForm = () => {
    setEditingFuncionario(null);
    setFormData({ nome: '', telefone: '', email: '', funcao: 'Barbeiro', status: 'ativo' });
    setErrors({});
    setShowFuncoes(false);
  };

  const formatPhone = (text) => {
    const clean = text.replace(/\D/g, '');
    if (clean.length <= 2) return clean;
    if (clean.length <= 6) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    if (clean.length <= 10) return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`;
  };

  const renderFuncionario = ({ item }) => (
    <View style={screenStyles.card}>
      <View style={screenStyles.cardHeader}>
        <View style={screenStyles.funcionarioInfo}>
          <Text style={screenStyles.funcionarioNome}>{item.nome}</Text>
          <View style={screenStyles.funcionarioDetails}>
            <Text style={screenStyles.funcionarioFuncao}>{item.funcao}</Text>
            <View style={[screenStyles.statusBadge, { 
              backgroundColor: item.status === 'ativo' ? theme.colors.success + '20' : theme.colors.danger + '20' 
            }]}>
              <Text style={[screenStyles.statusText, { 
                color: item.status === 'ativo' ? theme.colors.success : theme.colors.danger 
              }]}>
                {item.status === 'ativo' ? 'ATIVO' : 'INATIVO'}
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[screenStyles.statusButton, { 
            backgroundColor: item.status === 'ativo' ? theme.colors.success : theme.colors.danger 
          }]}
          onPress={() => toggleStatus(item.id)}
        >
          <Ionicons 
            name={item.status === 'ativo' ? 'checkmark-circle' : 'close-circle'} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      <View style={screenStyles.contactInfo}>
        <View style={screenStyles.contactItem}>
          <Ionicons name="call" size={14} color={theme.colors.textSecondary} />
          <Text style={screenStyles.contactText}>{item.telefone}</Text>
        </View>
        <View style={screenStyles.contactItem}>
          <Ionicons name="mail" size={14} color={theme.colors.textSecondary} />
          <Text style={screenStyles.contactText}>{item.email}</Text>
        </View>
      </View>

      <View style={screenStyles.actions}>
        <TouchableOpacity 
          style={[screenStyles.actionButton, { backgroundColor: theme.colors.primary }]} 
          onPress={() => { setEditingFuncionario(item); setFormData(item); setModalVisible(true); }}
        >
          <Ionicons name="create" size={16} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[screenStyles.actionButton, { backgroundColor: theme.colors.danger }]} 
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const screenStyles = createScreenStyles(theme);

  return (
    <View style={styles.content}>
      <View style={screenStyles.header}>
        <View>
          <Text style={screenStyles.title}>Equipe</Text>
          <Text style={screenStyles.subtitle}>
            {funcionarios.filter(f => f.status === 'ativo').length} funcionários ativos
          </Text>
        </View>
        <TouchableOpacity 
          style={screenStyles.addButton} 
          onPress={() => { resetForm(); setModalVisible(true); }}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList 
        data={funcionarios} 
        renderItem={renderFuncionario} 
        keyExtractor={item => item.id} 
        style={screenStyles.list} 
        contentContainerStyle={screenStyles.listContent}
        ListEmptyComponent={
          <View style={screenStyles.emptyState}>
            <Ionicons name="people-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={screenStyles.emptyText}>Nenhum funcionário cadastrado</Text>
            <Text style={screenStyles.emptySubtext}>
              Clique no + para adicionar seu primeiro funcionário
            </Text>
          </View>
        }
      />

      {/* Modal de Funcionário */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={screenStyles.modalContainer}>
          <View style={screenStyles.modalContent}>
            <ScrollView>
              <Text style={screenStyles.modalTitle}>
                {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
              </Text>
              
              <Text style={screenStyles.modalLabel}>Nome Completo *</Text>
              <TextInput
                style={[
                  screenStyles.modalInput,
                  errors.nome && screenStyles.inputError
                ]}
                placeholder="Nome e sobrenome"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.nome}
                onChangeText={(text) => {
                  setFormData({...formData, nome: text});
                  if (errors.nome) setErrors({...errors, nome: null});
                }}
                maxLength={50}
              />
              {errors.nome && <Text style={screenStyles.errorText}>{errors.nome}</Text>}

              <Text style={screenStyles.modalLabel}>Telefone *</Text>
              <TextInput
                style={[
                  screenStyles.modalInput,
                  errors.telefone && screenStyles.inputError
                ]}
                placeholder="(11) 99999-9999"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.telefone}
                onChangeText={(text) => {
                  setFormData({...formData, telefone: formatPhone(text)});
                  if (errors.telefone) setErrors({...errors, telefone: null});
                }}
                keyboardType="phone-pad"
                maxLength={15}
              />
              {errors.telefone && <Text style={screenStyles.errorText}>{errors.telefone}</Text>}

              <Text style={screenStyles.modalLabel}>Email *</Text>
              <TextInput
                style={[
                  screenStyles.modalInput,
                  errors.email && screenStyles.inputError
                ]}
                placeholder="funcionario@barbearia.com"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({...formData, email: text});
                  if (errors.email) setErrors({...errors, email: null});
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                maxLength={100}
              />
              {errors.email && <Text style={screenStyles.errorText}>{errors.email}</Text>}

              <Text style={screenStyles.modalLabel}>Função *</Text>
              <TouchableOpacity 
                style={[
                  screenStyles.selectButton,
                  errors.funcao && screenStyles.inputError
                ]}
                onPress={() => setShowFuncoes(!showFuncoes)}
              >
                <Text style={formData.funcao ? screenStyles.selectButtonText : screenStyles.selectButtonPlaceholder}>
                  {formData.funcao || 'Selecione uma função'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              {errors.funcao && <Text style={screenStyles.errorText}>{errors.funcao}</Text>}

              {showFuncoes && (
                <View style={screenStyles.optionsContainer}>
                  {funcoes.map((funcao, index) => (
                    <TouchableOpacity
                      key={index}
                      style={screenStyles.option}
                      onPress={() => {
                        setFormData({...formData, funcao});
                        setShowFuncoes(false);
                        if (errors.funcao) setErrors({...errors, funcao: null});
                      }}
                    >
                      <Text style={screenStyles.optionText}>{funcao}</Text>
                      {formData.funcao === funcao && (
                        <Ionicons name="checkmark" size={16} color={theme.colors.primary} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <View style={screenStyles.modalButtons}>
                <TouchableOpacity 
                  style={[screenStyles.modalButton, screenStyles.cancelButton]} 
                  onPress={() => { setModalVisible(false); resetForm(); }}
                >
                  <Text style={screenStyles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[screenStyles.modalButton, screenStyles.saveButton]} 
                  onPress={handleSave}
                >
                  <Text style={screenStyles.saveButtonText}>
                    {editingFuncionario ? 'Atualizar' : 'Adicionar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createScreenStyles = (theme) => StyleSheet.create({
  content: { flex: 1, backgroundColor: theme.colors.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  subtitle: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
  addButton: { 
    backgroundColor: theme.colors.primary, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  list: { flex: 1 }, 
  listContent: { padding: 16 },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginTop: 20
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center'
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8
  },
  card: { 
    backgroundColor: theme.colors.card, 
    padding: 16, 
    marginVertical: 6, 
    borderRadius: 12, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 12 
  },
  funcionarioInfo: { flex: 1 },
  funcionarioNome: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 6 },
  funcionarioDetails: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  funcionarioFuncao: { 
    fontSize: 14, 
    color: theme.colors.primary, 
    fontWeight: '600' 
  },
  statusBadge: { 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 8 
  },
  statusText: { 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  statusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contactInfo: {
    gap: 6,
    marginBottom: 12
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  contactText: {
    fontSize: 14,
    color: theme.colors.textSecondary
  },
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginTop: 8 
  },
  actionButton: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 8 
  },
  
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8,
    marginTop: 8
  },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background
  },
  inputError: {
    borderColor: theme.colors.danger
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    backgroundColor: theme.colors.background,
    marginBottom: 8
  },
  selectButtonText: {
    fontSize: 16,
    color: theme.colors.text
  },
  selectButtonPlaceholder: {
    fontSize: 16,
    color: theme.colors.textSecondary
  },
  optionsContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    marginBottom: 8,
    maxHeight: 200
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  optionText: {
    fontSize: 14,
    color: theme.colors.text
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  cancelButton: {
    backgroundColor: theme.colors.border
  },
  saveButton: {
    backgroundColor: theme.colors.primary
  },
  cancelButtonText: {
    color: theme.colors.text,
    fontWeight: '600'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600'
  }
});