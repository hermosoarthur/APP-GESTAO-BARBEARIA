import { Link } from 'react-router-dom'
import styles from './Cabecalho.module.css'

export default function Cabecalho() {
  return (
    <header className={styles.cabecalho}>
      <Link to="/" className={styles.logo}>
        <img 
          src="/imagens/logo.png" 
          alt="Studio" 
          className={styles.logoImg} 
        />
      </Link>

      <nav>
        <Link to="/">Início</Link>
        <Link to="/servicos">Serviços</Link>
        <Link to="/equipe">Equipe</Link>
        <Link to="/contato">Contato</Link>
      </nav>
    </header>
  )
}
