import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockVendas = [
  {
    id: '1',
    cliente: 'João Silva',
    servico: 'Corte Social',
    valor: 35,
    data: '2024-01-15',
    barbeiro: 'Carlos',
    formaPagamento: 'Dinheiro'
  },
  {
    id: '2',
    cliente: 'Maria Santos',
    servico: 'Barba',
    valor: 25,
    data: '2024-01-15',
    barbeiro: 'Pedro',
    formaPagamento: 'Cartão'
  },
  {
    id: '3',
    cliente: 'José Oliveira',
    servico: 'Corte + Barba',
    valor: 55,
    data: '2024-01-14',
    barbeiro: 'Ana',
    formaPagamento: 'PIX'
  }
];

const formasPagamento = ['Dinheiro', 'Cartão Débito', 'Cartão Crédito', 'PIX'];

export default function VendasScreen({ theme, styles }) {
  const [vendas, setVendas] = React.useState(mockVendas);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [filtroData, setFiltroData] = React.useState('');

  const [formData, setFormData] = React.useState({
    cliente: '',
    servico: '',
    valor: '',
    barbeiro: '',
    formaPagamento: 'Dinheiro'
  });

  const screenStyles = createScreenStyles(theme);

  const vendasFiltradas = filtroData 
    ? vendas.filter(v => v.data === filtroData)
    : vendas;

  const totalHoje = vendas
    .filter(v => v.data === new Date().toISOString().split('T')[0])
    .reduce((sum, v) => sum + v.valor, 0);

  const totalSemana = vendas
    .filter(v => {
      const dataVenda = new Date(v.data);
      const umaSemanaAtras = new Date();
      umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
      return dataVenda >= umaSemanaAtras;
    })
    .reduce((sum, v) => sum + v.valor, 0);

  const handleSave = () => {
    if (!formData.cliente || !formData.servico || !formData.valor || !formData.barbeiro) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const novaVenda = {
      ...formData,
      id: Date.now().toString(),
      data: new Date().toISOString().split('T')[0],
      valor: parseFloat(formData.valor)
    };

    setVendas([novaVenda, ...vendas]);
    setModalVisible(false);
    resetForm();
    
    Alert.alert('Sucesso', 'Venda registrada com sucesso!');
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Deseja realmente excluir esta venda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => setVendas(vendas.filter(v => v.id !== id))
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      cliente: '',
      servico: '',
      valor: '',
      barbeiro: '',
      formaPagamento: 'Dinheiro'
    });
  };

  const getFormaPagamentoIcon = (forma) => {
    const icons = {
      'Dinheiro': 'cash',
      'Cartão Débito': 'card',
      'Cartão Crédito': 'card',
      'PIX': 'phone-portrait'
    };
    return icons[forma] || 'card';
  };

  const renderVenda = ({ item }) => {
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
        React.createElement(Text, {
          key: 'valor',
          style: screenStyles.valor
        }, `R$ ${item.valor}`)
      ]),

      React.createElement(Text, {
        key: 'servico',
        style: screenStyles.cardInfo
      }, `✂️ ${item.servico} • ${item.barbeiro}`),

      React.createElement(View, {
        key: 'footer',
        style: screenStyles.cardFooter
      }, [
        React.createElement(View, {
          key: 'pagamento',
          style: screenStyles.pagamentoContainer
        }, [
          React.createElement(Ionicons, {
            key: 'icon',
            name: getFormaPagamentoIcon(item.formaPagamento),
            size: 14,
            color: theme.colors.textSecondary
          }),
          React.createElement(Text, {
            key: 'text',
            style: screenStyles.pagamentoText
          }, item.formaPagamento)
        ]),
        React.createElement(Text, {
          key: 'data',
          style: screenStyles.dataText
        }, item.data)
      ]),

      React.createElement(View, {
        key: 'actions',
        style: screenStyles.actions
      }, [
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
    // Header
    React.createElement(View, {
      key: 'header',
      style: screenStyles.header
    }, [
      React.createElement(Text, {
        key: 'title',
        style: screenStyles.title
      }, 'Vendas'),

      React.createElement(TouchableOpacity, {
        key: 'addButton',
        style: screenStyles.addButton,
        onPress: () => setModalVisible(true)
      },
        React.createElement(Ionicons, {
          name: 'add',
          size: 24,
          color: 'white'
        })
      )
    ]),

    // Resumo
    React.createElement(View, {
      key: 'resumo',
      style: screenStyles.resumoContainer
    }, [
      React.createElement(View, {
        key: 'resumoHoje',
        style: screenStyles.resumoCard
      }, [
        React.createElement(Text, {
          key: 'valor',
          style: screenStyles.resumoValor
        }, `R$ ${totalHoje}`),
        React.createElement(Text, {
          key: 'label',
          style: screenStyles.resumoLabel
        }, 'Hoje')
      ]),

      React.createElement(View, {
        key: 'resumoSemana',
        style: screenStyles.resumoCard
      }, [
        React.createElement(Text, {
          key: 'valor',
          style: screenStyles.resumoValor
        }, `R$ ${totalSemana}`),
        React.createElement(Text, {
          key: 'label',
          style: screenStyles.resumoLabel
        }, 'Semana')
      ]),

      React.createElement(View, {
        key: 'resumoTotal',
        style: screenStyles.resumoCard
      }, [
        React.createElement(Text, {
          key: 'valor',
          style: screenStyles.resumoValor
        }, `R$ ${vendas.reduce((sum, v) => sum + v.valor, 0)}`),
        React.createElement(Text, {
          key: 'label',
          style: screenStyles.resumoLabel
        }, 'Total')
      ])
    ]),

    // Filtro
    React.createElement(View, {
      key: 'filtro',
      style: screenStyles.filtroContainer
    }, [
      React.createElement(TextInput, {
        key: 'filtroData',
        style: screenStyles.filtroInput,
        placeholder: 'Filtrar por data (YYYY-MM-DD)',
        placeholderTextColor: theme.colors.textSecondary,
        value: filtroData,
        onChangeText: setFiltroData
      })
    ]),

    // Lista
    React.createElement(FlatList, {
      key: 'list',
      data: vendasFiltradas,
      renderItem: renderVenda,
      keyExtractor: item => item.id,
      style: screenStyles.list,
      contentContainerStyle: screenStyles.listContent
    }),

    // Modal Nova Venda
    React.createElement(Modal, {
      key: 'modal',
      visible: modalVisible,
      animationType: 'slide',
      transparent: true
    },
      React.createElement(View, { style: screenStyles.modalContainer },
        React.createElement(View, { style: screenStyles.modalContent },
          React.createElement(Text, { style: screenStyles.modalTitle }, 'Nova Venda'),
          
          React.createElement(TextInput, {
            style: screenStyles.modalInput,
            placeholder: 'Cliente',
            placeholderTextColor: theme.colors.textSecondary,
            value: formData.cliente,
            onChangeText: (text) => setFormData({...formData, cliente: text})
          }),
          
          React.createElement(TextInput, {
            style: screenStyles.modalInput,
            placeholder: 'Serviço',
            placeholderTextColor: theme.colors.textSecondary,
            value: formData.servico,
            onChangeText: (text) => setFormData({...formData, servico: text})
          }),

          React.createElement(View, { style: screenStyles.row },
            React.createElement(TextInput, {
              style: [screenStyles.modalInput, { flex: 1, marginRight: 10 }],
              placeholder: 'Valor (R$)',
              placeholderTextColor: theme.colors.textSecondary,
              value: formData.valor,
              onChangeText: (text) => setFormData({...formData, valor: text}),
              keyboardType: 'decimal-pad'
            }),
            React.createElement(TextInput, {
              style: [screenStyles.modalInput, { flex: 1 }],
              placeholder: 'Barbeiro',
              placeholderTextColor: theme.colors.textSecondary,
              value: formData.barbeiro,
              onChangeText: (text) => setFormData({...formData, barbeiro: text})
            })
          ),

          React.createElement(Text, {
            key: 'labelPagamento',
            style: screenStyles.modalLabel
          }, 'Forma de Pagamento'),

          React.createElement(ScrollView, {
            key: 'pagamentoOptions',
            horizontal: true,
            style: screenStyles.pagamentoOptions,
            showsHorizontalScrollIndicator: false
          },
            formasPagamento.map((forma, index) => 
              React.createElement(TouchableOpacity, {
                key: `pagamento-${index}`,
                style: [
                  screenStyles.pagamentoOption,
                  formData.formaPagamento === forma && screenStyles.pagamentoOptionSelected
                ],
                onPress: () => setFormData({...formData, formaPagamento: forma})
              }, [
                React.createElement(Ionicons, {
                  key: 'icon',
                  name: getFormaPagamentoIcon(forma),
                  size: 16,
                  color: formData.formaPagamento === forma ? 'white' : theme.colors.primary
                }),
                React.createElement(Text, {
                  key: 'text',
                  style: [
                    screenStyles.pagamentoOptionText,
                    formData.formaPagamento === forma && screenStyles.pagamentoOptionTextSelected
                  ]
                }, forma)
              ])
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
              React.createElement(Text, { style: screenStyles.saveButtonText }, 'Registrar')
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
  resumoContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  resumoCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12
  },
  resumoValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4
  },
  resumoLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  filtroContainer: {
    padding: 16,
    backgroundColor: theme.colors.card
  },
  filtroInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
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
  valor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.success
  },
  cardInfo: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  pagamentoContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pagamentoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4
  },
  dataText: {
    fontSize: 12,
    color: theme.colors.textSecondary
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
    alignItems: 'center'
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
  pagamentoOptions: {
    flexDirection: 'row',
    marginBottom: 20
  },
  pagamentoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginRight: 8
  },
  pagamentoOptionSelected: {
    backgroundColor: theme.colors.primary
  },
  pagamentoOptionText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 4
  },
  pagamentoOptionTextSelected: {
    color: 'white'
  },
  row: {
    flexDirection: 'row'
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