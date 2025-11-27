import styles from './BotaoDownload.module.css'

export default function BotaoDownload() {
  return (
    <div className={styles.download} id="download">
      <h2>Baixe o App Agora!</h2>
      <p>Disponível para Android (APK)</p>
      <a href="/app-gestao-barbearia.apk" download className={styles.botao}>
        Download APK
      </a>
      <p><small>Em breve na Play Store</small></p>
    </div>
  )
}