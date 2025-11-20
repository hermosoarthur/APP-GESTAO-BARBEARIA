import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { databaseService } from '../../services/databaseService';

const { width } = Dimensions.get('window');

export default function RelatoriosScreen({ theme, styles, user }) { // ← user adicionado
  const [periodo, setPeriodo] = useState('semana');
  const [relatorioData, setRelatorioData] = useState({ 
    vendas: [], 
    servicos: [], 
    barbeiros: [],
    metricas: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    if (user?.id) {
      loadRelatorioData(); 
    }
  }, [periodo, user]); // ← adicionar user como dependência

  const loadRelatorioData = async () => {
    setLoading(true);
    
    try {
      const [agendamentosResult, servicosResult, funcionariosResult] = await Promise.all([
        databaseService.read('agendamentos', user.id), // ← user.id
        databaseService.read('servicos', user.id), // ← user.id
        databaseService.read('funcionarios', user.id) // ← user.id
      ]);

      if (agendamentosResult.success && servicosResult.success && funcionariosResult.success) {
        const dadosProcessados = processarDadosRelatorios(
          agendamentosResult.data,
          servicosResult.data,
          funcionariosResult.data,
          periodo
        );
        setRelatorioData(dadosProcessados);
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      Alert.alert('Erro', 'Falha ao carregar dados dos relatórios');
    } finally {
      setLoading(false);
    }
  };

  const processarDadosRelatorios = (agendamentos, servicos, funcionarios, periodoSelecionado) => {
  const dias = periodoSelecionado === 'semana' ? 7 : 30;
  const hoje = new Date();
  
  // Buscar vendas registradas
  const vendasRegistradas = []; // Em produção, busque do databaseService.read('vendas')
  
  // Calcular vendas de agendamentos concluídos
  const agendamentosConcluidos = agendamentos.filter(ag => ag.status === 'concluido');
  
  // Gerar dados de vendas dos últimos dias
  const vendas = Array.from({ length: dias }, (_, i) => {
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - (dias - 1 - i));
    const dataString = data.toISOString().split('T')[0];
    
    const agendamentosDia = agendamentos.filter(ag => ag.data === dataString);
    const agendamentosConcluidosDia = agendamentosConcluidos.filter(ag => ag.data === dataString);
    
    const totalDia = agendamentosConcluidosDia.reduce((sum, ag) => {
      const servico = servicos.find(s => s.nome === ag.servico);
      return sum + (servico?.preco || 0);
    }, 0);
    
    return {
      data: dataString,
      valor: totalDia,
      agendamentos: agendamentosDia.length,
      concluidos: agendamentosConcluidosDia.length
    };
  });

    // Serviços mais realizados
    const servicosCount = {};
    agendamentos.forEach(ag => {
      servicosCount[ag.servico] = (servicosCount[ag.servico] || 0) + 1;
    });

    const servicosMaisRealizados = Object.entries(servicosCount)
      .map(([nome, quantidade]) => {
        const servico = servicos.find(s => s.nome === nome);
        return {
          nome,
          quantidade,
          valor: (servico?.preco || 0) * quantidade
        };
      })
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);

    // Performance dos barbeiros
    const barbeirosPerformance = funcionarios
      .filter(f => f.status === 'ativo')
      .map(barbeiro => {
        const agendamentosBarbeiro = agendamentos.filter(ag => ag.barbeiro === barbeiro.nome);
        const totalVendas = agendamentosBarbeiro.reduce((sum, ag) => {
          const servico = servicos.find(s => s.nome === ag.servico);
          return sum + (servico?.preco || 0);
        }, 0);

        return {
          nome: barbeiro.nome,
          atendimentos: agendamentosBarbeiro.length,
          valor: totalVendas,
          funcao: barbeiro.funcao
        };
      })
      .sort((a, b) => b.valor - a.valor);

    // Métricas gerais
    const totalVendasPeriodo = vendas.reduce((sum, v) => sum + v.valor, 0);
    const totalAtendimentosPeriodo = vendas.reduce((sum, v) => sum + v.agendamentos, 0);
    const ticketMedio = totalAtendimentosPeriodo > 0 ? totalVendasPeriodo / totalAtendimentosPeriodo : 0;
    
    const ocupacaoBarbeiros = barbeirosPerformance.length > 0 
      ? barbeirosPerformance.reduce((sum, b) => sum + b.atendimentos, 0) / barbeirosPerformance.length
      : 0;

    return {
      vendas,
      servicos: servicosMaisRealizados,
      barbeiros: barbeirosPerformance,
      metricas: {
        totalVendas: totalVendasPeriodo,
        totalAtendimentos: totalAtendimentosPeriodo,
        ticketMedio,
        ocupacaoMedia: ocupacaoBarbeiros,
        servicoMaisPopular: servicosMaisRealizados[0]?.nome || 'Nenhum',
        barbeiroDestaque: barbeirosPerformance[0]?.nome || 'Nenhum'
      }
    };
  };

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

  const StatCard = ({ title, value, subtitle, color, icon }) => (
    <View style={screenStyles.statCard}>
      <View style={[screenStyles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[screenStyles.statValue, { color }]}>{value}</Text>
      <Text style={screenStyles.statTitle}>{title}</Text>
      {subtitle && <Text style={screenStyles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ProgressBar = ({ percentage, color }) => (
    <View style={screenStyles.progressBarContainer}>
      <View 
        style={[
          screenStyles.progressBar, 
          { 
            width: `${percentage}%`,
            backgroundColor: color
          }
        ]} 
      />
    </View>
  );

  const screenStyles = createScreenStyles(theme);

  if (loading) {
    return (
      <View style={styles.content}>
        <View style={screenStyles.loadingContainer}>
          <Ionicons name="stats-chart" size={48} color={theme.colors.primary} />
          <Text style={screenStyles.loadingText}>Carregando relatórios...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.content} contentContainerStyle={screenStyles.container}>
      {/* Header */}
      <View style={screenStyles.header}>
        <View>
          <Text style={screenStyles.title}>Relatórios</Text>
          <Text style={screenStyles.subtitle}>
            {periodo === 'semana' ? 'Últimos 7 dias' : 'Últimos 30 dias'}
          </Text>
        </View>
        <TouchableOpacity style={screenStyles.exportButton} onPress={handleExportCSV}>
          <Ionicons name="download" size={20} color={theme.colors.primary} />
          <Text style={screenStyles.exportButtonText}>Exportar</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros de período */}
      <View style={screenStyles.filtrosContainer}>
        <TouchableOpacity 
          style={[
            screenStyles.filtroButton,
            periodo === 'semana' && screenStyles.filtroButtonActive
          ]}
          onPress={() => setPeriodo('semana')}
        >
          <Text style={[
            screenStyles.filtroButtonText,
            periodo === 'semana' && screenStyles.filtroButtonTextActive
          ]}>
            Última Semana
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            screenStyles.filtroButton,
            periodo === 'mes' && screenStyles.filtroButtonActive
          ]}
          onPress={() => setPeriodo('mes')}
        >
          <Text style={[
            screenStyles.filtroButtonText,
            periodo === 'mes' && screenStyles.filtroButtonTextActive
          ]}>
            Último Mês
          </Text>
        </TouchableOpacity>
      </View>

      {/* Métricas Principais */}
      <View style={screenStyles.section}>
        <Text style={screenStyles.sectionTitle}>Visão Geral</Text>
        <View style={screenStyles.metricsContainer}>
          <StatCard 
            title="Total de Vendas" 
            value={`R$ ${relatorioData.metricas.totalVendas.toFixed(2)}`}
            subtitle={`${relatorioData.metricas.totalAtendimentos} atendimentos`}
            color={theme.colors.success}
            icon="cash"
          />
          <StatCard 
            title="Ticket Médio" 
            value={`R$ ${relatorioData.metricas.ticketMedio.toFixed(2)}`}
            color={theme.colors.primary}
            icon="trending-up"
          />
        </View>
        <View style={screenStyles.metricsContainer}>
          <StatCard 
            title="Serviço Top" 
            value={relatorioData.metricas.servicoMaisPopular}
            color={theme.colors.warning}
            icon="trophy"
          />
          <StatCard 
            title="Destaque" 
            value={relatorioData.metricas.barbeiroDestaque}
            subtitle="Barbeiro do período"
            color={theme.colors.success}
            icon="star"
          />
        </View>
      </View>

      {/* Serviços Mais Realizados */}
      <View style={screenStyles.section}>
        <Text style={screenStyles.sectionTitle}>Serviços Mais Realizados</Text>
        <View style={screenStyles.chartContainer}>
          {relatorioData.servicos.map((servico, index) => (
            <View key={servico.nome} style={screenStyles.chartItem}>
              <View style={screenStyles.chartInfo}>
                <Text style={screenStyles.chartLabel}>{servico.nome}</Text>
                <Text style={screenStyles.chartValue}>{servico.quantidade} atend.</Text>
              </View>
              <ProgressBar 
                percentage={(servico.quantidade / Math.max(...relatorioData.servicos.map(s => s.quantidade))) * 100} 
                color={theme.colors.primary}
              />
              <Text style={screenStyles.chartAmount}>R$ {servico.valor.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Performance dos Barbeiros */}
      <View style={screenStyles.section}>
        <Text style={screenStyles.sectionTitle}>Performance da Equipe</Text>
        <View style={screenStyles.barbeirosContainer}>
          {relatorioData.barbeiros.map((barbeiro, index) => (
            <View key={barbeiro.nome} style={screenStyles.barbeiroCard}>
              <View style={screenStyles.barbeiroHeader}>
                <View style={screenStyles.barbeiroInfo}>
                  <Text style={screenStyles.barbeiroNome}>{barbeiro.nome}</Text>
                  <Text style={screenStyles.barbeiroFuncao}>{barbeiro.funcao}</Text>
                </View>
                <View style={screenStyles.barbeiroStats}>
                  <Text style={screenStyles.barbeiroAtendimentos}>
                    {barbeiro.atendimentos} atend.
                  </Text>
                  <Text style={screenStyles.barbeiroValor}>
                    R$ {barbeiro.valor.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View style={screenStyles.performanceBar}>
                <View 
                  style={[
                    screenStyles.performanceFill,
                    { 
                      width: `${(barbeiro.atendimentos / Math.max(...relatorioData.barbeiros.map(b => b.atendimentos))) * 100}%`,
                      backgroundColor: index === 0 ? theme.colors.warning : theme.colors.primary
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Vendas por Dia */}
      <View style={screenStyles.section}>
        <Text style={screenStyles.sectionTitle}>Vendas por Dia</Text>
        <View style={screenStyles.vendasContainer}>
          {relatorioData.vendas.map((venda, index) => (
            <View key={venda.data} style={screenStyles.vendaItem}>
              <View style={screenStyles.vendaInfo}>
                <Text style={screenStyles.vendaData}>
                  {formatDisplayDate(venda.data)}
                </Text>
                <Text style={screenStyles.vendaAgendamentos}>
                  {venda.agendamentos} agend.
                </Text>
              </View>
              <Text style={screenStyles.vendaValor}>
                R$ {venda.valor.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// Funções auxiliares
const formatDisplayDate = (dateString) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}`;
};

const createScreenStyles = (theme) => StyleSheet.create({
  container: { padding: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10'
  },
  exportButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    marginLeft: 6
  },
  filtrosContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 4
  },
  filtroButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  filtroButtonActive: {
    backgroundColor: theme.colors.primary
  },
  filtroButtonText: {
    color: theme.colors.text,
    fontWeight: '600',
    fontSize: 14
  },
  filtroButtonTextActive: {
    color: 'white'
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
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center'
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
  chartContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  chartItem: {
    marginBottom: 16
  },
  chartInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1
  },
  chartValue: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  chartAmount: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: '600',
    textAlign: 'right',
    marginTop: 4
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: 3
  },
  barbeirosContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  barbeiroCard: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  barbeiroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  barbeiroInfo: {
    flex: 1
  },
  barbeiroNome: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4
  },
  barbeiroFuncao: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  barbeiroStats: {
    alignItems: 'flex-end'
  },
  barbeiroAtendimentos: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 2
  },
  barbeiroValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.success
  },
  performanceBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden'
  },
  performanceFill: {
    height: '100%',
    borderRadius: 2
  },
  vendasContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  vendaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  vendaInfo: {
    flex: 1
  },
  vendaData: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2
  },
  vendaAgendamentos: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  vendaValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.success
  }
});