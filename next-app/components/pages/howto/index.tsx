import Link from 'next/link'
import React from 'react'
import style from './index.module.scss'
import Image from 'next/image'
import { Spacer } from '../../foundations/Spacer'

const HowToPage = () => {
  return (
    <div className={style.wrap}>
      <div className={style.content}>
        <h1>{`トランプゲーム「ドボン」の\nルール・遊び方`}</h1>
        <p>{`ブラウザで遊べるトランプゲーム「ドボン」の\nゲームルールや遊び方をご紹介します。`}</p>
        <Spacer size={20} axis='vertical' />
        <Image src='/images/howto/mv.jpg' width={640} height={480}></Image>
        <section className={style.section}>
          <h2>ドボンとは</h2>
          <p><span className={style.emphasisTxt}>
            相手の捨て札でドボンを狙う、スコア獲得型のトランプゲーム</span>です。</p>
          <p>UNO（ウノ）のように、お互いが同じ数字や柄のカードを捨てつつ、誰かがドボンする（上がる）までゲームを続けていきます。</p>
          <p>手札に存在するカード数字の合計（もしくは差分）を相手が出したとき「ドボン」でスコアを獲得できます。</p>
        </section>
        <section className={style.section}>
          <h2>ゲームルール</h2>
          <div className={style.qaBlock}>
            <h3>カードの出し方</h3>
            <p><span className={style.emphasisTxt}> 柄か数字が同じカード</span>を場に出すことができます。</p>
            <div>
              例：捨て札が<img src='/images/cards/c1.png' width={50} height={75} alt='クラブの1'/>のとき
              <div className={style.exampleTrashCards}>
                <div><img src='/images/cards/h1.png' width={50} height={75} alt='ハートの1'/>OK</div>
                <div><img src='/images/cards/c13.png' width={50} height={75} alt='クラブの13'/>OK</div>
                <div><img src='/images/cards/h3.png' width={50} height={75} alt='ハートの3'/>NG</div>
                <div><img src='/images/cards/h8.png' width={50} height={75} alt='ハートの8'/>OK</div>
                <div><img src='/images/cards/x0.png' width={50} height={75} alt='ジョーカー'/>OK</div>
              </div>
              <span className={style.hintText}>💡Joker、8はいつでも出せます</span>
            </div>
          </div>
          <div className={style.qaBlock}>
            <h3>自分のターンが来た時の進め方</h3>
            <p>
              <span className={style.emphasisTxt}>
                ・カードを引く(ドロー)<br/>
                ・カードを場に出す<br/>
                ・ターンをスキップ
                </span>
              <Spacer size={20} axis='vertical' style={{'display': 'block'}}/>
              3つのアクションが可能です。
            </p>
            <span className={style.hintText}>💡自分のターンが来たとき、手札に出せるカードが無い場合はドローが必要です。</span>
            <span className={style.hintText}>💡ドローしてカードを出すか、スキップするかは自由です。</span>
            <span className={style.hintText}>💡ドローする前であれば前の人が出したカードに対して「ドボン」もできます。</span>
          </div>
          <div className={style.qaBlock}>
            <h3>「ドボン」する方法（上がり方）</h3>
            <p>他の人がカードを出した時、<span className={style.emphasisTxt}>自分の手札がドボンできる条件に合致していたら</span>「ドボン」ができます。</p>
            <span className={style.hintText}>💡このブラウザゲームではコンピュータ戦の場合、ドボンするかしないか自分の選択を待つようにしています。</span>
            <span className={style.hintText}>💡対人戦の場合はドボンは早い者勝ちになるため、他プレイヤーが先にドボンしたときスコアは獲得できません。</span>
          </div>
          <div className={style.qaBlock}>
            <h3>「ドボン」の計算方法について</h3>
            <p className={style.dobonDesc}>
            <span className={style.emphasisTxt}>・手札が2枚以下の時は「合計 or 差分」</span><span className={style.emphasisTxt}><br/>
            ・3枚以上の時は「合計」</span><br/><span className={style.emphasisTxt}>・Jokerは+1、-1どちらにも利用</span>できます。
            </p>
            <div className={style.dobonExample}>
              （手札の例）<br/>
              <img src='/images/cards/c1.png' width={50} height={75} alt='クラブの1'/><img src='/images/cards/c3.png' width={50} height={75} alt='クラブの3'/> なら<br/>「2か4」で上がれます。（1 + 3）<br/>
              <img src='/images/cards/c1.png' width={50} height={75} alt='クラブの1'/><img src='/images/cards/c3.png' width={50} height={75} alt='クラブの3'/><img src='/images/cards/c5.png' width={50} height={75} alt='クラブの5'/>なら<br/>「9」で上がれます。（1 + 3 + 5）<br/>
              <img src='/images/cards/c1.png' width={50} height={75} alt='クラブの1'/><img src='/images/cards/c3.png' width={50} height={75} alt='クラブの3'/><img src='/images/cards/x0.png' width={50} height={75} alt='ジョーカー'/>なら<br/>「3か5」で上がれます。（1 + 3 (+- 1)）<br/>
              <img src='/images/cards/c1.png' width={50} height={75} alt='クラブの1'/><img src='/images/cards/c3.png' width={50} height={75} alt='クラブの3'/><img src='/images/cards/x0.png' width={50} height={75} alt='ジョーカー'/><img src='/images/cards/x1.png' width={50} height={75} alt='ジョーカー'/>なら<br/>「2か4か6」で上がれます。（1 + 3 (+- 2)）
            </div>
            <span className={style.hintText}>💡Jokerは上がり数字を増やすのに便利なため、手札に保持がおすすめです。</span>
          </div>
          <div className={style.qaBlock}>
            <h3>Q. 手札をすべて出したら勝ち？</h3>
            <p><span className={style.emphasisTxt}>自分が「ドボン」に成功した時のみ</span>勝ちとなります。</p>
          </div>
        </section>
        <section className={style.section}>
          <h2>ゲームの進め方</h2>
          <p>ドボンゲームの流れについて、実際にトランプを使ったゲームの進め方を解説します。本ブラウザゲームでも同様の進行となります。</p>
          <div className={style.gameDesc}>
            <p>1. 全部で何ゲーム行うかを決めて、じゃんけんで親を決めます。</p>
            <p>2. 親がカードをよく切り、各プレイヤーに5枚ずつ配る。</p>
            <p>3. 親が山札から1枚カードを場に出してゲームスタート。親から時計回りでターンを進める。</p>
            <p>4. 自分のターンが来たら場に出ているカードと同じ数字、もしくは同じ柄のカードを出す。もしカードが出せない場合は山札からカードを引く。</p>
            <p>5. 4を繰り返し、他の人の捨て札が自分のドボン条件に合致したら「ドボン!」と宣言して、場にすべての手札を出す。全プレイヤーで確認してドボンで間違いなければスコア計算に移る。</p>
            <p>6. スコア計算で得点が決まったら、上がった人（ドボンに成功したプレイヤー）には加点、上がられた人（ドボンされたプレイヤー）には減点を行う。</p>
            <p>7. 次のゲームはドボンされたプレイヤーから開始する。</p>
            <p>8. 全てのゲーム数が終了した時点で、得点の高かったプレイヤーが勝ちとなる。</p>
          </div>
          <span className={style.hintText}>💡ドボンの参加人数に制限はありませんが、2〜5名が最適です。</span>
          <span className={style.hintText}>💡ここでカードを出すか出さないかは自由です。周りのプレイヤーの手札状況を見て判断しましょう。</span>
          <span className={style.hintText}>💡もしドボンでない場合、「誤ドボン」として当該プレイヤーはペナルティを受けます。（ドボンした時点での手札を全て公開状態にしてゲームを再開する）</span>
        </section>
        <section className={style.section}>
          <h2>役について</h2>
          <p>カードの一部は役（効果）を持ち、効果を活用することでゲームを有利に進めることができます。</p>
          <div className={style.effectDesc}>
            <img src='/images/cards/c1.png' width={50} height={75} alt='クラブの1'/>
            <span>1の数字は<span className={style.emphasisTxt}>次のユーザーをスキップ</span>させます</span>
          </div>
          <div className={style.effectDesc}>
            <img src='/images/cards/c2.png' width={50} height={75} alt='クラブの2'/>
            <span>2の数字は<span className={style.emphasisTxt}>次のユーザーにカードを2枚引かせます。</span>（出されたユーザーが2を持っていたら効果を次のユーザーに流すことができます）</span>
          </div>
          <div className={style.effectDesc}>
            <img src='/images/cards/c8.png' width={50} height={75} alt='クラブの8'/>
            <span>8の数字はいつでも出すことができます。出す際に柄を指定する事で、<span className={style.emphasisTxt}>次のユーザーは指定した柄しか出せなくなります。</span>（Joker、8を除く）</span>
          </div>
          <div className={style.effectDesc}>
            <img src='/images/cards/c11.png' width={50} height={75} alt='クラブの11'/>
            <span>11の数字は<span className={style.emphasisTxt}>ターンの順番を逆にします。</span></span>
          </div>
          <div className={style.effectDesc}>
            <img src='/images/cards/c13.png' width={50} height={75} alt='クラブの13'/>
            <span>13の数字は<span className={style.emphasisTxt}>次のユーザーの手札を公開状態にします。</span>出されたユーザーが13を持っていたら効果を次のユーザーに流すことができます）</span>
          </div>
          <span className={style.hintText}>💡2と13は手札に持っていれば効果を回避できるため、あえて出さずに持っておくのも戦略の1つです。</span>
        </section>
        <section className={style.section}>
          <h2>スコア計算方法</h2>
          <p>ドボンに成功したプレイヤーは下記の流れでスコアを獲得します。</p>

          <Spacer size={20} />
          <h3>スコア計算に使うカードを決める流れ</h3>
          <Spacer size={20} />

          <div className={style.gameDesc}>
            <p>1. 場にドボンに成功した捨て札をおく。（※これをベースカードと呼ぶ）</p>
            <p>2. ドボンプレイヤーが山札からカードを2枚引く。この時、最後に引いたカードが絵札（11、12、13、joker）であれば続けて山札からカードを引き続ける。（※これをボーナスカードと呼ぶ）</p>
            <p>3. スコア計算は「絵札は10」として扱い、もしjokerを引いた場合は一旦よけておく。</p>
            <p>4. 絵札が出なかった時点で、それまでに引いたカードを並べて合計値を計算する。（ボーナスカードの合計値）</p>
            <p>5. ボーナスカードの合計値が出たら、最終スコアの計算に移る。</p>
          </div>

          <Spacer size={20} />
          <h3>スコアを計算する</h3>
          <p>スコアの計算は<span className={style.emphasisTxt}>「ドボンした数字」×「ボーナスカードの合計値」×「特別加算」</span>で行います。</p>

          {/* <div className={style.dobonExample}>
            （獲得スコアの例）<br/>
            <div className={style.scoreExampleItem}>
              上がり
              <img src='/images/cards/c1.png' width={50} height={75} alt='クラブの1'/>
            </div>
            <div className={style.scoreExampleItem}>
            ボーナスカード<img src='/images/cards/c3.png' width={50} height={75} alt='クラブの3'/><img src='/images/cards/c6.png' width={50} height={75} alt='クラブの6'/> なら<br/>「2か4」で上がれます。（1 + 3）<br/>
            </div>
          </div> */}
          <span className={style.hintText}>💡特別加算とは「ドボンを1枚の手札で行なった時（単騎待ち）」「ボーナスでjokerを引いた場合」に得られます。最終スコアを2倍する効果を持つため、ハイスコアの獲得につながります。</span>
          <Spacer size={20} />
        </section>
        <div>
          <Link href="/">
            <a className={style.link}>TOPに戻る</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HowToPage