import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { databaseService } from '../../services/databaseService';

export default function DashboardScreen({ theme, styles, onNavigate, user }) {
  const [dashboardData, setDashboardData] = useState({
    agendamentosHoje: 0,
    totalVendasHoje: 0,
    servicoMaisRealizado: '',
    proximosAgendamentos: []
  });

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    const hoje = new Date().toISOString().split('T')[0];
    
    const [agendamentosResult, servicosResult] = await Promise.all([
      databaseService.getAgendamentosByDate(hoje, user.id), // ← user.id adicionado
      databaseService.read('servicos', user.id) // ← user.id adicionado
    ]);

    if (agendamentosResult.success && servicosResult.success) {
      const agendamentosHoje = agendamentosResult.data.length;
      const agendamentosConcluidos = agendamentosResult.data.filter(ag => ag.status === 'concluido');
      
      const totalVendas = agendamentosConcluidos.reduce((sum, ag) => {
        const servico = servicosResult.data.find(s => s.nome === ag.servico);
        return sum + (servico?.preco || 0);
      }, 0);
        
      // Encontrar serviço mais realizado
      const servicoCount = {};
      agendamentosResult.data.forEach(ag => {
        servicoCount[ag.servico] = (servicoCount[ag.servico] || 0) + 1;
      });
      
      const servicoMaisRealizado = Object.keys(servicoCount).reduce((a, b) => 
        servicoCount[a] > servicoCount[b] ? a : b, 'Nenhum'
      );

      setDashboardData({
        agendamentosHoje,
        totalVendasHoje: totalVendas,
        servicoMaisRealizado,
        proximosAgendamentos: agendamentosResult.data
          .filter(ag => ag.status !== 'concluido')
          .sort((a, b) => a.hora.localeCompare(b.hora))
          .slice(0, 3)
      });
    }
  };

  const screenStyles = createScreenStyles(theme);

  const StatCard = ({ value, label, color, icon }) => (
    <View style={screenStyles.statCard}>
      <View style={[screenStyles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[screenStyles.statValue, { color }]}>{value}</Text>
      <Text style={screenStyles.statLabel}>{label}</Text>
    </View>
  );

  const QuickAction = ({ icon, title, screen }) => (
    <TouchableOpacity style={screenStyles.quickAction} onPress={() => onNavigate(screen)}>
      <View style={screenStyles.quickActionIcon}>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={screenStyles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.content} contentContainerStyle={screenStyles.container}>
      {/* Saudação */}
      <View style={screenStyles.greeting}>
        <Text style={screenStyles.greetingText}>
          Olá, {user?.email?.split('@')[0] || 'Usuário'}! 👋
        </Text>
        <Text style={screenStyles.greetingSubtext}>
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
          })}
        </Text>
      </View>

      {/* Estatísticas principais */}
      <View style={screenStyles.section}>
        <Text style={screenStyles.sectionTitle}>Resumo do Dia</Text>
        <View style={screenStyles.statsContainer}>
          <StatCard 
            value={dashboardData.agendamentosHoje.toString()} 
            label="Agendamentos" 
            color={theme.colors.primary}
            icon="calendar"
          />
          <StatCard 
            value={`R$ ${dashboardData.totalVendasHoje}`} 
            label="Vendas Hoje" 
            color={theme.colors.success}
            icon="cash"
          />
          <StatCard 
            value={dashboardData.servicoMaisRealizado} 
            label="Serviço Top" 
            color={theme.colors.warning}
            icon="trending-up"
          />
        </View>
      </View>

      {/* Ações Rápidas */}
      <View style={screenStyles.section}>
        <Text style={screenStyles.sectionTitle}>Acesso Rápido</Text>
        <View style={screenStyles.quickActionsContainer}>
          <QuickAction icon="calendar" title="Agendamentos" screen="AGENDAMENTOS" />
          <QuickAction icon="cut" title="Serviços" screen="SERVICOS" />
          <QuickAction icon="people" title="Equipe" screen="FUNCIONARIOS" />
          <QuickAction icon="stats-chart" title="Relatórios" screen="RELATORIOS" />
        </View>
      </View>

      {/* Próximos Agendamentos */}
      <View style={screenStyles.section}>
        <View style={screenStyles.sectionHeader}>
          <Text style={screenStyles.sectionTitle}>Próximos Agendamentos</Text>
          <TouchableOpacity onPress={() => onNavigate('AGENDAMENTOS')}>
            <Text style={screenStyles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        
        {dashboardData.proximosAgendamentos.map(agendamento => (
          <View key={agendamento.id} style={screenStyles.agendamentoCard}>
            <View style={screenStyles.agendamentoHeader}>
              <View style={screenStyles.agendamentoInfo}>
                <Text style={screenStyles.agendamentoCliente}>{agendamento.cliente}</Text>
                <Text style={screenStyles.agendamentoServico}>
                  {agendamento.servico} • {agendamento.barbeiro}
                </Text>
              </View>
              <View style={screenStyles.agendamentoTime}>
                <Text style={screenStyles.agendamentoHora}>{agendamento.hora}</Text>
                <View style={[screenStyles.statusDot, { 
                  backgroundColor: getStatusColor(agendamento.status) 
                }]} />
              </View>
            </View>
          </View>
        ))}
        
        {dashboardData.proximosAgendamentos.length === 0 && (
          <View style={screenStyles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={screenStyles.emptyText}>Nenhum agendamento para hoje</Text>
            <TouchableOpacity 
              style={screenStyles.emptyButton}
              onPress={() => onNavigate('AGENDAMENTOS')}
            >
              <Text style={screenStyles.emptyButtonText}>Fazer primeiro agendamento</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const getStatusColor = (status) => ({
  agendado: '#FF9500', 
  confirmado: '#007AFF', 
  concluido: '#34C759', 
  cancelado: '#FF3B30'
}[status] || '#666');

const createScreenStyles = (theme) => StyleSheet.create({
  container: { padding: 16 },
  greeting: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4
  },
  greetingSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary
  },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text
  },
  seeAllText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600'
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
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
    alignItems: 'center'
  },
  agendamentoInfo: {
    flex: 1
  },
  agendamentoCliente: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4
  },
  agendamentoServico: {
    fontSize: 14,
    color: theme.colors.textSecondary
  },
  agendamentoTime: {
    alignItems: 'flex-end'
  },
  agendamentoHora: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: 4
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: theme.colors.card,
    borderRadius: 12
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14
  }
});