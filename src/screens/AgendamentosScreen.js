import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Alert, 
  TextInput, 
  ScrollView, 
  Platform,
  Modal,
  Linking,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { databaseService } from '../../services/databaseService';
import DateTimePicker from '@react-native-community/datetimepicker';

// Funções auxiliares
const formatDisplayDate = (dateString) => {
  if (!dateString) return 'Data inválida';
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return 'Data inválida';
  }
};

const formatPhone = (text) => {
  if (!text) return '';
  try {
    const clean = text.replace(/\D/g, '');
    if (clean.length <= 2) return clean;
    if (clean.length <= 6) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    if (clean.length <= 10) return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`;
  } catch (error) {
    console.error('Erro ao formatar telefone:', error);
    return text;
  }
};

const createScreenStyles = (theme) => StyleSheet.create({
  // Container principal seguro
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: { 
    flex: 1, 
    backgroundColor: theme.colors.background,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40, // Mais espaço no topo
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 10
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: theme.colors.text,
    marginTop: Platform.OS === 'ios' ? 10 : 0
  },
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
    elevation: 5,
    marginTop: Platform.OS === 'ios' ? 10 : 0
  },
  filtrosContainer: { 
    flexDirection: 'row', 
    padding: 16, 
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 10
  },
  filtroInput: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: theme.colors.border, 
    borderRadius: 8, 
    padding: 12, 
    marginHorizontal: 4, 
    color: theme.colors.text, 
    backgroundColor: theme.colors.background 
  },
  list: { flex: 1 }, 
  listContent: { 
    padding: 16, 
    paddingBottom: 30,
    paddingTop: 10 
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 20
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
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  clienteNome: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }, 
  statusText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  cardInfo: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 4 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  actionButton: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '90%',
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: Platform.OS === 'ios' ? 40 : 20
  },
  modalContent: {
    padding: 20,
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
    maxHeight: 150
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  optionText: {
    fontSize: 14,
    color: theme.colors.text
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  column: {
    flex: 1,
    marginHorizontal: 4
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10
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
  },

  // DateTimePicker Styles
  dateTimeContainer: {
    marginBottom: 10,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 10
  },
  dateTimeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 10
  },
  dateTimeButton: {
    padding: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center'
  },
  dateTimeButtonText: {
    color: 'white',
    fontWeight: '600'
  },

  // Status Modal Styles
  statusModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20
  },
  statusModalContainer: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 12,
    width: '90%',
    maxWidth: 300
  },
  statusModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: 'center'
  },
  statusModalSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center'
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderLeftWidth: 4,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.background
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12
  },
  statusOptionText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500'
  },
  statusCancelButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.border
  },
  statusCancelText: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500'
  }
});

export default function AgendamentosScreen({ theme, styles }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAgendamento, setEditingAgendamento] = useState(null);
  const [filtros, setFiltros] = useState({ data: '', barbeiro: '' });

  // Estados para seleção
  const [showServicos, setShowServicos] = useState(false);
  const [showBarbeiros, setShowBarbeiros] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);

  // Estados para DateTimePicker
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());

  const [formData, setFormData] = useState({
    cliente: '', 
    telefone: '', 
    servico: '', 
    barbeiro: '', 
    data: new Date().toISOString().split('T')[0],
    hora: '09:00',
    status: 'agendado'
  });

  const statusOptions = [
    { value: 'agendado', label: 'Agendado', color: '#FF9500' },
    { value: 'confirmado', label: 'Confirmado', color: '#007AFF' },
    { value: 'concluido', label: 'Concluído', color: '#34C759' },
    { value: 'cancelado', label: 'Cancelado', color: '#FF3B30' }
  ];

  // Função resetForm
  const resetForm = () => {
    setEditingAgendamento(null);
    setFormData({
      cliente: '', 
      telefone: '', 
      servico: '', 
      barbeiro: '', 
      data: new Date().toISOString().split('T')[0],
      hora: '09:00',
      status: 'agendado'
    });
    setShowServicos(false);
    setShowBarbeiros(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
    setShowStatusOptions(false);
    setSelectedAgendamento(null);
    setTempDate(new Date());
    setTempTime(new Date());
  };

  // Funções do DateTimePicker corrigidas
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      
      // No Android, confirma automaticamente
      if (Platform.OS === 'android') {
        const dateString = selectedDate.toISOString().split('T')[0];
        setFormData({...formData, data: dateString});
      }
    }
  };

  const onTimeChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    
    if (selectedTime) {
      setTempTime(selectedTime);
      
      // No Android, confirma automaticamente
      if (Platform.OS === 'android') {
        const timeString = selectedTime.toTimeString().split(' ')[0].substring(0, 5);
        setFormData({...formData, hora: timeString});
      }
    }
  };

  // Funções para confirmar data/hora no iOS
  const confirmDate = () => {
    const dateString = tempDate.toISOString().split('T')[0];
    setFormData({...formData, data: dateString});
    setShowDatePicker(false);
  };

  const confirmTime = () => {
    const timeString = tempTime.toTimeString().split(' ')[0].substring(0, 5);
    setFormData({...formData, hora: timeString});
    setShowTimePicker(false);
  };

  const cancelDate = () => {
    setShowDatePicker(false);
  };

  const cancelTime = () => {
    setShowTimePicker(false);
  };

  useEffect(() => { 
    loadAgendamentos();
    loadServicos();
    loadFuncionarios();
  }, []);

  const loadAgendamentos = async () => {
    const result = await databaseService.read('agendamentos');
    if (result.success) setAgendamentos(result.data);
  };

  const loadServicos = async () => {
    const result = await databaseService.read('servicos');
    if (result.success) setServicos(result.data);
  };

  const loadFuncionarios = async () => {
    const result = await databaseService.read('funcionarios');
    if (result.success) {
      const funcionariosAtivos = result.data.filter(f => f.status === 'ativo');
      setFuncionarios(funcionariosAtivos);
    }
  };

  const agendamentosFiltrados = agendamentos.filter(ag => 
    (!filtros.data || ag.data === filtros.data) &&
    (!filtros.barbeiro || ag.barbeiro === filtros.barbeiro)
  );

  const handleSave = async () => {
    if (!formData.cliente || formData.cliente.length < 3) {
      Alert.alert('Erro', 'Nome do cliente deve ter pelo menos 3 caracteres');
      return;
    }

    if (!formData.telefone || formData.telefone.replace(/\D/g, '').length < 10) {
      Alert.alert('Erro', 'Telefone deve ter pelo menos 10 dígitos');
      return;
    }

    if (!formData.servico) {
      Alert.alert('Erro', 'Selecione um serviço');
      return;
    }

    if (!formData.barbeiro) {
      Alert.alert('Erro', 'Selecione um barbeiro');
      return;
    }

    if (!formData.data) {
      Alert.alert('Erro', 'Selecione uma data');
      return;
    }

    if (!formData.hora) {
      Alert.alert('Erro', 'Selecione um horário');
      return;
    }

    if (!editingAgendamento) {
      const conflito = agendamentos.find(ag => 
        ag.data === formData.data && 
        ag.hora === formData.hora && 
        ag.barbeiro === formData.barbeiro
      );

      if (conflito) {
        Alert.alert('Conflito', `Já existe um agendamento para ${formData.barbeiro} às ${formData.hora}`);
        return;
      }
    }

    const result = editingAgendamento 
      ? await databaseService.update('agendamentos', editingAgendamento.id, formData)
      : await databaseService.create('agendamentos', formData);

    if (result.success) {
      if (!editingAgendamento) {
        Alert.alert(
          'Agendamento Criado!',
          'Deseja enviar um SMS de confirmação para o cliente?',
          [
            { 
              text: 'Não', 
              style: 'cancel',
              onPress: () => {
                setModalVisible(false);
                resetForm();
                loadAgendamentos();
              }
            },
            { 
              text: 'Enviar SMS', 
              onPress: () => {
                enviarSMSConfirmacao(formData);
                setModalVisible(false);
                resetForm();
                loadAgendamentos();
              }
            }
          ]
        );
      } else {
        setModalVisible(false);
        resetForm();
        loadAgendamentos();
        Alert.alert('Sucesso', 'Agendamento atualizado!');
      }
    } else {
      Alert.alert('Erro', result.error);
    }
  };

  const handleStatusChange = async (agendamento, novoStatus) => {
    if (!agendamento) return;

    if (novoStatus === 'cancelado') {
      Alert.alert(
        'Confirmar Cancelamento',
        `Deseja cancelar o agendamento de ${agendamento.cliente}?`,
        [
          { text: 'Manter', style: 'cancel' },
          { 
            text: 'Cancelar Agendamento', 
            style: 'destructive',
            onPress: async () => {
              const result = await databaseService.delete('agendamentos', agendamento.id);
              if (result.success) {
                await loadAgendamentos();
                Alert.alert('Sucesso', 'Agendamento cancelado e removido!');
              }
            }
          }
        ]
      );
    } else if (novoStatus === 'concluido') {
      const servico = servicos.find(s => s.nome === agendamento.servico);
      if (servico) {
        const vendaData = {
          agendamentoId: agendamento.id,
          cliente: agendamento.cliente,
          servico: agendamento.servico,
          barbeiro: agendamento.barbeiro,
          valor: servico.preco,
          data: agendamento.data,
          hora: agendamento.hora,
          tipo: 'servico'
        };

        const vendaResult = await databaseService.create('vendas', vendaData);
        if (vendaResult.success) {
          const updateResult = await databaseService.update('agendamentos', agendamento.id, { 
            status: 'concluido' 
          });
          
          if (updateResult.success) {
            await loadAgendamentos();
            Alert.alert('Sucesso', 'Serviço concluído e vendas registradas!');
          }
        }
      }
    } else {
      const result = await databaseService.update('agendamentos', agendamento.id, { 
        status: novoStatus 
      });
      
      if (result.success) {
        await loadAgendamentos();
        Alert.alert('Sucesso', `Status alterado para ${getStatusLabel(novoStatus)}`);
      }
    }
    setShowStatusOptions(false);
  };

  const enviarSMSConfirmacao = (agendamento) => {
    if (!agendamento || !agendamento.telefone) {
      Alert.alert('Erro', 'Dados do agendamento incompletos para enviar SMS');
      return;
    }

    const telefone = agendamento.telefone.replace(/\D/g, '');
    const mensagem = `Olá ${agendamento.cliente || 'Cliente'}! Seu agendamento na App Barber está confirmado para ${formatDisplayDate(agendamento.data)} às ${agendamento.hora || '--:--'}. Serviço: ${agendamento.servico || 'Serviço'} com ${agendamento.barbeiro || 'Barbeiro'}. Obrigado!`;
    
    const url = `sms:${telefone}?body=${encodeURIComponent(mensagem)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mensagens');
    });
  };

  const enviarSMSLembrete = (agendamento) => {
    if (!agendamento || !agendamento.telefone) {
      Alert.alert('Erro', 'Dados do agendamento incompletos para enviar SMS');
      return;
    }

    const telefone = agendamento.telefone.replace(/\D/g, '');
    const mensagem = `Lembrete: Seu agendamento na App Barber é hoje às ${agendamento.hora || '--:--'}. Serviço: ${agendamento.servico || 'Serviço'} com ${agendamento.barbeiro || 'Barbeiro'}. Chegue 5 minutos antes!`;
    
    const url = `sms:${telefone}?body=${encodeURIComponent(mensagem)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mensagens');
    });
  };

  const getStatusLabel = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.color : '#666';
  };

  const renderAgendamento = ({ item }) => {
    return React.createElement(View, { style: screenStyles.card },
      React.createElement(View, { style: screenStyles.cardHeader },
        React.createElement(Text, { style: screenStyles.clienteNome }, item.cliente || 'Cliente não informado'),
        React.createElement(TouchableOpacity, {
          style: [screenStyles.statusBadge, { backgroundColor: getStatusColor(item.status) }],
          onPress: () => {
            setSelectedAgendamento(item);
            setShowStatusOptions(true);
          }
        },
          React.createElement(Text, { style: screenStyles.statusText }, getStatusLabel(item.status).toUpperCase())
        )
      ),
      React.createElement(Text, { style: screenStyles.cardInfo }, `📞 ${item.telefone || 'Telefone não informado'}`),
      React.createElement(Text, { style: screenStyles.cardInfo }, `✂️ ${item.servico || 'Serviço não informado'} • ${item.barbeiro || 'Barbeiro não informado'}`),
      React.createElement(Text, { style: screenStyles.cardInfo }, `🕒 ${formatDisplayDate(item.data)} ${item.hora || '--:--'}`),
      React.createElement(View, { style: screenStyles.actions },
        item.status !== 'concluido' && item.status !== 'cancelado' && 
          React.createElement(TouchableOpacity, {
            style: [screenStyles.actionButton, { backgroundColor: '#34C759' }],
            onPress: () => enviarSMSLembrete(item)
          },
            React.createElement(Ionicons, { name: "chatbubble", size: 16, color: "white" })
          ),
        React.createElement(TouchableOpacity, {
          style: [screenStyles.actionButton, { backgroundColor: theme.colors.primary }],
          onPress: () => { setEditingAgendamento(item); setFormData(item); setModalVisible(true); }
        },
          React.createElement(Ionicons, { name: "create", size: 16, color: "white" })
        ),
        React.createElement(TouchableOpacity, {
          style: [screenStyles.actionButton, { backgroundColor: '#FF9500' }],
          onPress: () => {
            setSelectedAgendamento(item);
            setShowStatusOptions(true);
          }
        },
          React.createElement(Ionicons, { name: "swap-vertical", size: 16, color: "white" })
        )
      )
    );
  };

  const screenStyles = createScreenStyles(theme);

  // Usando SafeAreaView para evitar sobreposição
  return React.createElement(SafeAreaView, { 
    style: screenStyles.safeArea 
  },
    React.createElement(StatusBar, {
      backgroundColor: theme.colors.card,
      barStyle: theme.dark ? 'light-content' : 'dark-content'
    }),
    React.createElement(View, { style: screenStyles.content },
      React.createElement(View, { style: screenStyles.header },
        React.createElement(Text, { style: screenStyles.title }, "Agendamentos"),
        React.createElement(TouchableOpacity, {
          style: screenStyles.addButton,
          onPress: () => { resetForm(); setModalVisible(true); }
        },
          React.createElement(Ionicons, { name: "add", size: 24, color: "white" })
        )
      ),

      React.createElement(View, { style: screenStyles.filtrosContainer },
        React.createElement(TextInput, {
          style: screenStyles.filtroInput,
          placeholder: "Data (DD/MM/AAAA)",
          value: filtros.data,
          onChangeText: (text) => setFiltros({...filtros, data: text}),
          placeholderTextColor: theme.colors.textSecondary
        }),
        React.createElement(TextInput, {
          style: screenStyles.filtroInput,
          placeholder: "Barbeiro",
          value: filtros.barbeiro,
          onChangeText: (text) => setFiltros({...filtros, barbeiro: text}),
          placeholderTextColor: theme.colors.textSecondary
        })
      ),

      React.createElement(FlatList, {
        data: agendamentosFiltrados,
        renderItem: renderAgendamento,
        keyExtractor: item => item.id,
        style: screenStyles.list,
        contentContainerStyle: screenStyles.listContent,
        ListEmptyComponent: React.createElement(View, { style: screenStyles.emptyState },
          React.createElement(Ionicons, { name: "calendar-outline", size: 48, color: theme.colors.textSecondary }),
          React.createElement(Text, { style: screenStyles.emptyText }, "Nenhum agendamento encontrado"),
          React.createElement(Text, { style: screenStyles.emptySubtext },
            "Clique no + para adicionar seu primeiro agendamento"
          )
        )
      }),

      // Modal de Agendamento
      React.createElement(Modal, {
        visible: modalVisible,
        animationType: "slide",
        transparent: true
      },
        React.createElement(SafeAreaView, { style: screenStyles.safeArea },
          React.createElement(View, { style: screenStyles.modalOverlay },
            React.createElement(View, { style: screenStyles.modalContainer },
              React.createElement(View, { style: screenStyles.modalContent },
                React.createElement(ScrollView, { 
                  contentContainerStyle: { paddingBottom: 20 },
                  showsVerticalScrollIndicator: false 
                },
                  React.createElement(Text, { style: screenStyles.modalTitle },
                    editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'
                  ),
                  
                  React.createElement(Text, { style: screenStyles.modalLabel }, "Cliente *"),
                  React.createElement(TextInput, {
                    style: screenStyles.modalInput,
                    placeholder: "Nome completo do cliente",
                    placeholderTextColor: theme.colors.textSecondary,
                    value: formData.cliente,
                    onChangeText: (text) => setFormData({...formData, cliente: text}),
                    maxLength: 50
                  }),

                  React.createElement(Text, { style: screenStyles.modalLabel }, "Telefone *"),
                  React.createElement(TextInput, {
                    style: screenStyles.modalInput,
                    placeholder: "(11) 99999-9999",
                    placeholderTextColor: theme.colors.textSecondary,
                    value: formData.telefone,
                    onChangeText: (text) => setFormData({...formData, telefone: formatPhone(text)}),
                    keyboardType: "phone-pad",
                    maxLength: 15
                  }),

                  React.createElement(Text, { style: screenStyles.modalLabel }, "Serviço *"),
                  React.createElement(TouchableOpacity, {
                    style: screenStyles.selectButton,
                    onPress: () => setShowServicos(!showServicos)
                  },
                    React.createElement(Text, {
                      style: formData.servico ? screenStyles.selectButtonText : screenStyles.selectButtonPlaceholder
                    }, formData.servico || 'Selecione um serviço'),
                    React.createElement(Ionicons, { name: "chevron-down", size: 20, color: theme.colors.textSecondary })
                  ),

                  showServicos && React.createElement(View, { style: screenStyles.optionsContainer },
                    servicos.map(servico => 
                      React.createElement(TouchableOpacity, {
                        key: servico.id,
                        style: screenStyles.option,
                        onPress: () => {
                          setFormData({...formData, servico: servico.nome});
                          setShowServicos(false);
                        }
                      },
                        React.createElement(Text, { style: screenStyles.optionText }, `${servico.nome} - R$ ${servico.preco}`)
                      )
                    )
                  ),

                  React.createElement(Text, { style: screenStyles.modalLabel }, "Barbeiro *"),
                  React.createElement(TouchableOpacity, {
                    style: screenStyles.selectButton,
                    onPress: () => setShowBarbeiros(!showBarbeiros)
                  },
                    React.createElement(Text, {
                      style: formData.barbeiro ? screenStyles.selectButtonText : screenStyles.selectButtonPlaceholder
                    }, formData.barbeiro || 'Selecione um barbeiro'),
                    React.createElement(Ionicons, { name: "chevron-down", size: 20, color: theme.colors.textSecondary })
                  ),

                  showBarbeiros && React.createElement(View, { style: screenStyles.optionsContainer },
                    funcionarios.map(funcionario => 
                      React.createElement(TouchableOpacity, {
                        key: funcionario.id,
                        style: screenStyles.option,
                        onPress: () => {
                          setFormData({...formData, barbeiro: funcionario.nome});
                          setShowBarbeiros(false);
                        }
                      },
                        React.createElement(Text, { style: screenStyles.optionText }, funcionario.nome)
                      )
                    )
                  ),

                  React.createElement(View, { style: screenStyles.row },
                    React.createElement(View, { style: screenStyles.column },
                      React.createElement(Text, { style: screenStyles.modalLabel }, "Data *"),
                      React.createElement(TouchableOpacity, {
                        style: screenStyles.selectButton,
                        onPress: () => {
                          setTempDate(new Date(formData.data || new Date()));
                          setShowDatePicker(true);
                        }
                      },
                        React.createElement(Text, { style: screenStyles.selectButtonText }, 
                          formData.data ? formatDisplayDate(formData.data) : 'Selecione uma data'
                        ),
                        React.createElement(Ionicons, { name: "calendar", size: 18, color: theme.colors.textSecondary })
                      )
                    ),

                    React.createElement(View, { style: screenStyles.column },
                      React.createElement(Text, { style: screenStyles.modalLabel }, "Hora *"),
                      React.createElement(TouchableOpacity, {
                        style: screenStyles.selectButton,
                        onPress: () => {
                          const [hours, minutes] = (formData.hora || '09:00').split(':');
                          const timeDate = new Date();
                          timeDate.setHours(parseInt(hours), parseInt(minutes));
                          setTempTime(timeDate);
                          setShowTimePicker(true);
                        }
                      },
                        React.createElement(Text, { style: screenStyles.selectButtonText }, 
                          formData.hora || 'Selecione um horário'
                        ),
                        React.createElement(Ionicons, { name: "time", size: 18, color: theme.colors.textSecondary })
                      )
                    )
                  ),

                  // DateTimePicker para Data com botões de confirmação (iOS)
                  showDatePicker && React.createElement(View, { style: screenStyles.dateTimeContainer },
                    React.createElement(DateTimePicker, {
                      value: tempDate,
                      mode: "date",
                      display: "spinner",
                      onChange: onDateChange,
                      minimumDate: new Date(),
                      style: { height: 120 }
                    }),
                    Platform.OS === 'ios' && React.createElement(View, { style: screenStyles.dateTimeButtons },
                      React.createElement(TouchableOpacity, {
                        style: [screenStyles.dateTimeButton, { backgroundColor: '#666' }],
                        onPress: cancelDate
                      },
                        React.createElement(Text, { style: screenStyles.dateTimeButtonText }, "Cancelar")
                      ),
                      React.createElement(TouchableOpacity, {
                        style: screenStyles.dateTimeButton,
                        onPress: confirmDate
                      },
                        React.createElement(Text, { style: screenStyles.dateTimeButtonText }, "Confirmar")
                      )
                    )
                  ),

                  // DateTimePicker para Hora com botões de confirmação (iOS)
                  showTimePicker && React.createElement(View, { style: screenStyles.dateTimeContainer },
                    React.createElement(DateTimePicker, {
                      value: tempTime,
                      mode: "time",
                      display: "spinner",
                      onChange: onTimeChange,
                      minuteInterval: 30,
                      style: { height: 120 }
                    }),
                    Platform.OS === 'ios' && React.createElement(View, { style: screenStyles.dateTimeButtons },
                      React.createElement(TouchableOpacity, {
                        style: [screenStyles.dateTimeButton, { backgroundColor: '#666' }],
                        onPress: cancelTime
                      },
                        React.createElement(Text, { style: screenStyles.dateTimeButtonText }, "Cancelar")
                      ),
                      React.createElement(TouchableOpacity, {
                        style: screenStyles.dateTimeButton,
                        onPress: confirmTime
                      },
                        React.createElement(Text, { style: screenStyles.dateTimeButtonText }, "Confirmar")
                      )
                    )
                  ),

                  React.createElement(View, { style: screenStyles.modalButtons },
                    React.createElement(TouchableOpacity, {
                      style: [screenStyles.modalButton, screenStyles.cancelButton],
                      onPress: () => { setModalVisible(false); resetForm(); }
                    },
                      React.createElement(Text, { style: screenStyles.cancelButtonText }, "Cancelar")
                    ),
                    React.createElement(TouchableOpacity, {
                      style: [screenStyles.modalButton, screenStyles.saveButton],
                      onPress: handleSave
                    },
                      React.createElement(Text, { style: screenStyles.saveButtonText },
                        editingAgendamento ? 'Atualizar' : 'Agendar'
                      )
                    )
                  )
                )
              )
            )
          )
        )
      ),

      // Modal de Opções de Status
      React.createElement(Modal, {
        visible: showStatusOptions,
        transparent: true,
        animationType: "fade"
      },
        React.createElement(SafeAreaView, { style: screenStyles.safeArea },
          React.createElement(View, { style: screenStyles.statusModalOverlay },
            React.createElement(View, { style: screenStyles.statusModalContainer },
              React.createElement(Text, { style: screenStyles.statusModalTitle }, "Alterar Status"),
              React.createElement(Text, { style: screenStyles.statusModalSubtitle },
                `${selectedAgendamento?.cliente || 'Cliente'} - ${formatDisplayDate(selectedAgendamento?.data)} ${selectedAgendamento?.hora || '--:--'}`
              ),
              
              statusOptions.map((status) =>
                React.createElement(TouchableOpacity, {
                  key: status.value,
                  style: [screenStyles.statusOption, { borderLeftColor: status.color }],
                  onPress: () => {
                    handleStatusChange(selectedAgendamento, status.value);
                  }
                },
                  React.createElement(View, { style: [screenStyles.statusDot, { backgroundColor: status.color }] }),
                  React.createElement(Text, { style: screenStyles.statusOptionText }, status.label),
                  selectedAgendamento?.status === status.value &&
                    React.createElement(Ionicons, { name: "checkmark", size: 20, color: status.color })
                )
              ),
              
              React.createElement(TouchableOpacity, {
                style: screenStyles.statusCancelButton,
                onPress: () => setShowStatusOptions(false)
              },
                React.createElement(Text, { style: screenStyles.statusCancelText }, "Cancelar")
              )
            )
          )
        )
      )
    )
  );
}