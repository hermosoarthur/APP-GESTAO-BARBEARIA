import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockAgendamentos = [
  {
    id: '1',
    cliente: 'João Silva',
    telefone: '11999999999',
    servico: 'Corte Social',
    barbeiro: 'Carlos',
    data: '2024-01-15',
    hora: '09:00',
    status: 'agendado'
  },
  {
    id: '2',
    cliente: 'Maria Santos',
    telefone: '11888888888',
    servico: 'Barba',
    barbeiro: 'Pedro',
    data: '2024-01-15',
    hora: '10:00',
    status: 'confirmado'
  },
  {
    id: '3',
    cliente: 'José Oliveira',
    telefone: '11777777777',
    servico: 'Corte + Barba',
    barbeiro: 'Ana',
    data: '2024-01-15',
    hora: '11:00',
    status: 'concluido'
  }
];

const mockBarbeiros = ['Carlos', 'Pedro', 'Ana', 'Roberto'];
const mockServicos = ['Corte Social', 'Barba', 'Corte + Barba', 'Sobrancelha'];

export default function AgendamentosScreen({ theme, styles }) {
  const [agendamentos, setAgendamentos] = React.useState(mockAgendamentos);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingAgendamento, setEditingAgendamento] = React.useState(null);
  const [filtroData, setFiltroData] = React.useState('');
  const [filtroBarbeiro, setFiltroBarbeiro] = React.useState('');

  const [formData, setFormData] = React.useState({
    cliente: '',
    telefone: '',
    servico: '',
    barbeiro: '',
    data: new Date().toISOString().split('T')[0],
    hora: '09:00',
    status: 'agendado'
  });

  const screenStyles = createScreenStyles(theme);

  const agendamentosFiltrados = agendamentos.filter(ag => {
    return (!filtroData || ag.data === filtroData) &&
           (!filtroBarbeiro || ag.barbeiro === filtroBarbeiro);
  });

  const handleSave = () => {
    if (!formData.cliente || !formData.telefone || !formData.servico || !formData.barbeiro) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (editingAgendamento) {
      setAgendamentos(agendamentos.map(ag => 
        ag.id === editingAgendamento.id ? { ...formData, id: editingAgendamento.id } : ag
      ));
    } else {
      const novoAgendamento = {
        ...formData,
        id: Date.now().toString()
      };
      setAgendamentos([...agendamentos, novoAgendamento]);
    }

    setModalVisible(false);
    resetForm();
  };

  const handleEdit = (agendamento) => {
    setEditingAgendamento(agendamento);
    setFormData(agendamento);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este agendamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => setAgendamentos(agendamentos.filter(ag => ag.id !== id))
        }
      ]
    );
  };

  const handleEnviarLembrete = (telefone, cliente, data, hora) => {
    const mensagem = `Olá ${cliente}! Lembrete: seu agendamento na App Barber está marcado para ${data} às ${hora}.`;
    const url = `sms:${telefone}?body=${encodeURIComponent(mensagem)}`;
    
    Linking.openURL(url).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mensagens');
    });
  };

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
  };

  const getStatusColor = (status) => {
    const colors = {
      agendado: theme.colors.warning,
      confirmado: theme.colors.primary,
      concluido: theme.colors.success,
      cancelado: theme.colors.danger
    };
    return colors[status] || theme.colors.textSecondary;
  };

  const renderAgendamento = ({ item }) => {
    return React.createElement(View, {
      key: item.id,
      style: screenStyles.card
    }, [
      React.createElement(View, {
        key: 'header',
        style: screenStyles.cardHeader
      }, [
        React.createElement(Text, {
          key: 'cliente',
          style: screenStyles.clienteNome
        }, item.cliente),
        React.createElement(View, {
          key: 'status',
          style: [screenStyles.statusBadge, { backgroundColor: getStatusColor(item.status) }]
        },
          React.createElement(Text, {
            style: screenStyles.statusText
          }, item.status.toUpperCase())
        )
      ]),

      React.createElement(Text, {
        key: 'telefone',
        style: screenStyles.cardInfo
      }, `📞 ${item.telefone}`),

      React.createElement(Text, {
        key: 'servico',
        style: screenStyles.cardInfo
      }, `✂️ ${item.servico} • ${item.barbeiro}`),

      React.createElement(Text, {
        key: 'horario',
        style: screenStyles.cardInfo
      }, `🕒 ${item.data} ${item.hora}`),

      React.createElement(View, {
        key: 'actions',
        style: screenStyles.actions
      }, [
        React.createElement(TouchableOpacity, {
          key: 'lembrete',
          style: [screenStyles.actionButton, { backgroundColor: '#34C759' }],
          onPress: () => handleEnviarLembrete(item.telefone, item.cliente, item.data, item.hora)
        },
          React.createElement(Ionicons, {
            name: 'chatbubble',
            size: 16,
            color: 'white'
          })
        ),

        React.createElement(TouchableOpacity, {
          key: 'edit',
          style: [screenStyles.actionButton, { backgroundColor: theme.colors.primary }],
          onPress: () => handleEdit(item)
        },
          React.createElement(Ionicons, {
            name: 'create',
            size: 16,
            color: 'white'
          })
        ),

        React.createElement(TouchableOpacity, {
          key: 'delete',
          style: [screenStyles.actionButton, { backgroundColor: theme.colors.danger }],
          onPress: () => handleDelete(item.id)
        },
          React.createElement(Ionicons, {
            name: 'trash',
            size: 16,
            color: 'white'
          })
        )
      ])
    ]);
  };

  return React.createElement(View, { style: styles.content }, [
    // Header com filtros
    React.createElement(View, {
      key: 'header',
      style: screenStyles.header
    }, [
      React.createElement(Text, {
        key: 'title',
        style: screenStyles.title
      }, 'Agendamentos'),

      React.createElement(TouchableOpacity, {
        key: 'addButton',
        style: screenStyles.addButton,
        onPress: () => {
          resetForm();
          setModalVisible(true);
        }
      },
        React.createElement(Ionicons, {
          name: 'add',
          size: 24,
          color: 'white'
        })
      )
    ]),

    // Filtros
    React.createElement(View, {
      key: 'filtros',
      style: screenStyles.filtrosContainer
    }, [
      React.createElement(TextInput, {
        key: 'filtroData',
        style: screenStyles.filtroInput,
        placeholder: 'Data (YYYY-MM-DD)',
        value: filtroData,
        onChangeText: setFiltroData,
        placeholderTextColor: theme.colors.textSecondary
      }),

      React.createElement(TextInput, {
        key: 'filtroBarbeiro',
        style: screenStyles.filtroInput,
        placeholder: 'Filtrar por barbeiro',
        value: filtroBarbeiro,
        onChangeText: setFiltroBarbeiro,
        placeholderTextColor: theme.colors.textSecondary
      })
    ]),

    // Lista
    React.createElement(FlatList, {
      key: 'list',
      data: agendamentosFiltrados,
      renderItem: renderAgendamento,
      keyExtractor: item => item.id,
      style: screenStyles.list,
      contentContainerStyle: screenStyles.listContent
    }),

    // Modal para adicionar/editar
    React.createElement(Modal, {
      key: 'modal',
      visible: modalVisible,
      animationType: 'slide',
      transparent: true
    },
      React.createElement(View, { style: screenStyles.modalContainer },
        React.createElement(View, { style: screenStyles.modalContent },
          React.createElement(Text, { style: screenStyles.modalTitle }, 
            editingAgendamento ? 'Editar Agendamento' : 'Novo Agendamento'
          ),
          
          React.createElement(TextInput, {
            style: screenStyles.modalInput,
            placeholder: 'Nome do Cliente',
            placeholderTextColor: theme.colors.textSecondary,
            value: formData.cliente,
            onChangeText: (text) => setFormData({...formData, cliente: text})
          }),
          
          React.createElement(TextInput, {
            style: screenStyles.modalInput,
            placeholder: 'Telefone',
            placeholderTextColor: theme.colors.textSecondary,
            value: formData.telefone,
            onChangeText: (text) => setFormData({...formData, telefone: text}),
            keyboardType: 'phone-pad'
          }),

          React.createElement(View, { style: screenStyles.row },
            React.createElement(TextInput, {
              style: [screenStyles.modalInput, { flex: 1, marginRight: 10 }],
              placeholder: 'Data',
              placeholderTextColor: theme.colors.textSecondary,
              value: formData.data,
              onChangeText: (text) => setFormData({...formData, data: text})
            }),
            React.createElement(TextInput, {
              style: [screenStyles.modalInput, { flex: 1 }],
              placeholder: 'Hora',
              placeholderTextColor: theme.colors.textSecondary,
              value: formData.hora,
              onChangeText: (text) => setFormData({...formData, hora: text})
            })
          ),

          React.createElement(View, { style: screenStyles.modalButtons },
            React.createElement(TouchableOpacity, {
              style: [screenStyles.modalButton, screenStyles.cancelButton],
              onPress: () => {
                setModalVisible(false);
                resetForm();
              }
            },
              React.createElement(Text, { style: screenStyles.cancelButtonText }, 'Cancelar')
            ),
            React.createElement(TouchableOpacity, {
              style: [screenStyles.modalButton, screenStyles.saveButton],
              onPress: handleSave
            },
              React.createElement(Text, { style: screenStyles.saveButtonText }, 'Salvar')
            )
          )
        )
      )
    )
  ]);
}

const createScreenStyles = (theme) => StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text
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
    elevation: 5
  },
  filtrosContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
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
  list: {
    flex: 1
  },
  listContent: {
    padding: 16
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
    alignItems: 'center',
    marginBottom: 8
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  cardInfo: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8
  },
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
    maxWidth: 400
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.background
  },
  row: {
    flexDirection: 'row'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
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