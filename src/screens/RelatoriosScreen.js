import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data
const mockVendas = [
  { id: '1', data: '2024-01-15', valor: 35, servico: 'Corte Social' },
  { id: '2', data: '2024-01-15', valor: 25, servico: 'Barba' },
  { id: '3', data: '2024-01-14', valor: 55, servico: 'Corte + Barba' },
  { id: '4', data: '2024-01-14', valor: 35, servico: 'Corte Social' }
];

export default function RelatoriosScreen() {
  const [periodo, setPeriodo] = React.useState('hoje');
  const [dataInicio, setDataInicio] = React.useState(new Date().toISOString().split('T')[0]);
  const [dataFim, setDataFim] = React.useState(new Date().toISOString().split('T')[0]);

  const getVendasFiltradas = () => {
    const hoje = new Date().toISOString().split('T')[0];
    
    switch (periodo) {
      case 'hoje':
        return mockVendas.filter(v => v.data === hoje);
      case 'semana':
        // Simulação - na prática você calcularia a semana
        return mockVendas.filter(v => {
          const dataVenda = new Date(v.data);
          const umaSemanaAtras = new Date();
          umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);
          return dataVenda >= umaSemanaAtras;
        });
      case 'mes':
        return mockVendas.filter(v => v.data.startsWith('2024-01'));
      case 'personalizado':
        return mockVendas.filter(v => v.data >= dataInicio && v.data <= dataFim);
      default:
        return mockVendas;
    }
  };

  const vendasFiltradas = getVendasFiltradas();
  const totalVendas = vendasFiltradas.reduce((sum, v) => sum + v.valor, 0);
  const quantidadeVendas = vendasFiltradas.length;
  const ticketMedio = quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0;

  const servicosMaisVendidos = vendasFiltradas.reduce((acc, venda) => {
    acc[venda.servico] = (acc[venda.servico] || 0) + 1;
    return acc;
  }, {});

  return React.createElement(ScrollView, { 
    style: styles.container,
    contentContainerStyle: styles.content
  }, [
    React.createElement(Text, {
      key: "title",
      style: styles.title
    }, 'Relatórios'),

    // Filtros de período
    React.createElement(View, {
      key: "filtros",
      style: styles.filtrosContainer
    }, [
      React.createElement(TouchableOpacity, {
        key: "hoje",
        style: [styles.filtroButton, periodo === 'hoje' && styles.filtroAtivo],
        onPress: () => setPeriodo('hoje')
      },
        React.createElement(Text, {
          style: [styles.filtroText, periodo === 'hoje' && styles.filtroTextAtivo]
        }, 'Hoje')
      ),
      React.createElement(TouchableOpacity, {
        key: "semana",
        style: [styles.filtroButton, periodo === 'semana' && styles.filtroAtivo],
        onPress: () => setPeriodo('semana')
      },
        React.createElement(Text, {
          style: [styles.filtroText, periodo === 'semana' && styles.filtroTextAtivo]
        }, 'Semana')
      ),
      React.createElement(TouchableOpacity, {
        key: "mes",
        style: [styles.filtroButton, periodo === 'mes' && styles.filtroAtivo],
        onPress: () => setPeriodo('mes')
      },
        React.createElement(Text, {
          style: [styles.filtroText, periodo === 'mes' && styles.filtroTextAtivo]
        }, 'Mês')
      )
    ]),

    // Cards de resumo
    React.createElement(View, {
      key: "resumo",
      style: styles.resumoContainer
    }, [
      React.createElement(View, {
        key: "total",
        style: styles.resumoCard
      }, [
        React.createElement(Ionicons, {
          key: "icon",
          name: 'cash',
          size: 32,
          color: '#34C759'
        }),
        React.createElement(Text, {
          key: "valor",
          style: styles.resumoValor
        }, `R$ ${totalVendas.toFixed(2)}`),
        React.createElement(Text, {
          key: "label",
          style: styles.resumoLabel
        }, 'Total Vendido')
      ]),

      React.createElement(View, {
        key: "quantidade",
        style: styles.resumoCard
      }, [
        React.createElement(Ionicons, {
          key: "icon",
          name: 'people',
          size: 32,
          color: '#007AFF'
        }),
        React.createElement(Text, {
          key: "valor",
          style: styles.resumoValor
        }, quantidadeVendas.toString()),
        React.createElement(Text, {
          key: "label",
          style: styles.resumoLabel
        }, 'Atendimentos')
      ]),

      React.createElement(View, {
        key: "ticket",
        style: styles.resumoCard
      }, [
        React.createElement(Ionicons, {
          key: "icon",
          name: 'trending-up',
          size: 32,
          color: '#FF9500'
        }),
        React.createElement(Text, {
          key: "valor",
          style: styles.resumoValor
        }, `R$ ${ticketMedio.toFixed(2)}`),
        React.createElement(Text, {
          key: "label",
          style: styles.resumoLabel
        }, 'Ticket Médio')
      ])
    ]),

    // Serviços mais vendidos
    React.createElement(View, {
      key: "servicos",
      style: styles.servicosContainer
    }, [
      React.createElement(Text, {
        key: "titulo",
        style: styles.sectionTitle
      }, 'Serviços Mais Vendidos'),
      
      Object.entries(servicosMaisVendidos).map(([servico, quantidade], index) => 
        React.createElement(View, {
          key: servico,
          style: styles.servicoItem
        }, [
          React.createElement(Text, {
            key: "nome",
            style: styles.servicoNome
          }, servico),
          React.createElement(Text, {
            key: "quantidade",
            style: styles.servicoQuantidade
          }, `${quantidade} vendas`)
        ])
      )
    ]),

    // Últimas vendas
    React.createElement(View, {
      key: "ultimasVendas",
      style: styles.vendasContainer
    }, [
      React.createElement(Text, {
        key: "titulo",
        style: styles.sectionTitle
      }, 'Últimas Vendas'),
      
      vendasFiltradas.slice(0, 5).map(venda =>
        React.createElement(View, {
          key: venda.id,
          style: styles.vendaItem
        }, [
          React.createElement(View, {
            key: "info",
            style: styles.vendaInfo
          }, [
            React.createElement(Text, {
              key: "servico",
              style: styles.vendaServico
            }, venda.servico),
            React.createElement(Text, {
              key: "data",
              style: styles.vendaData
            }, venda.data)
          ]),
          React.createElement(Text, {
            key: "valor",
            style: styles.vendaValor
          }, `R$ ${venda.valor.toFixed(2)}`)
        ])
      )
    ])
  ]);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  content: {
    padding: 16
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center'
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  filtroButton: {
    flex: 1,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  filtroAtivo: {
    backgroundColor: '#007AFF'
  },
  filtroText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666'
  },
  filtroTextAtivo: {
    color: 'white'
  },
  resumoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  resumoCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  resumoValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8
  },
  resumoLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  servicosContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  servicoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  servicoNome: {
    fontSize: 14,
    color: '#333'
  },
  servicoQuantidade: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600'
  },
  vendasContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2
  },
  vendaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  vendaInfo: {
    flex: 1
  },
  vendaServico: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  vendaData: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  vendaValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34C759'
  }
});