import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockVendas = [
  {
    id: '1',
    data: '2024-01-15',
    cliente: 'João Silva',
    servicos: ['Corte Social'],
    valor: 35,
    formaPagamento: 'Dinheiro',
    responsavel: 'Carlos'
  },
  {
    id: '2',
    data: '2024-01-15',
    cliente: 'Maria Santos',
    servicos: ['Barba'],
    valor: 25,
    formaPagamento: 'Cartão',
    responsavel: 'Pedro'
  }
];

const formasPagamento = ['Dinheiro', 'Cartão Débito', 'Cartão Crédito', 'PIX'];

export default function VendasScreen() {
  const [vendas, setVendas] = React.useState(mockVendas);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [novaVenda, setNovaVenda] = React.useState({
    cliente: '',
    servicos: [],
    valor: '',
    formaPagamento: 'Dinheiro',
    responsavel: ''
  });

  const handleAddVenda = () => {
    if (!novaVenda.cliente || !novaVenda.valor || !novaVenda.responsavel) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    const venda = {
      ...novaVenda,
      id: Date.now().toString(),
      data: new Date().toISOString().split('T')[0],
      valor: parseFloat(novaVenda.valor)
    };

    setVendas([venda, ...vendas]);
    setModalVisible(false);
    setNovaVenda({
      cliente: '',
      servicos: [],
      valor: '',
      formaPagamento: 'Dinheiro',
      responsavel: ''
    });
  };

  const renderVenda = ({ item }) => React.createElement(View, {
    key: item.id,
    style: styles.vendaCard
  }, [
    React.createElement(View, { key: "header", style: styles.vendaHeader }, [
      React.createElement(Text, { key: "cliente", style: styles.clienteNome }, item.cliente),
      React.createElement(Text, { key: "valor", style: styles.valor }, `R$ ${item.valor.toFixed(2)}`)
    ]),
    React.createElement(Text, { key: "data", style: styles.vendaInfo }, `📅 ${item.data}`),
    React.createElement(Text, { key: "pagamento", style: styles.vendaInfo }, `💳 ${item.formaPagamento}`),
    React.createElement(Text, { key: "responsavel", style: styles.vendaInfo }, `👤 ${item.responsavel}`),
    React.createElement(Text, { key: "servicos", style: styles.servicos }, item.servicos.join(', '))
  ]);

  return React.createElement(View, { style: styles.container }, [
    React.createElement(View, {
      key: "header",
      style: styles.header
    }, [
      React.createElement(Text, {
        key: "title",
        style: styles.title
      }, 'Registro de Vendas'),
      React.createElement(TouchableOpacity, {
        key: "addButton",
        style: styles.addButton,
        onPress: () => setModalVisible(true)
      },
        React.createElement(Ionicons, { name: 'add', size: 24, color: 'white' })
      )
    ]),

    React.createElement(View, {
      key: "resumo",
      style: styles.resumo
    }, [
      React.createElement(View, { key: "total", style: styles.resumoItem },
        React.createElement(Text, { style: styles.resumoValor }, 
          `R$ ${vendas.reduce((sum, v) => sum + v.valor, 0).toFixed(2)}`
        ),
        React.createElement(Text, { style: styles.resumoLabel }, 'Total Hoje')
      ),
      React.createElement(View, { key: "qtd", style: styles.resumoItem },
        React.createElement(Text, { style: styles.resumoValor }, vendas.length.toString()),
        React.createElement(Text, { style: styles.resumoLabel }, 'Vendas')
      )
    ]),

    React.createElement(FlatList, {
      key: "list",
      data: vendas,
      renderItem: renderVenda,
      keyExtractor: item => item.id,
      style: styles.list
    }),

    // Modal para nova venda
    React.createElement(Modal, {
      key: "modal",
      visible: modalVisible,
      animationType: 'slide',
      transparent: true
    },
      React.createElement(View, { style: styles.modalContainer },
        React.createElement(View, { style: styles.modalContent },
          React.createElement(Text, { style: styles.modalTitle }, 'Nova Venda'),
          
          React.createElement(TextInput, {
            style: styles.modalInput,
            placeholder: 'Nome do Cliente',
            value: novaVenda.cliente,
            onChangeText: (text) => setNovaVenda({...novaVenda, cliente: text})
          }),
          
          React.createElement(TextInput, {
            style: styles.modalInput,
            placeholder: 'Valor (R$)',
            value: novaVenda.valor,
            onChangeText: (text) => setNovaVenda({...novaVenda, valor: text}),
            keyboardType: 'decimal-pad'
          }),

          React.createElement(TextInput, {
            style: styles.modalInput,
            placeholder: 'Responsável',
            value: novaVenda.responsavel,
            onChangeText: (text) => setNovaVenda({...novaVenda, responsavel: text})
          }),

          React.createElement(View, { style: styles.modalButtons },
            React.createElement(TouchableOpacity, {
              style: [styles.modalButton, styles.cancelButton],
              onPress: () => setModalVisible(false)
            },
              React.createElement(Text, { style: styles.cancelButtonText }, 'Cancelar')
            ),
            React.createElement(TouchableOpacity, {
              style: [styles.modalButton, styles.saveButton],
              onPress: handleAddVenda
            },
              React.createElement(Text, { style: styles.saveButtonText }, 'Registrar')
            )
          )
        )
      )
    )
  ]);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  resumo: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  resumoItem: {
    flex: 1,
    alignItems: 'center'
  },
  resumoValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  resumoLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  list: {
    flex: 1
  },
  vendaCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  vendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  clienteNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  valor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34C759'
  },
  vendaInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4
  },
  servicos: {
    fontSize: 14,
    color: '#007AFF',
    fontStyle: 'italic',
    marginTop: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16
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
    backgroundColor: '#f0f0f0'
  },
  saveButton: {
    backgroundColor: '#007AFF'
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600'
  }
});