import styles from './Rodape.module.css'

export default function Rodape() {
  return (
    <footer className={styles.rodape}>
      <p>Studio | Rua das Flores, 123 - Centro, SP</p>
      <p>Seg-Sex: 9h-20h | Sáb: 9h-18h</p>
      <p>© 2025 Todos os direitos reservados.</p>
    </footer>
  )
}