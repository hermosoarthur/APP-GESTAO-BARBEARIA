import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importar telas
import DashboardScreen from './src/screens/DashboardScreen';
import AgendamentosScreen from './src/screens/AgendamentosScreen';
import ServicosScreen from './src/screens/ServicosScreen';
import VendasScreen from './src/screens/VendasScreen';
import FuncionariosScreen from './src/screens/FuncionariosScreen';
import RelatoriosScreen from './src/screens/RelatoriosScreen';

// Sistema de navegação
const SCREENS = {
  DASHBOARD: 'DASHBOARD',
  AGENDAMENTOS: 'AGENDAMENTOS',
  SERVICOS: 'SERVICOS',
  VENDAS: 'VENDAS',
  FUNCIONARIOS: 'FUNCIONARIOS',
  RELATORIOS: 'RELATORIOS'
};

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState(SCREENS.DASHBOARD);
  const [darkMode, setDarkMode] = React.useState(true);

  const theme = {
    dark: darkMode,
    colors: {
      background: darkMode ? '#0f0f0f' : '#f8f9fa',
      card: darkMode ? '#1a1a1a' : '#ffffff',
      text: darkMode ? '#ffffff' : '#000000',
      textSecondary: darkMode ? '#b0b0b0' : '#666666',
      primary: '#007AFF',
      success: '#34C759',
      warning: '#FF9500',
      danger: '#FF3B30',
      border: darkMode ? '#333333' : '#e0e0e0'
    }
  };

  const styles = createStyles(theme);

  const renderScreen = () => {
    const screenProps = {
      theme: theme,
      styles: styles
    };

    switch (currentScreen) {
      case SCREENS.DASHBOARD:
        return React.createElement(DashboardScreen, {
          ...screenProps,
          onNavigate: setCurrentScreen
        });
      case SCREENS.AGENDAMENTOS:
        return React.createElement(AgendamentosScreen, screenProps);
      case SCREENS.SERVICOS:
        return React.createElement(ServicosScreen, screenProps);
      case SCREENS.VENDAS:
        return React.createElement(VendasScreen, screenProps);
      case SCREENS.FUNCIONARIOS:
        return React.createElement(FuncionariosScreen, screenProps);
      case SCREENS.RELATORIOS:
        return React.createElement(RelatoriosScreen, screenProps);
      default:
        return React.createElement(DashboardScreen, screenProps);
    }
  };

  const isActive = (screen) => currentScreen === screen;

  return React.createElement(View, { style: styles.container }, [
    React.createElement(StatusBar, {
      key: 'statusbar',
      barStyle: darkMode ? 'light-content' : 'dark-content',
      backgroundColor: theme.colors.background
    }),
    
    // Header
    React.createElement(View, {
      key: 'header',
      style: styles.header
    }, [
      React.createElement(Text, {
        key: 'title',
        style: styles.headerTitle
      }, 'App Barber'),
      React.createElement(TouchableOpacity, {
        key: 'themeToggle',
        style: styles.themeButton,
        onPress: () => setDarkMode(!darkMode)
      },
        React.createElement(Ionicons, {
          name: darkMode ? 'sunny' : 'moon',
          size: 24,
          color: theme.colors.primary
        })
      )
    ]),

    // Conteúdo principal
    React.createElement(View, {
      key: 'content',
      style: styles.content
    }, renderScreen()),

    // Barra de navegação inferior
    React.createElement(View, {
      key: 'tabbar',
      style: styles.tabBar
    }, [
      React.createElement(TouchableOpacity, {
        key: 'tab1',
        style: [styles.tab, isActive(SCREENS.DASHBOARD) && styles.tabActive],
        onPress: () => setCurrentScreen(SCREENS.DASHBOARD)
      }, [
        React.createElement(Ionicons, {
          key: 'icon1',
          name: isActive(SCREENS.DASHBOARD) ? 'home' : 'home-outline',
          size: 22,
          color: isActive(SCREENS.DASHBOARD) ? theme.colors.primary : theme.colors.textSecondary
        }),
        React.createElement(Text, {
          key: 'text1',
          style: [styles.tabText, isActive(SCREENS.DASHBOARD) && styles.tabTextActive]
        }, 'Home')
      ]),

      React.createElement(TouchableOpacity, {
        key: 'tab2',
        style: [styles.tab, isActive(SCREENS.AGENDAMENTOS) && styles.tabActive],
        onPress: () => setCurrentScreen(SCREENS.AGENDAMENTOS)
      }, [
        React.createElement(Ionicons, {
          key: 'icon2',
          name: isActive(SCREENS.AGENDAMENTOS) ? 'calendar' : 'calendar-outline',
          size: 22,
          color: isActive(SCREENS.AGENDAMENTOS) ? theme.colors.primary : theme.colors.textSecondary
        }),
        React.createElement(Text, {
          key: 'text2',
          style: [styles.tabText, isActive(SCREENS.AGENDAMENTOS) && styles.tabTextActive]
        }, 'Agenda')
      ]),

      React.createElement(TouchableOpacity, {
        key: 'tab3',
        style: [styles.tab, isActive(SCREENS.SERVICOS) && styles.tabActive],
        onPress: () => setCurrentScreen(SCREENS.SERVICOS)
      }, [
        React.createElement(Ionicons, {
          key: 'icon3',
          name: isActive(SCREENS.SERVICOS) ? 'cut' : 'cut-outline',
          size: 22,
          color: isActive(SCREENS.SERVICOS) ? theme.colors.primary : theme.colors.textSecondary
        }),
        React.createElement(Text, {
          key: 'text3',
          style: [styles.tabText, isActive(SCREENS.SERVICOS) && styles.tabTextActive]
        }, 'Serviços')
      ]),

      React.createElement(TouchableOpacity, {
        key: 'tab4',
        style: [styles.tab, isActive(SCREENS.FUNCIONARIOS) && styles.tabActive],
        onPress: () => setCurrentScreen(SCREENS.FUNCIONARIOS)
      }, [
        React.createElement(Ionicons, {
          key: 'icon4',
          name: isActive(SCREENS.FUNCIONARIOS) ? 'people' : 'people-outline',
          size: 22,
          color: isActive(SCREENS.FUNCIONARIOS) ? theme.colors.primary : theme.colors.textSecondary
        }),
        React.createElement(Text, {
          key: 'text4',
          style: [styles.tabText, isActive(SCREENS.FUNCIONARIOS) && styles.tabTextActive]
        }, 'Equipe')
      ]),

      React.createElement(TouchableOpacity, {
        key: 'tab5',
        style: [styles.tab, isActive(SCREENS.RELATORIOS) && styles.tabActive],
        onPress: () => setCurrentScreen(SCREENS.RELATORIOS)
      }, [
        React.createElement(Ionicons, {
          key: 'icon5',
          name: isActive(SCREENS.RELATORIOS) ? 'stats-chart' : 'stats-chart-outline',
          size: 22,
          color: isActive(SCREENS.RELATORIOS) ? theme.colors.primary : theme.colors.textSecondary
        }),
        React.createElement(Text, {
          key: 'text5',
          style: [styles.tabText, isActive(SCREENS.RELATORIOS) && styles.tabTextActive]
        }, 'Relatórios')
      ])
    ])
  ]);
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text
  },
  themeButton: {
    padding: 8,
    borderRadius: 20
  },
  content: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: 5,
    paddingTop: 8
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    padding: 8
  },
  tabActive: {
    // Estilo para aba ativa
  },
  tabText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4
  },
  tabTextActive: {
    color: theme.colors.primary,
    fontWeight: '600'
  }
});