import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockAgendamentos = [
  {
    id: '1',
    cliente: 'João Silva',
    telefone: '(11) 99999-9999',
    servico: 'Corte Social',
    barbeiro: 'Carlos',
    data: '2024-01-15',
    hora: '09:00',
    status: 'agendado'
  },
  {
    id: '2',
    cliente: 'Maria Santos',
    telefone: '(11) 88888-8888',
    servico: 'Barba',
    barbeiro: 'Pedro',
    data: '2024-01-15',
    hora: '10:00',
    status: 'confirmado'
  }
];

export default function AgendaScreen() {
  const [agendamentos, setAgendamentos] = React.useState(mockAgendamentos);

  const renderAgendamento = ({ item }) => {
    return React.createElement(View, {
      key: item.id,
      style: styles.card
    }, [
      React.createElement(View, {
        key: 'header',
        style: styles.cardHeader
      }, [
        React.createElement(Text, {
          key: 'cliente',
          style: styles.clienteNome
        }, item.cliente),
        React.createElement(View, {
          key: 'status',
          style: [styles.status, { backgroundColor: getStatusColor(item.status) }]
        },
          React.createElement(Text, {
            style: styles.statusText
          }, item.status)
        )
      ]),
      React.createElement(Text, {
        key: 'info1',
        style: styles.cardInfo
      }, `📞 ${item.telefone}`),
      React.createElement(Text, {
        key: 'info2',
        style: styles.cardInfo
      }, `✂️ ${item.servico} - ${item.barbeiro}`),
      React.createElement(Text, {
        key: 'info3',
        style: styles.cardInfo
      }, `🕒 ${item.data} ${item.hora}`)
    ]);
  };

  const getStatusColor = (status) => {
    const colors = {
      agendado: '#FFA500',
      confirmado: '#007AFF',
      cancelado: '#FF3B30',
      concluido: '#34C759'
    };
    return colors[status] || '#666';
  };

  return React.createElement(View, { style: styles.container }, [
    React.createElement(View, {
      key: 'header',
      style: styles.header
    }, [
      React.createElement(Text, {
        key: 'title',
        style: styles.title
      }, 'Agenda de Hoje'),
      React.createElement(TouchableOpacity, {
        key: 'addButton',
        style: styles.addButton,
        onPress: () => Alert.alert('Info', 'Funcionalidade de adicionar agendamento')
      },
        React.createElement(Ionicons, {
          name: 'add',
          size: 24,
          color: 'white'
        })
      )
    ]),

    React.createElement(FlatList, {
      key: 'list',
      data: agendamentos,
      renderItem: renderAgendamento,
      keyExtractor: item => item.id,
      style: styles.list
    })
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
    backgroundColor: 'white'
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
    flex: 1,
    padding: 10
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
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
    color: '#333'
  },
  status: {
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
    color: '#666',
    marginBottom: 4
  }
});