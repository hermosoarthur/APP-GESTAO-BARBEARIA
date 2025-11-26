import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'; // IMPORT CORRETO
import { Ionicons } from '@expo/vector-icons';

// Telas otimizadas
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AgendamentosScreen from './src/screens/AgendamentosScreen';
import ServicosScreen from './src/screens/ServicosScreen';
import FuncionariosScreen from './src/screens/FuncionariosScreen';
import RelatoriosScreen from './src/screens/RelatoriosScreen';

const SCREENS = {
  LOGIN: 'LOGIN',
  DASHBOARD: 'DASHBOARD',
  AGENDAMENTOS: 'AGENDAMENTOS',
  SERVICOS: 'SERVICOS',
  FUNCIONARIOS: 'FUNCIONARIOS',
  RELATORIOS: 'RELATORIOS'
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.LOGIN);
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);

  const theme = useMemo(() => ({
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
  }), [darkMode]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentScreen(SCREENS.DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen(SCREENS.LOGIN);
  };

  const renderScreen = () => {
    const screenProps = { theme, styles, user, onNavigate: setCurrentScreen };
    
    switch (currentScreen) {
      case SCREENS.LOGIN:
        return <LoginScreen onLogin={handleLogin} />;
      case SCREENS.DASHBOARD:
        return <DashboardScreen {...screenProps} />;
      case SCREENS.AGENDAMENTOS:
        return <AgendamentosScreen {...screenProps} />;
      case SCREENS.SERVICOS:
        return <ServicosScreen {...screenProps} />;
      case SCREENS.FUNCIONARIOS:
        return <FuncionariosScreen {...screenProps} />;
      case SCREENS.RELATORIOS:
        return <RelatoriosScreen {...screenProps} />;
      default:
        return <DashboardScreen {...screenProps} />;
    }
  };



  const TabButton = ({ screen, icon, label }) => {
    const isActive = currentScreen === screen;
    return (
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => setCurrentScreen(screen)}
      >
        <Ionicons 
          name={isActive ? icon : `${icon}-outline`} 
          size={22} 
          color={isActive ? theme.colors.primary : theme.colors.textSecondary} 
        />
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        
        {/* Header (hidden on LOGIN) */}
        {currentScreen !== SCREENS.LOGIN && (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Studio</Text>
            <View style={styles.headerActions}>
              <Text style={styles.userInfo}>{user?.email || 'Usuário'}</Text>
              <TouchableOpacity style={styles.themeButton} onPress={() => setDarkMode(!darkMode)}>
                <Ionicons name={darkMode ? 'sunny' : 'moon'} size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Conteúdo */}
        <View style={styles.content}>
          {renderScreen()}
        </View>

        {/* Navegação (hidden on LOGIN) */}
        {currentScreen !== SCREENS.LOGIN && (
          <View style={styles.tabBar}>
            <TabButton screen={SCREENS.DASHBOARD} icon="home" label="Home" />
            <TabButton screen={SCREENS.AGENDAMENTOS} icon="calendar" label="Agenda" />
            <TabButton screen={SCREENS.SERVICOS} icon="cut" label="Serviços" />
            <TabButton screen={SCREENS.FUNCIONARIOS} icon="people" label="Equipe" />
            <TabButton screen={SCREENS.RELATORIOS} icon="stats-chart" label="Relatórios" />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  userInfo: {
    fontSize: 12,
    color: theme.colors.textSecondary
  },
  themeButton: {
    padding: 8,
    borderRadius: 20
  },
  logoutButton: {
    padding: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.danger
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