import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockServicos = [
  { id: '1', nome: 'Corte Social', duracao: 30, preco: 35 },
  { id: '2', nome: 'Barba', duracao: 20, preco: 25 },
  { id: '3', nome: 'Corte + Barba', duracao: 50, preco: 55 }
];

export default function ServicosScreen() {
  const [servicos, setServicos] = React.useState(mockServicos);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [editingServico, setEditingServico] = React.useState(null);
  const [formData, setFormData] = React.useState({
    nome: '',
    duracao: '',
    preco: ''
  });

  const handleSave = () => {
    if (!formData.nome || !formData.duracao || !formData.preco) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (editingServico) {
      // Editar
      setServicos(servicos.map(s => 
        s.id === editingServico.id ? 
        { ...s, ...formData, duracao: parseInt(formData.duracao), preco: parseFloat(formData.preco) } : s
      ));
    } else {
      // Novo
      const novoServico = {
        id: Date.now().toString(),
        nome: formData.nome,
        duracao: parseInt(formData.duracao),
        preco: parseFloat(formData.preco)
      };
      setServicos([...servicos, novoServico]);
    }

    setModalVisible(false);
    setEditingServico(null);
    setFormData({ nome: '', duracao: '', preco: '' });
  };

  const handleEdit = (servico) => {
    setEditingServico(servico);
    setFormData({
      nome: servico.nome,
      duracao: servico.duracao.toString(),
      preco: servico.preco.toString()
    });
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Confirmar',
      'Deseja excluir este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => setServicos(servicos.filter(s => s.id !== id))
        }
      ]
    );
  };

  const renderServico = ({ item }) => React.createElement(View, {
    key: item.id,
    style: styles.servicoCard
  }, [
    React.createElement(View, { key: "info", style: styles.servicoInfo }, [
      React.createElement(Text, { key: "nome", style: styles.servicoNome }, item.nome),
      React.createElement(Text, { key: "detalhes", style: styles.servicoDetalhes }, 
        `${item.duracao} min - R$ ${item.preco.toFixed(2)}`
      )
    ]),
    React.createElement(View, { key: "actions", style: styles.actions }, [
      React.createElement(TouchableOpacity, {
        key: "edit",
        style: [styles.actionButton, { backgroundColor: '#007AFF' }],
        onPress: () => handleEdit(item)
      },
        React.createElement(Ionicons, { name: 'create', size: 16, color: 'white' })
      ),
      React.createElement(TouchableOpacity, {
        key: "delete",
        style: [styles.actionButton, { backgroundColor: '#FF3B30', marginLeft: 10 }],
        onPress: () => handleDelete(item.id)
      },
        React.createElement(Ionicons, { name: 'trash', size: 16, color: 'white' })
      )
    ])
  ]);

  return React.createElement(View, { style: styles.container }, [
    React.createElement(View, {
      key: "header",
      style: styles.header
    }, [
      React.createElement(Text, {
        key: "title",
        style: styles.title
      }, 'Serviços'),
      React.createElement(TouchableOpacity, {
        key: "addButton",
        style: styles.addButton,
        onPress: () => {
          setEditingServico(null);
          setFormData({ nome: '', duracao: '', preco: '' });
          setModalVisible(true);
        }
      },
        React.createElement(Ionicons, { name: 'add', size: 24, color: 'white' })
      )
    ]),

    React.createElement(FlatList, {
      key: "list",
      data: servicos,
      renderItem: renderServico,
      keyExtractor: item => item.id,
      style: styles.list,
      contentContainerStyle: styles.listContent
    }),

    // Modal para adicionar/editar serviço
    React.createElement(Modal, {
      key: "modal",
      visible: modalVisible,
      animationType: 'slide',
      transparent: true
    },
      React.createElement(View, { style: styles.modalContainer },
        React.createElement(View, { style: styles.modalContent },
          React.createElement(Text, { style: styles.modalTitle }, 
            editingServico ? 'Editar Serviço' : 'Novo Serviço'
          ),
          
          React.createElement(TextInput, {
            style: styles.modalInput,
            placeholder: 'Nome do Serviço',
            value: formData.nome,
            onChangeText: (text) => setFormData({...formData, nome: text})
          }),
          
          React.createElement(View, { style: styles.row },
            React.createElement(TextInput, {
              style: [styles.modalInput, { flex: 1, marginRight: 10 }],
              placeholder: 'Duração (min)',
              value: formData.duracao,
              onChangeText: (text) => setFormData({...formData, duracao: text}),
              keyboardType: 'numeric'
            }),
            React.createElement(TextInput, {
              style: [styles.modalInput, { flex: 1 }],
              placeholder: 'Preço (R$)',
              value: formData.preco,
              onChangeText: (text) => setFormData({...formData, preco: text}),
              keyboardType: 'decimal-pad'
            })
          ),

          React.createElement(View, { style: styles.modalButtons },
            React.createElement(TouchableOpacity, {
              style: [styles.modalButton, styles.cancelButton],
              onPress: () => setModalVisible(false)
            },
              React.createElement(Text, { style: styles.cancelButtonText }, 'Cancelar')
            ),
            React.createElement(TouchableOpacity, {
              style: [styles.modalButton, styles.saveButton],
              onPress: handleSave
            },
              React.createElement(Text, { style: styles.saveButtonText }, 'Salvar')
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
  list: {
    flex: 1
  },
  listContent: {
    padding: 10
  },
  servicoCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  servicoInfo: {
    flex: 1
  },
  servicoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4
  },
  servicoDetalhes: {
    fontSize: 14,
    color: '#666'
  },
  actions: {
    flexDirection: 'row'
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
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