import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, TextInput, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { databaseService } from '../../services/databaseService';

export default function ServicosScreen({ theme, styles, user }) { // ← user adicionado
  const [servicos, setServicos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingServico, setEditingServico] = useState(null);

  const [formData, setFormData] = useState({ 
    nome: '', 
    preco: '', 
    duracao: '', 
    descricao: '' 
  });

  const [errors, setErrors] = useState({});

  useEffect(() => { 
    if (user?.id) {
      loadServicos(); 
    }
  }, [user]); // ← adicionar user como dependência

  const loadServicos = async () => {
    const result = await databaseService.read('servicos', user.id); // ← user.id
    if (result.success) setServicos(result.data);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome || formData.nome.length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.preco || parseFloat(formData.preco) <= 0) {
      newErrors.preco = 'Preço deve ser maior que zero';
    }

    if (!formData.duracao || parseInt(formData.duracao) <= 0) {
      newErrors.duracao = 'Duração deve ser maior que zero';
    }

    if (parseInt(formData.duracao) > 240) {
      newErrors.duracao = 'Duração máxima é 240 minutos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Erro', 'Corrija os erros antes de salvar');
      return;
    }

    const servicoData = {
      ...formData,
      preco: parseFloat(formData.preco),
      duracao: parseInt(formData.duracao)
    };

    const result = editingServico 
      ? await databaseService.update('servicos', editingServico.id, servicoData, user.id) // ← user.id
      : await databaseService.create('servicos', servicoData, user.id); // ← user.id

    if (result.success) {
      await loadServicos();
      setModalVisible(false);
      resetForm();
      Alert.alert('Sucesso', editingServico ? 'Serviço atualizado!' : 'Serviço criado!');
    } else {
      Alert.alert('Erro', result.error);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirmar', 'Excluir este serviço?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Excluir', 
        onPress: async () => {
          const result = await databaseService.delete('servicos', id, user.id); // ← user.id
          if (result.success) {
            await loadServicos();
            Alert.alert('Sucesso', 'Serviço excluído!');
          }
        }
      }
    ]);
  };

  const resetForm = () => {
    setEditingServico(null);
    setFormData({ nome: '', preco: '', duracao: '', descricao: '' });
    setErrors({});
  };

  const formatPrice = (text) => {
    // Remove tudo que não é número ou vírgula/ponto
    const clean = text.replace(/[^\d,.]/g, '');
    
    // Substitui vírgula por ponto para cálculo
    const numericValue = clean.replace(',', '.');
    
    // Verifica se é um número válido
    if (numericValue === '' || numericValue === '.') {
      return clean;
    }
    
    return clean;
  };

  const renderServico = ({ item }) => (
    <View style={screenStyles.card}>
      <View style={screenStyles.cardHeader}>
        <View style={screenStyles.servicoInfo}>
          <Text style={screenStyles.servicoNome}>{item.nome}</Text>
          <Text style={screenStyles.servicoPreco}>R$ {item.preco}</Text>
        </View>
        <Text style={screenStyles.servicoDuracao}>⏱ {item.duracao}min</Text>
      </View>
      
      {item.descricao ? (
        <Text style={screenStyles.cardInfo}>{item.descricao}</Text>
      ) : null}
      
      <View style={screenStyles.actions}>
        <TouchableOpacity 
          style={[screenStyles.actionButton, { backgroundColor: theme.colors.primary }]} 
          onPress={() => { 
            setEditingServico(item); 
            setFormData({ 
              ...item, 
              preco: item.preco.toString(), 
              duracao: item.duracao.toString() 
            }); 
            setModalVisible(true); 
          }}
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
        <Text style={screenStyles.title}>Serviços</Text>
        <TouchableOpacity 
          style={screenStyles.addButton} 
          onPress={() => { resetForm(); setModalVisible(true); }}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList 
        data={servicos} 
        renderItem={renderServico} 
        keyExtractor={item => item.id} 
        style={screenStyles.list} 
        contentContainerStyle={screenStyles.listContent}
        ListEmptyComponent={
          <View style={screenStyles.emptyState}>
            <Ionicons name="cut-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={screenStyles.emptyText}>Nenhum serviço cadastrado</Text>
            <Text style={screenStyles.emptySubtext}>
              Clique no + para adicionar seu primeiro serviço
            </Text>
          </View>
        }
      />

      {/* Modal de Serviço */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={screenStyles.modalContainer}>
          <View style={screenStyles.modalContent}>
            <ScrollView>
              <Text style={screenStyles.modalTitle}>
                {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
              </Text>
              
              <Text style={screenStyles.modalLabel}>Nome do Serviço *</Text>
              <TextInput
                style={[
                  screenStyles.modalInput,
                  errors.nome && screenStyles.inputError
                ]}
                placeholder="Ex: Corte Social, Barba, etc."
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.nome}
                onChangeText={(text) => {
                  setFormData({...formData, nome: text});
                  if (errors.nome) setErrors({...errors, nome: null});
                }}
                maxLength={50}
              />
              {errors.nome && <Text style={screenStyles.errorText}>{errors.nome}</Text>}

              <View style={screenStyles.row}>
                <View style={screenStyles.column}>
                  <Text style={screenStyles.modalLabel}>Preço (R$) *</Text>
                  <TextInput
                    style={[
                      screenStyles.modalInput,
                      errors.preco && screenStyles.inputError
                    ]}
                    placeholder="0,00"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={formData.preco}
                    onChangeText={(text) => {
                      setFormData({...formData, preco: formatPrice(text)});
                      if (errors.preco) setErrors({...errors, preco: null});
                    }}
                    keyboardType="decimal-pad"
                  />
                  {errors.preco && <Text style={screenStyles.errorText}>{errors.preco}</Text>}
                </View>

                <View style={screenStyles.column}>
                  <Text style={screenStyles.modalLabel}>Duração (min) *</Text>
                  <TextInput
                    style={[
                      screenStyles.modalInput,
                      errors.duracao && screenStyles.inputError
                    ]}
                    placeholder="30"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={formData.duracao}
                    onChangeText={(text) => {
                      // Permite apenas números
                      const clean = text.replace(/[^\d]/g, '');
                      setFormData({...formData, duracao: clean});
                      if (errors.duracao) setErrors({...errors, duracao: null});
                    }}
                    keyboardType="number-pad"
                    maxLength={3}
                  />
                  {errors.duracao && <Text style={screenStyles.errorText}>{errors.duracao}</Text>}
                </View>
              </View>

              <Text style={screenStyles.modalLabel}>Descrição (opcional)</Text>
              <TextInput
                style={[screenStyles.modalInput, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Descreva o serviço oferecido..."
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.descricao}
                onChangeText={(text) => setFormData({...formData, descricao: text})}
                multiline={true}
                maxLength={200}
              />
              <Text style={screenStyles.charCount}>
                {formData.descricao.length}/200 caracteres
              </Text>

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
                    {editingServico ? 'Atualizar' : 'Criar'}
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
    marginBottom: 8 
  },
  servicoInfo: { flex: 1 },
  servicoNome: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 4 },
  servicoPreco: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary },
  servicoDuracao: { fontSize: 14, color: theme.colors.textSecondary },
  cardInfo: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 8, lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  actionButton: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    flex: 1,
    marginHorizontal: 4
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 16
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