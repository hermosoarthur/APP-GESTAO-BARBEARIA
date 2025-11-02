import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data para relatórios
const mockRelatorios = {
  vendas: [
    { data: '2024-01-15', valor: 350 },
    { data: '2024-01-14', valor: 280 },
    { data: '2024-01-13', valor: 420 },
    { data: '2024-01-12', valor: 310 },
    { data: '2024-01-11', valor: 390 },
    { data: '2024-01-10', valor: 270 },
    { data: '2024-01-09', valor: 330 }
  ],
  servicos: [
    { nome: 'Corte Social', quantidade: 15, valor: 525 },
    { nome: 'Barba', quantidade: 8, valor: 200 },
    { nome: 'Corte + Barba', quantidade: 12, valor: 660 },
    { nome: 'Sobrancelha', quantidade: 5, valor: 75 }
  ],
  barbeiros: [
    { nome: 'Carlos', atendimentos: 18, valor: 540 },
    { nome: 'Pedro', atendimentos: 12, valor: 360 },
    { nome: 'Ana', atendimentos: 9, valor: 360 }
  ]
};

export default function RelatoriosScreen({ theme, styles }) {
  const [periodo, setPeriodo] = React.useState('semana');
  const [modalVisible, setModalVisible] = React.useState(false);

  const screenStyles = createScreenStyles(theme);

  const calcularTotais = () => {
    const vendasPeriodo = periodo === 'semana' 
      ? mockRelatorios.vendas.slice(0, 7)
      : mockRelatorios.vendas;

    const totalVendas = vendasPeriodo.reduce((sum, v) => sum + v.valor, 0);
    const totalAtendimentos = mockRelatorios.servicos.reduce((sum, s) => sum + s.quantidade, 0);
    const ticketMedio = totalAtendimentos > 0 ? totalVendas / totalAtendimentos : 0;

    return { totalVendas, totalAtendimentos, ticketMedio };
  };

  const { totalVendas, totalAtendimentos, ticketMedio } = calcularTotais();

  const handleExportCSV = () => {
    Alert.alert(
      'Exportar Relatório',
      'Deseja exportar o relatório em formato CSV?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Exportar', 
          onPress: () => {
            // Simulação de exportação
            Alert.alert('Sucesso', 'Relatório exportado com sucesso!');
          }
        }
      ]
    );
  };

  const StatCard = ({ title, value, subtitle, color }) => {
    return React.createElement(View, {
      style: screenStyles.statCard
    }, [
      React.createElement(Text, {
        key: 'value',
        style: [screenStyles.statValue, { color: color || theme.colors.primary }]
      }, value),
      React.createElement(Text, {
        key: 'title',
        style: screenStyles.statTitle
      }, title),
      subtitle && React.createElement(Text, {
        key: 'subtitle',
        style: screenStyles.statSubtitle
      }, subtitle)
    ]);
  };

  const ServicoItem = ({ servico, index }) => {
    return React.createElement(View, {
      key: servico.nome,
      style: screenStyles.servicoItem
    }, [
      React.createElement(View, {
        key: 'info',
        style: screenStyles.servicoInfo
      }, [
        React.createElement(Text, {
          key: 'nome',
          style: screenStyles.servicoNome
        }, servico.nome),
        React.createElement(Text, {
          key: 'quantidade',
          style: screenStyles.servicoQuantidade
        }, `${servico.quantidade} atendimentos`)
      ]),
      React.createElement(Text, {
        key: 'valor',
        style: screenStyles.servicoValor
      }, `R$ ${servico.valor}`)
    ]);
  };

  const BarbeiroItem = ({ barbeiro, index }) => {
    return React.createElement(View, {
      key: barbeiro.nome,
      style: screenStyles.barbeiroItem
    }, [
      React.createElement(View, {
        key: 'info',
        style: screenStyles.barbeiroInfo
      }, [
        React.createElement(Text, {
          key: 'nome',
          style: screenStyles.barbeiroNome
        }, barbeiro.nome),
        React.createElement(Text, {
          key: 'atendimentos',
          style: screenStyles.barbeiroAtendimentos
        }, `${barbeiro.atendimentos} atendimentos`)
      ]),
      React.createElement(Text, {
        key: 'valor',
        style: screenStyles.barbeiroValor
      }, `R$ ${barbeiro.valor}`)
    ]);
  };

  const VendaDiariaItem = ({ venda, index }) => {
    return React.createElement(View, {
      key: venda.data,
      style: screenStyles.vendaItem
    }, [
      React.createElement(Text, {
        key: 'data',
        style: screenStyles.vendaData
      }, formatData(venda.data)),
      React.createElement(Text, {
        key: 'valor',
        style: screenStyles.vendaValor
      }, `R$ ${venda.valor}`)
    ]);
  };

  const formatData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return React.createElement(ScrollView, {
    style: styles.content,
    contentContainerStyle: screenStyles.container
  }, [
    // Header
    React.createElement(View, {
      key: 'header',
      style: screenStyles.header
    }, [
      React.createElement(Text, {
        key: 'title',
        style: screenStyles.title
      }, 'Relatórios'),
      React.createElement(TouchableOpacity, {
        key: 'exportButton',
        style: screenStyles.exportButton,
        onPress: handleExportCSV
      }, [
        React.createElement(Ionicons, {
          key: 'icon',
          name: 'download',
          size: 20,
          color: theme.colors.primary
        }),
        React.createElement(Text, {
          key: 'text',
          style: screenStyles.exportButtonText
        }, 'CSV')
      ])
    ]),

    // Filtros de período
    React.createElement(View, {
      key: 'filtros',
      style: screenStyles.filtrosContainer
    }, [
      React.createElement(TouchableOpacity, {
        key: 'semana',
        style: [
          screenStyles.filtroButton,
          periodo === 'semana' && screenStyles.filtroButtonActive
        ],
        onPress: () => setPeriodo('semana')
      },
        React.createElement(Text, {
          style: [
            screenStyles.filtroButtonText,
            periodo === 'semana' && screenStyles.filtroButtonTextActive
          ]
        }, '7 Dias')
      ),
      React.createElement(TouchableOpacity, {
        key: 'mes',
        style: [
          screenStyles.filtroButton,
          periodo === 'mes' && screenStyles.filtroButtonActive
        ],
        onPress: () => setPeriodo('mes')
      },
        React.createElement(Text, {
          style: [
            screenStyles.filtroButtonText,
            periodo === 'mes' && screenStyles.filtroButtonTextActive
          ]
        }, '30 Dias')
      )
    ]),

    // Estatísticas principais
    React.createElement(View, {
      key: 'estatisticas',
      style: screenStyles.estatisticasContainer
    }, [
      React.createElement(StatCard, {
        key: 'vendas',
        title: 'Total de Vendas',
        value: `R$ ${totalVendas}`,
        color: theme.colors.success
      }),
      React.createElement(StatCard, {
        key: 'atendimentos',
        title: 'Atendimentos',
        value: totalAtendimentos.toString(),
        color: theme.colors.primary
      }),
      React.createElement(StatCard, {
        key: 'ticket',
        title: 'Ticket Médio',
        value: `R$ ${ticketMedio.toFixed(2)}`,
        color: theme.colors.warning
      })
    ]),

    // Serviços mais realizados
    React.createElement(View, {
      key: 'servicos',
      style: screenStyles.section
    }, [
      React.createElement(Text, {
        key: 'title',
        style: screenStyles.sectionTitle
      }, 'Serviços Mais Realizados'),
      ...mockRelatorios.servicos.map((servico, index) => 
        React.createElement(ServicoItem, {
          key: servico.nome,
          servico: servico,
          index: index
        })
      )
    ]),

    // Performance dos barbeiros
    React.createElement(View, {
      key: 'barbeiros',
      style: screenStyles.section
    }, [
      React.createElement(Text, {
        key: 'title',
        style: screenStyles.sectionTitle
      }, 'Performance da Equipe'),
      ...mockRelatorios.barbeiros.map((barbeiro, index) => 
        React.createElement(BarbeiroItem, {
          key: barbeiro.nome,
          barbeiro: barbeiro,
          index: index
        })
      )
    ]),

    // Vendas por dia
    React.createElement(View, {
      key: 'vendasDiarias',
      style: screenStyles.section
    }, [
      React.createElement(Text, {
        key: 'title',
        style: screenStyles.sectionTitle
      }, 'Vendas por Dia'),
      ...mockRelatorios.vendas.slice(0, 7).map((venda, index) => 
        React.createElement(VendaDiariaItem, {
          key: venda.data,
          venda: venda,
          index: index
        })
      )
    ])
  ]);
}

const createScreenStyles = (theme) => StyleSheet.create({
  container: {
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary
  },
  exportButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: 4
  },
  filtrosContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  filtroButton: {
    flex: 1,
    padding: 12,
    backgroundColor: theme.colors.card,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center'
  },
  filtroButtonActive: {
    backgroundColor: theme.colors.primary
  },
  filtroButtonText: {
    color: theme.colors.text,
    fontWeight: '600'
  },
  filtroButtonTextActive: {
    color: 'white'
  },
  estatisticasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  statTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  },
  statSubtitle: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2
  },
  section: {
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 12
  },
  servicoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  servicoInfo: {
    flex: 1
  },
  servicoNome: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2
  },
  servicoQuantidade: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  servicoValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.success
  },
  barbeiroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  barbeiroInfo: {
    flex: 1
  },
  barbeiroNome: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2
  },
  barbeiroAtendimentos: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  barbeiroValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary
  },
  vendaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  vendaData: {
    fontSize: 14,
    color: theme.colors.text
  },
  vendaValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.success
  }
});