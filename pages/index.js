/* eslint-disable jsx-a11y/alt-text, @next/next/no-img-element */

import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Schedule from '../components/Schedule'
import Feature from '../components/Feature'
import SectionTitle from '../components/SectionTitle'
import Story from '../components/Story'

function Features() {
  const casinoDesc = <>小賭怡情，大賭成家立業！<br />究竟你會是賭神贏到讓整隊成為黑馬獲勝呢？還是你會輸到脫褲子，讓原本勝券在握的你們成為最後一名呢？刺激又有趣的賭場活動，等你們來參加！</>
  return (
    <>
      <SectionTitle title="活動介紹" />
      <Feature name="大地遊戲" image={<img src="/flag.png" />} description="校園裡有八個神秘小關卡，學員們跟著小隊輔一起穿越到80年代闖關、收集卡帶，遊戲之中也能更了解元智校園哦！快來跟我們一起玩遊戲，在時空隧道裡奔跑吧！" withFilledBackground={true} />
      <Feature name="RPG" image={<img src="/game-console.png" />} description="一群大學生掉進去一個奇怪的世界，要逃離這個世界需要奪取傳說中的忘情水，通過層層關卡和挑戰才有機會拿到傳說中的水、杯子、白粉，接著找到阿霞，他會幫你調配忘情水（阿霞~~~給我一杯忘情水），必須藉由忘情水來打倒劉德華大魔王才能逃離這世界，究竟大學生們能不能逃離這裡？忘情水就藏在那邊了去尋找吧！" nameRotated={true} />
      <Feature name="斯名牌" image={<img src="/training.png" />} description="男女朋友相處久了多多少少會因為意見不合而吵架甚至分手。我們這裡有幾位分手後還是很難走出心裡那個痛的朋友們，需要小隊員們透過資想爆爆你以及資援前線幫助他們治療心靈的創傷來度過這次的難關，你們能幫幫忙嗎！" withFilledBackground={true} />
      <Feature name="賭場" image={<img src="/poker-chip.png" />} description={casinoDesc} />
    </>
  )
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>主頁 | 資想見你</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div className={styles['hero-container']}>
        <img src="hero-bg.jpg" />
        <div className={styles.hero}>
          <p>IC.IM.IN.CSE</p>
          <h1>資想見你</h1>
          <div className={styles.circles}>
            <span>四</span>
            <span>資</span>
            <span>迎</span>
            <span>新</span>
          </div>
          <p><span>2022 年 9 月 16 日</span><span className={styles['en-dash']}> — </span><span className={styles.pipe}>|</span><span style={{ whiteSpace: 'nowrap' }}>2022 年 9 月 18 日</span></p>
        </div>
      </div>
      <Story />
      <Schedule />
      <Features />
      </div>
  )
}
