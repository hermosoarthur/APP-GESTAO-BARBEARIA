import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockFuncionarios = [
  {
    id: '1',
    nome: 'Carlos Silva',
    telefone: '(11) 99999-9999',
    funcao: 'Barbeiro',
    status: 'ativo',
    email: 'carlos@barber.com'
  },
  {
    id: '2',
    nome: 'Pedro Santos',
    telefone: '(11) 88888-8888',
    funcao: 'Barbeiro',
    status: 'ativo',
    email: 'pedro@barber.com'
  },
  {
    id: '3',
    nome: 'Ana Oliveira',
    telefone: '(11) 77777-7777',
    funcao: 'Barbeira',
    status: 'inativo',
    email: 'ana@barber.com'
  }
];

const funcoes = ['Barbeiro', 'Barbeira', 'Recepcionista', 'Gerente'];

export default function FuncionariosScreen({ theme, styles }) {
  const [funcionarios, setFuncionarios] = React.useState(mockFuncionarios);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingFuncionario, setEditingFuncionario] = React.useState(null);
  const [isDono, setIsDono] = React.useState(true); // Simula se é o dono

  const [formData, setFormData] = React.useState({
    nome: '',
    telefone: '',
    email: '',
    funcao: 'Barbeiro',
    status: 'ativo'
  });

  const screenStyles = createScreenStyles(theme);

  const handleSave = () => {
    if (!formData.nome || !formData.telefone || !formData.email) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    if (editingFuncionario) {
      setFuncionarios(funcionarios.map(f => 
        f.id === editingFuncionario.id ? { ...formData, id: editingFuncionario.id } : f
      ));
    } else {
      const novoFuncionario = {
        ...formData,
        id: Date.now().toString()
      };
      setFuncionarios([...funcionarios, novoFuncionario]);
    }

    setModalVisible(false);
    resetForm();
  };

  const handleEdit = (funcionario) => {
    if (!isDono) {
      Alert.alert('Acesso Negado', 'Apenas o dono pode editar funcionários');
      return;
    }
    setEditingFuncionario(funcionario);
    setFormData(funcionario);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    if (!isDono) {
      Alert.alert('Acesso Negado', 'Apenas o dono pode excluir funcionários');
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir este funcionário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => setFuncionarios(funcionarios.filter(f => f.id !== id))
        }
      ]
    );
  };

  const toggleStatus = (id) => {
    if (!isDono) {
      Alert.alert('Acesso Negado', 'Apenas o dono pode alterar status');
      return;
    }

    setFuncionarios(funcionarios.map(f => 
      f.id === id ? { ...f, status: f.status === 'ativo' ? 'inativo' : 'ativo' } : f
    ));
  };

  const resetForm = () => {
    setEditingFuncionario(null);
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      funcao: 'Barbeiro',
      status: 'ativo'
    });
  };

  const formatPhone = (text) => {
    const clean = text.replace(/\D/g, '');
    if (clean.length <= 2) return clean;
    if (clean.length <= 6) return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
    if (clean.length <= 10) return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7, 11)}`;
  };

  const renderFuncionario = ({ item }) => {
    return React.createElement(View, {
      key: item.id,
      style: screenStyles.card
    }, [
      React.createElement(View, {
        key: 'header',
        style: screenStyles.cardHeader
      }, [
        React.createElement(View, {
          key: 'info',
          style: screenStyles.funcionarioInfo
        }, [
          React.createElement(Text, {
            key: 'nome',
            style: screenStyles.funcionarioNome
          }, item.nome),
          React.createElement(Text, {
            key: 'funcao',
            style: screenStyles.funcionarioFuncao
          }, item.funcao)
        ]),
        React.createElement(View, {
          key: 'status',
          style: screenStyles.statusContainer
        }, [
          React.createElement(Text, {
            key: 'statusText',
            style: [
              screenStyles.statusText,
              { color: item.status === 'ativo' ? theme.colors.success : theme.colors.danger }
            ]
          }, item.status === 'ativo' ? 'ATIVO' : 'INATIVO'),
          isDono && React.createElement(Switch, {
            key: 'switch',
            value: item.status === 'ativo',
            onValueChange: () => toggleStatus(item.id),
            trackColor: { false: theme.colors.border, true: theme.colors.success + '80' },
            thumbColor: item.status === 'ativo' ? theme.colors.success : theme.colors.danger
          })
        ])
      ]),

      React.createElement(Text, {
        key: 'telefone',
        style: screenStyles.cardInfo
      }, `📞 ${item.telefone}`),

      React.createElement(Text, {
        key: 'email',
        style: screenStyles.cardInfo
      }, `📧 ${item.email}`),

      isDono && React.createElement(View, {
        key: 'actions',
        style: screenStyles.actions
      }, [
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
    React.createElement(View, {
      key: 'header',
      style: screenStyles.header
    }, [
      React.createElement(Text, {
        key: 'title',
        style: screenStyles.title
      }, 'Equipe'),

      isDono && React.createElement(TouchableOpacity, {
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

    !isDono && React.createElement(View, {
      key: 'aviso',
      style: screenStyles.avisoContainer
    },
      React.createElement(Text, {
        style: screenStyles.avisoText
      }, '🔒 Apenas visualização - Contate o administrador para alterações')
    ),

    React.createElement(FlatList, {
      key: 'list',
      data: funcionarios,
      renderItem: renderFuncionario,
      keyExtractor: item => item.id,
      style: screenStyles.list,
      contentContainerStyle: screenStyles.listContent
    }),

    // Modal
    React.createElement(Modal, {
      key: 'modal',
      visible: modalVisible,
      animationType: 'slide',
      transparent: true
    },
      React.createElement(View, { style: screenStyles.modalContainer },
        React.createElement(View, { style: screenStyles.modalContent },
          React.createElement(Text, { style: screenStyles.modalTitle }, 
            editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'
          ),
          
          React.createElement(TextInput, {
            style: screenStyles.modalInput,
            placeholder: 'Nome Completo',
            placeholderTextColor: theme.colors.textSecondary,
            value: formData.nome,
            onChangeText: (text) => setFormData({...formData, nome: text})
          }),
          
          React.createElement(TextInput, {
            style: screenStyles.modalInput,
            placeholder: 'Telefone',
            placeholderTextColor: theme.colors.textSecondary,
            value: formData.telefone,
            onChangeText: (text) => setFormData({...formData, telefone: formatPhone(text)}),
            keyboardType: 'phone-pad'
          }),

          React.createElement(TextInput, {
            style: screenStyles.modalInput,
            placeholder: 'Email',
            placeholderTextColor: theme.colors.textSecondary,
            value: formData.email,
            onChangeText: (text) => setFormData({...formData, email: text}),
            keyboardType: 'email-address'
          }),

          React.createElement(Text, {
            key: 'labelFuncao',
            style: screenStyles.modalLabel
          }, 'Função'),

          React.createElement(View, {
            key: 'funcaoOptions',
            style: screenStyles.funcaoOptions
          },
            funcoes.map((funcao, index) => 
              React.createElement(TouchableOpacity, {
                key: `funcao-${index}`,
                style: [
                  screenStyles.funcaoOption,
                  formData.funcao === funcao && screenStyles.funcaoOptionSelected
                ],
                onPress: () => setFormData({...formData, funcao: funcao})
              },
                React.createElement(Text, {
                  style: [
                    screenStyles.funcaoOptionText,
                    formData.funcao === funcao && screenStyles.funcaoOptionTextSelected
                  ]
                }, funcao)
              )
            )
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
    alignItems: 'center'
  },
  avisoContainer: {
    backgroundColor: theme.colors.warning + '20',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning
  },
  avisoText: {
    fontSize: 12,
    color: theme.colors.warning,
    textAlign: 'center'
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
    alignItems: 'flex-start',
    marginBottom: 12
  },
  funcionarioInfo: {
    flex: 1
  },
  funcionarioNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4
  },
  funcionarioFuncao: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600'
  },
  statusContainer: {
    alignItems: 'flex-end'
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4
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
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 8
  },
  funcaoOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20
  },
  funcaoOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginRight: 8,
    marginBottom: 8
  },
  funcaoOptionSelected: {
    backgroundColor: theme.colors.primary
  },
  funcaoOptionText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500'
  },
  funcaoOptionTextSelected: {
    color: 'white'
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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