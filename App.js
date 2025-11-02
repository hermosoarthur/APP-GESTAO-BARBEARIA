import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Importar telas diretamente
import LoginScreen from './src/screens/LoginScreen';
import AgendaScreen from './src/screens/AgendaScreen';
import ServicosScreen from './src/screens/ServicosScreen';
import VendasScreen from './src/screens/VendasScreen';
import RelatoriosScreen from './src/screens/RelatoriosScreen';

// Sistema de navegação simples
const SCREENS = {
  LOGIN: 'LOGIN',
  AGENDA: 'AGENDA',
  SERVICOS: 'SERVICOS',
  VENDAS: 'VENDAS',
  RELATORIOS: 'RELATORIOS'
};

export default function App() {
  const [currentScreen, setCurrentScreen] = React.useState(SCREENS.AGENDA); // Começa direto na agenda para testes
  const [user, setUser] = React.useState({ id: '1', name: 'Barbeiro' });

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.LOGIN:
        return React.createElement(LoginScreen, {
          onLogin: () => setCurrentScreen(SCREENS.AGENDA),
          navigation: { navigate: setCurrentScreen }
        });
      case SCREENS.AGENDA:
        return React.createElement(AgendaScreen, {
          key: 'agenda'
        });
      case SCREENS.SERVICOS:
        return React.createElement(ServicosScreen, {
          key: 'servicos'
        });
      case SCREENS.VENDAS:
        return React.createElement(VendasScreen, {
          key: 'vendas'
        });
      case SCREENS.RELATORIOS:
        return React.createElement(RelatoriosScreen, {
          key: 'relatorios'
        });
      default:
        return React.createElement(AgendaScreen);
    }
  };

  const isActive = (screen) => currentScreen === screen;

  return React.createElement(View, { style: styles.container }, [
    React.createElement(StatusBar, {
      key: 'statusbar',
      barStyle: 'dark-content'
    }),
    
    // Conteúdo principal
    React.createElement(View, {
      key: 'content',
      style: styles.content
    }, renderScreen()),

    // Barra de navegação inferior customizada
    React.createElement(View, {
      key: 'tabbar',
      style: styles.tabBar
    }, [
      React.createElement(TouchableOpacity, {
        key: 'tab1',
        style: [styles.tab, isActive(SCREENS.AGENDA) && styles.tabActive],
        onPress: () => setCurrentScreen(SCREENS.AGENDA)
      }, [
        React.createElement(Ionicons, {
          key: 'icon1',
          name: isActive(SCREENS.AGENDA) ? 'calendar' : 'calendar-outline',
          size: 24,
          color: isActive(SCREENS.AGENDA) ? '#007AFF' : '#666'
        }),
        React.createElement(Text, {
          key: 'text1',
          style: [styles.tabText, isActive(SCREENS.AGENDA) && styles.tabTextActive]
        }, 'Agenda')
      ]),

      React.createElement(TouchableOpacity, {
        key: 'tab2',
        style: [styles.tab, isActive(SCREENS.SERVICOS) && styles.tabActive],
        onPress: () => setCurrentScreen(SCREENS.SERVICOS)
      }, [
        React.createElement(Ionicons, {
          key: 'icon2',
          name: isActive(SCREENS.SERVICOS) ? 'cut' : 'cut-outline',
          size: 24,
          color: isActive(SCREENS.SERVICOS) ? '#007AFF' : '#666'
        }),
        React.createElement(Text, {
          key: 'text2',
          style: [styles.tabText, isActive(SCREENS.SERVICOS) && styles.tabTextActive]
        }, 'Serviços')
      ]),

      React.createElement(TouchableOpacity, {
        key: 'tab3',
        style: [styles.tab, isActive(SCREENS.VENDAS) && styles.tabActive],
        onPress: () => setCurrentScreen(SCREENS.VENDAS)
      }, [
        React.createElement(Ionicons, {
          key: 'icon3',
          name: isActive(SCREENS.VENDAS) ? 'cash' : 'cash-outline',
          size: 24,
          color: isActive(SCREENS.VENDAS) ? '#007AFF' : '#666'
        }),
        React.createElement(Text, {
          key: 'text3',
          style: [styles.tabText, isActive(SCREENS.VENDAS) && styles.tabTextActive]
        }, 'Vendas')
      ]),

      React.createElement(TouchableOpacity, {
        key: 'tab4',
        style: [styles.tab, isActive(SCREENS.RELATORIOS) && styles.tabActive],
        onPress: () => setCurrentScreen(SCREENS.RELATORIOS)
      }, [
        React.createElement(Ionicons, {
          key: 'icon4',
          name: isActive(SCREENS.RELATORIOS) ? 'stats-chart' : 'stats-chart-outline',
          size: 24,
          color: isActive(SCREENS.RELATORIOS) ? '#007AFF' : '#666'
        }),
        React.createElement(Text, {
          key: 'text4',
          style: [styles.tabText, isActive(SCREENS.RELATORIOS) && styles.tabTextActive]
        }, 'Relatórios')
      ])
    ])
  ]);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 5,
    paddingTop: 5
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
    color: '#666',
    marginTop: 4
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600'
  }
});