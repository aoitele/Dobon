import Link from 'next/link'
import React from 'react'
import style from './index.module.scss'

const HowToPage = () => {
  return (
    <div className={style.wrap}>
      <section className={style.section}>
        <h2>Dobonとは</h2>
        <p><span className={style.emphasisTxt}>相手の捨て札でドボンを狙い、獲得スコアを争うトランプゲーム</span>です</p>
        <p>手札に存在するカード数字の合計（もしくは差分）を相手が出したとき「ドボン」でスコアを獲得できます。</p>
      </section>
      <section className={style.section}>
        <h2>ゲームルール</h2>
        <div className={style.qaBlock}>
          <h3>Q. 場に出せるカードはどう決まる？</h3>
          <p><span className={style.emphasisTxt}> 柄か数字が同じカード</span>を場に出すことができます。</p>
          <div>
            例：捨て札が<img src='/images/cards/c1.png' width={50} height={75} />のとき
            <div className={style.exampleTrashCards}>
              <div><img src='/images/cards/h1.png' width={50} height={75} />OK</div>
              <div><img src='/images/cards/c13.png' width={50} height={75} />OK</div>
              <div><img src='/images/cards/h3.png' width={50} height={75} />NG</div>
              <div><img src='/images/cards/h8.png' width={50} height={75} />OK</div>
              <div><img src='/images/cards/x0.png' width={50} height={75} />OK</div>
            </div>
            <span className={style.hintText}>💡Joker、8はいつでも出せます</span>
          </div>
        </div>
        <div className={style.qaBlock}>
          <h3>Q. 自分のターンにできることは？</h3>
          <p><span className={style.emphasisTxt}>・カードを引く(ドロー)<br/>・カードを場に出す<br/>・ターンをスキップ</span><br/>3つのアクションが可能です。</p>
          <span className={style.hintText}>💡自分のターンが来たとき、手札に出せるカードが無い場合はドローが必要です。</span>
          <span className={style.hintText}>💡ドローしてカードを出すか、スキップするかは自由です。</span>
          <span className={style.hintText}>💡ドローする前であれば前の人が出したカードに対して「ドボン」もできます。</span>
        </div>
        <div className={style.qaBlock}>
          <h3>Q. 他の人のターンにできることは？</h3>
          <p>他の人が出したカードに対して<span className={style.emphasisTxt}>「ドボン」</span>ができます。</p>
          <span className={style.hintText}>💡ドボンは早い者勝ちのため、他プレイヤーが先にドボンしたときスコアは獲得できません。</span>
        </div>
        <div className={style.qaBlock}>
          <h3>Q. 手札をすべて出したら勝ち？</h3>
          <p><span className={style.emphasisTxt}>自分が「ドボン」に成功した時のみ</span>勝ちとなります。</p>
        </div>
        <div className={style.qaBlock}>
          <h3>Q. 「ドボン」の計算方法について知りたい</h3>
          <p className={style.dobonDesc}>
          <span className={style.emphasisTxt}>・手札が2枚以下の時は「合計 or 差分」</span><span className={style.emphasisTxt}><br/>
          ・3枚以上の時は「合計」</span><br/><span className={style.emphasisTxt}>・Jokerは+1、-1どちらにも利用</span>できます。
          </p>
          <div>
            例：手札が<br/>
            <img src='/images/cards/c1.png' width={50} height={75} /><img src='/images/cards/c3.png' width={50} height={75} />のとき→「2 or 4」<br/>
            <img src='/images/cards/c1.png' width={50} height={75} /><img src='/images/cards/c3.png' width={50} height={75} /><img src='/images/cards/c5.png' width={50} height={75} />のとき→「9」<br/>
            <img src='/images/cards/c1.png' width={50} height={75} /><img src='/images/cards/c3.png' width={50} height={75} /><img src='/images/cards/x0.png' width={50} height={75} />のとき→「3 or 5」
            <img src='/images/cards/c1.png' width={50} height={75} /><img src='/images/cards/c3.png' width={50} height={75} /><img src='/images/cards/x0.png' width={50} height={75} /><img src='/images/cards/x1.png' width={50} height={75} />のとき→「2 or 4 or 6」
          </div>
          <span className={style.hintText}>💡Jokerは上がり数字を増やすのに便利なため、基本的に手札で保持がおすすめです。</span>
        </div>
      </section>
      <section className={style.section}>
        <h2>役について</h2>
        <p>カードの一部は役（効果）を持ち、効果を活用することでゲームを有利に進めることができます。</p>
        <div className={style.effectDesc}>
          <img src='/images/cards/c1.png' width={50} height={75} />
          <span>1の数字は<span className={style.emphasisTxt}>次のユーザーをスキップ</span>させます</span>
        </div>
        <div className={style.effectDesc}>
          <img src='/images/cards/c2.png' width={50} height={75} />
          <span>2の数字は<span className={style.emphasisTxt}>次のユーザーにカードを2枚引かせます。</span>（出されたユーザーが2を持っていたら効果を次のユーザーに流すことができます）</span>
        </div>
        <div className={style.effectDesc}>
          <img src='/images/cards/c8.png' width={50} height={75} />
          <span>8の数字はいつでも出すことができます。出す際に柄を指定する事で、<span className={style.emphasisTxt}>次のユーザーは指定した柄しか出せなくなります。</span>（Joker、8を除く）</span>
        </div>
        <div className={style.effectDesc}>
          <img src='/images/cards/c11.png' width={50} height={75} />
          <span>11の数字は<span className={style.emphasisTxt}>ターンの順番を逆にします。</span></span>
        </div>
        <div className={style.effectDesc}>
          <img src='/images/cards/c13.png' width={50} height={75} />
          <span>13の数字は<span className={style.emphasisTxt}>次のユーザーの手札を公開状態にします。</span>出されたユーザーが13を持っていたら効果を次のユーザーに流すことができます）</span>
        </div>
      </section>
      <div>
        <Link href="/">
          <a className={style.link}>TOPに戻る</a>
        </Link>
      </div>
    </div>
  )
}

export default HowToPage