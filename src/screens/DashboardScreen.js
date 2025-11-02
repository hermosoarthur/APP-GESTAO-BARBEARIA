import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock data
const mockData = {
  agendamentosHoje: 8,
  totalVendasHoje: 350,
  servicoMaisRealizado: 'Corte Social',
  agendamentos: [
    { id: '1', cliente: 'João Silva', hora: '09:00', servico: 'Corte Social', barbeiro: 'Carlos' },
    { id: '2', cliente: 'Maria Santos', hora: '10:00', servico: 'Barba', barbeiro: 'Pedro' },
    { id: '3', cliente: 'José Oliveira', hora: '11:00', servico: 'Corte + Barba', barbeiro: 'Ana' }
  ]
};

export default function DashboardScreen({ theme, styles, onNavigate }) {
  const cardStyles = createCardStyles(theme);

  const QuickActionButton = ({ icon, title, screen }) => {
    return React.createElement(TouchableOpacity, {
      style: cardStyles.quickAction,
      onPress: () => onNavigate(screen)
    }, [
      React.createElement(View, {
        key: 'iconContainer',
        style: cardStyles.quickActionIcon
      },
        React.createElement(Ionicons, {
          name: icon,
          size: 24,
          color: theme.colors.primary
        })
      ),
      React.createElement(Text, {
        key: 'title',
        style: cardStyles.quickActionText
      }, title)
    ]);
  };

  return React.createElement(ScrollView, {
    style: styles.content,
    contentContainerStyle: cardStyles.container
  }, [
    // Resumo do dia
    React.createElement(View, {
      key: 'resumo',
      style: cardStyles.section
    }, [
      React.createElement(Text, {
        key: 'title',
        style: cardStyles.sectionTitle
      }, 'Resumo do Dia'),
      
      React.createElement(View, {
        key: 'stats',
        style: cardStyles.statsContainer
      }, [
        React.createElement(View, {
          key: 'stat1',
          style: cardStyles.statCard
        }, [
          React.createElement(Text, {
            key: 'value',
            style: cardStyles.statValue
          }, mockData.agendamentosHoje.toString()),
          React.createElement(Text, {
            key: 'label',
            style: cardStyles.statLabel
          }, 'Agendamentos')
        ]),
        
        React.createElement(View, {
          key: 'stat2',
          style: cardStyles.statCard
        }, [
          React.createElement(Text, {
            key: 'value',
            style: cardStyles.statValue
          }, `R$ ${mockData.totalVendasHoje}`),
          React.createElement(Text, {
            key: 'label',
            style: cardStyles.statLabel
          }, 'Vendas Hoje')
        ]),
        
        React.createElement(View, {
          key: 'stat3',
          style: cardStyles.statCard
        }, [
          React.createElement(Text, {
            key: 'value',
            style: [cardStyles.statValue, { fontSize: 14 }]
          }, mockData.servicoMaisRealizado),
          React.createElement(Text, {
            key: 'label',
            style: cardStyles.statLabel
          }, 'Serviço Top')
        ])
      ])
    ]),

    // Ações rápidas
    React.createElement(View, {
      key: 'quickActions',
      style: cardStyles.section
    }, [
      React.createElement(Text, {
        key: 'title',
        style: cardStyles.sectionTitle
      }, 'Acesso Rápido'),
      
      React.createElement(View, {
        key: 'actions',
        style: cardStyles.quickActionsContainer
      }, [
        React.createElement(QuickActionButton, {
          key: 'agenda',
          icon: 'calendar',
          title: 'Agendamentos',
          screen: 'AGENDAMENTOS'
        }),
        React.createElement(QuickActionButton, {
          key: 'servicos',
          icon: 'cut',
          title: 'Serviços',
          screen: 'SERVICOS'
        }),
        React.createElement(QuickActionButton, {
          key: 'vendas',
          icon: 'cash',
          title: 'Vendas',
          screen: 'VENDAS'
        }),
        React.createElement(QuickActionButton, {
          key: 'funcionarios',
          icon: 'people',
          title: 'Equipe',
          screen: 'FUNCIONARIOS'
        })
      ])
    ]),

    // Próximos agendamentos
    React.createElement(View, {
      key: 'proximos',
      style: cardStyles.section
    }, [
      React.createElement(Text, {
        key: 'title',
        style: cardStyles.sectionTitle
      }, 'Próximos Agendamentos'),
      
      ...mockData.agendamentos.map(agendamento => 
        React.createElement(View, {
          key: agendamento.id,
          style: cardStyles.agendamentoCard
        }, [
          React.createElement(View, {
            key: 'header',
            style: cardStyles.agendamentoHeader
          }, [
            React.createElement(Text, {
              key: 'cliente',
              style: cardStyles.agendamentoCliente
            }, agendamento.cliente),
            React.createElement(Text, {
              key: 'hora',
              style: cardStyles.agendamentoHora
            }, agendamento.hora)
          ]),
          React.createElement(Text, {
            key: 'servico',
            style: cardStyles.agendamentoServico
          }, `${agendamento.servico} • ${agendamento.barbeiro}`)
        ])
      )
    ])
  ]);
}

const createCardStyles = (theme) => StyleSheet.create({
  container: {
    padding: 16
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center'
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  quickAction: {
    width: '48%',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center'
  },
  agendamentoCard: {
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  agendamentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  agendamentoCliente: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text
  },
  agendamentoHora: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600'
  },
  agendamentoServico: {
    fontSize: 14,
    color: theme.colors.textSecondary
  }
});