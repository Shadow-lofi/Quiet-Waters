import './StudyScene.css'
import type { SceneKey } from '../data/kidsStudies'

const LABELS: Record<SceneKey, string> = {
  'noah-build': 'Noah building the ark',
  'noah-animals': 'The animals coming to the ark two by two',
  'noah-rain': 'Rain falling on the ark floating on the water',
  'noah-dove': 'A dove flying to the ark with a leaf',
  'noah-rainbow': 'A rainbow over the ark — God’s promise',
  'david-sheep': 'David the shepherd boy with his sheep',
  'david-goliath': 'Little David facing the giant Goliath',
  'david-stones': 'David choosing smooth stones by the stream',
  'david-sling': 'David swinging his sling',
  'david-victory': 'David standing over the fallen giant',
  'creation-light': 'God creating light in the darkness',
  'creation-sky': 'God making the sky and the sea',
  'creation-land': 'God making dry land, plants, and trees',
  'creation-stars': 'God making the sun, moon, and stars',
  'creation-sea': 'God filling the sea with fish and the sky with birds',
  'creation-animals': 'God making the animals and people',
  'creation-rest': 'God resting on the seventh day',
  'jonah-run': 'Jonah sailing away on a boat',
  'jonah-storm': 'A great storm tossing Jonah’s boat',
  'jonah-fish': 'A giant fish in the sea',
  'jonah-pray': 'Jonah praying inside the fish',
  'jonah-nineveh': 'Jonah arriving at the city of Nineveh',
}

function Ark() {
  return (
    <g>
      <path d="M104 116 q56 30 112 0 l-10 24 q-46 18 -92 0 Z" fill="#a9702c" />
      <rect x="124" y="90" width="72" height="28" rx="4" fill="#cf9a44" />
      <rect x="138" y="98" width="14" height="14" rx="2" fill="#7a5320" />
      <rect x="168" y="98" width="14" height="14" rx="2" fill="#7a5320" />
      <path d="M120 90 l40 -18 l40 18 Z" fill="#8a5a22" />
    </g>
  )
}

function Waves() {
  return (
    <>
      <g className="ss-waves" fill="#7fb2dd">
        <path d="M-40 150 q18 -9 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 V190 H-40 Z" />
      </g>
      <g fill="#69a0d0">
        <path d="M-40 163 q18 -8 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 V190 H-40 Z" />
      </g>
    </>
  )
}

function Sun({ cx, cy, r = 15 }: { cx: number; cy: number; r?: number }) {
  return (
    <g className="ss-sun">
      <circle cx={cx} cy={cy} r={r} fill="#f2c25f" />
    </g>
  )
}

function Boat() {
  return (
    <g>
      <path d="M112 118 q48 24 96 0 l-8 18 q-40 15 -80 0 Z" fill="#9a6a2f" />
      <rect x="158" y="66" width="4" height="54" fill="#7a5320" />
      <path d="M162 70 L206 112 L162 112 Z" fill="#f3ead8" />
    </g>
  )
}

const RAIN_X = [24, 52, 80, 108, 136, 164, 192, 220, 248, 276]
const STARS = [
  [40, 40],
  [90, 26],
  [130, 52],
  [180, 30],
  [70, 66],
  [210, 60],
  [150, 22],
]

function Scene({ scene }: { scene: SceneKey }) {
  switch (scene) {
    case 'noah-build':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <rect y="150" width="320" height="40" fill="#cdb98a" />
          <g className="ss-sun"><circle cx="272" cy="34" r="15" fill="#f2c25f" /></g>
          <Ark />
          <g className="ss-hammer">
            <rect x="206" y="58" width="5" height="30" rx="2" fill="#8a5a22" />
            <rect x="196" y="52" width="24" height="11" rx="2" fill="#9aa0a6" />
          </g>
        </>
      )
    case 'noah-animals':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <rect y="150" width="320" height="40" fill="#cdb98a" />
          <Ark />
          <path d="M150 138 L74 168" stroke="#8a5a22" strokeWidth="6" strokeLinecap="round" />
          <g className="ss-animal">
            <ellipse cx="40" cy="158" rx="16" ry="10" fill="#8a8f98" />
            <circle cx="56" cy="150" r="7" fill="#8a8f98" />
            <rect x="30" y="164" width="4" height="9" fill="#8a8f98" />
            <rect x="46" y="164" width="4" height="9" fill="#8a8f98" />
          </g>
          <g className="ss-animal" style={{ animationDelay: '-2.3s' }}>
            <ellipse cx="40" cy="156" rx="13" ry="8" fill="#c8a15a" />
            <rect x="50" y="136" width="5" height="22" fill="#c8a15a" />
            <circle cx="53" cy="134" r="6" fill="#c8a15a" />
            <rect x="30" y="161" width="4" height="10" fill="#c8a15a" />
            <rect x="45" y="161" width="4" height="10" fill="#c8a15a" />
          </g>
        </>
      )
    case 'noah-rain':
      return (
        <>
          <rect width="320" height="190" fill="#c3d0da" />
          <g fill="#aab6c0">
            <ellipse cx="78" cy="38" rx="34" ry="15" />
            <ellipse cx="224" cy="30" rx="40" ry="17" />
            <ellipse cx="160" cy="46" rx="30" ry="13" />
          </g>
          <g className="ss-rain" stroke="#8fb4d6" strokeWidth="3" strokeLinecap="round">
            {RAIN_X.map((x, i) => (
              <line key={x} x1={x} y1={62} x2={x - 5} y2={76} style={{ animationDelay: `${-(i * 0.13)}s` }} />
            ))}
          </g>
          <g className="ss-ark"><Ark /></g>
          <Waves />
        </>
      )
    case 'noah-dove':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <g className="ss-sun"><circle cx="274" cy="34" r="15" fill="#f2c25f" /></g>
          <g className="ss-ark"><Ark /></g>
          <Waves />
          <g className="ss-dove">
            <path d="M0 40 q7 -8 14 0 q7 -8 14 0" fill="none" stroke="#efe6d2" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="14" cy="44" rx="7" ry="4" fill="#f7f1e3" />
            <path d="M22 46 q7 3 12 -2 q-6 -1 -12 2 Z" fill="#7bb07a" />
          </g>
        </>
      )
    case 'noah-rainbow':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <g className="ss-sun"><circle cx="280" cy="32" r="15" fill="#f2c25f" /></g>
          <g className="ss-rainbow" fill="none" strokeWidth="8">
            <path pathLength={100} d="M40 150 A120 120 0 0 1 280 150" stroke="#e08a5a" />
            <path pathLength={100} d="M56 150 A104 104 0 0 1 264 150" stroke="#e6c15f" style={{ animationDelay: '0.2s' }} />
            <path pathLength={100} d="M72 150 A88 88 0 0 1 248 150" stroke="#7bb07a" style={{ animationDelay: '0.4s' }} />
            <path pathLength={100} d="M88 150 A72 72 0 0 1 232 150" stroke="#6f9fd0" style={{ animationDelay: '0.6s' }} />
          </g>
          <g className="ss-ark"><Ark /></g>
          <Waves />
        </>
      )

    case 'david-sheep':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <path d="M0 132 q80 -26 160 0 t160 0 V190 H0 Z" fill="#8bb15e" />
          <rect y="162" width="320" height="28" fill="#79a04e" />
          <Sun cx={272} cy={34} />
          <g transform="translate(52,150)">
            <ellipse cx="0" cy="0" rx="16" ry="11" fill="#f4efe6" />
            <circle cx="14" cy="-3" r="6" fill="#6b6b66" />
            <rect x="-9" y="8" width="4" height="9" fill="#6b6b66" />
            <rect x="6" y="8" width="4" height="9" fill="#6b6b66" />
          </g>
          <g transform="translate(104,158)">
            <ellipse cx="0" cy="0" rx="13" ry="9" fill="#f4efe6" />
            <circle cx="11" cy="-2" r="5" fill="#6b6b66" />
            <rect x="-7" y="6" width="3.5" height="8" fill="#6b6b66" />
            <rect x="5" y="6" width="3.5" height="8" fill="#6b6b66" />
          </g>
          <g transform="translate(212,104)">
            <line x1="30" y1="-4" x2="30" y2="58" stroke="#7a5320" strokeWidth="4" strokeLinecap="round" />
            <path d="M2 58 L22 58 L16 20 L8 20 Z" fill="#7d9bd0" />
            <circle cx="12" cy="12" r="9" fill="#e8c39e" />
            <path d="M3 10 q9 -13 18 0 q-9 -5 -18 0" fill="#5a3d24" />
          </g>
        </>
      )

    case 'david-goliath':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <rect y="158" width="320" height="32" fill="#b7a273" />
          <g transform="translate(196,40)">
            <rect x="4" y="34" width="52" height="86" rx="10" fill="#6f7d86" />
            <circle cx="30" cy="22" r="18" fill="#c98f63" />
            <rect x="14" y="8" width="32" height="12" rx="4" fill="#8a949b" />
            <circle cx="23" cy="22" r="2.5" fill="#3a3a3a" />
            <circle cx="37" cy="22" r="2.5" fill="#3a3a3a" />
            <line x1="60" y1="-6" x2="60" y2="120" stroke="#8a5a22" strokeWidth="5" strokeLinecap="round" />
            <path d="M56 -10 L72 6 L60 6 Z" fill="#9aa0a6" />
          </g>
          <g transform="translate(58,120)">
            <path d="M2 38 L18 38 L13 14 L7 14 Z" fill="#7d9bd0" />
            <circle cx="10" cy="8" r="7" fill="#e8c39e" />
          </g>
        </>
      )

    case 'david-stones':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <rect y="120" width="320" height="70" fill="#b7a273" />
          <g fill="#8f8a82">
            <circle cx="120" cy="150" r="5" />
            <circle cx="140" cy="156" r="4" />
            <circle cx="160" cy="150" r="5" />
            <circle cx="182" cy="156" r="4" />
            <g className="ss-rise"><circle cx="205" cy="140" r="5" /></g>
          </g>
          <g transform="translate(74,124)">
            <ellipse cx="6" cy="34" rx="14" ry="10" fill="#7d9bd0" />
            <circle cx="18" cy="14" r="8" fill="#e8c39e" />
            <line x1="20" y1="24" x2="34" y2="40" stroke="#e8c39e" strokeWidth="4" strokeLinecap="round" />
          </g>
          <g className="ss-waves" fill="#7fb2dd"><path d="M-40 150 q18 -8 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 V190 H-40 Z" /></g>
        </>
      )

    case 'david-sling':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <rect y="158" width="320" height="32" fill="#b7a273" />
          <Sun cx={278} cy={32} />
          <g transform="translate(120,86)">
            <path d="M2 72 L24 72 L18 30 L8 30 Z" fill="#7d9bd0" />
            <circle cx="13" cy="20" r="10" fill="#e8c39e" />
            <path d="M3 18 q10 -14 20 0 q-10 -5 -20 0" fill="#5a3d24" />
            <line x1="20" y1="34" x2="40" y2="24" stroke="#e8c39e" strokeWidth="4" strokeLinecap="round" />
            <g className="ss-spin" style={{ transformOrigin: 'bottom' }}>
              <line x1="40" y1="24" x2="40" y2="-6" stroke="#6b4a2a" strokeWidth="2" />
              <circle cx="40" cy="-8" r="5" fill="#8f8a82" />
            </g>
          </g>
        </>
      )

    case 'david-victory':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <rect y="158" width="320" height="32" fill="#b7a273" />
          <Sun cx={262} cy={34} r={16} />
          <g transform="translate(150,150)">
            <rect x="0" y="0" width="150" height="22" rx="11" fill="#6f7d86" />
            <circle cx="150" cy="6" r="12" fill="#c98f63" />
          </g>
          <g transform="translate(70,96)">
            <path d="M2 62 L24 62 L18 26 L8 26 Z" fill="#7d9bd0" />
            <circle cx="13" cy="16" r="10" fill="#e8c39e" />
            <path d="M3 14 q10 -14 20 0 q-10 -5 -20 0" fill="#5a3d24" />
            <line x1="8" y1="30" x2="-4" y2="12" stroke="#e8c39e" strokeWidth="4" strokeLinecap="round" />
            <line x1="18" y1="30" x2="30" y2="12" stroke="#e8c39e" strokeWidth="4" strokeLinecap="round" />
          </g>
          <circle className="ss-twinkle" cx="112" cy="40" r="3" fill="#f2c25f" />
          <circle className="ss-twinkle" cx="40" cy="60" r="2.5" fill="#f2c25f" style={{ animationDelay: '-1s' }} />
        </>
      )

    case 'creation-light':
      return (
        <>
          <rect width="320" height="190" fill="#26304a" />
          <g className="ss-rise">
            <g className="ss-sun"><circle cx="160" cy="96" r="30" fill="#f5d36a" /></g>
            <g stroke="#f5d36a" strokeWidth="4" strokeLinecap="round">
              <line x1="160" y1="34" x2="160" y2="16" />
              <line x1="160" y1="158" x2="160" y2="176" />
              <line x1="98" y1="96" x2="80" y2="96" />
              <line x1="222" y1="96" x2="240" y2="96" />
              <line x1="116" y1="52" x2="104" y2="40" />
              <line x1="204" y1="52" x2="216" y2="40" />
              <line x1="116" y1="140" x2="104" y2="152" />
              <line x1="204" y1="140" x2="216" y2="152" />
            </g>
          </g>
        </>
      )

    case 'creation-sky':
      return (
        <>
          <rect width="320" height="190" fill="#bfe0f5" />
          <rect y="120" width="320" height="70" fill="#7fb2dd" />
          <g fill="#ffffff" opacity="0.85">
            <ellipse cx="80" cy="46" rx="34" ry="15" />
            <ellipse cx="220" cy="34" rx="40" ry="17" />
            <ellipse cx="150" cy="60" rx="26" ry="12" />
          </g>
          <g className="ss-waves" fill="#69a0d0"><path d="M-40 128 q18 -8 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 V190 H-40 Z" /></g>
        </>
      )

    case 'creation-land':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <path d="M0 140 q80 -20 160 0 t160 0 V190 H0 Z" fill="#8bb15e" />
          <rect y="164" width="320" height="26" fill="#79a04e" />
          <g className="ss-grow">
            <rect x="152" y="96" width="10" height="52" rx="3" fill="#7a5320" />
            <circle cx="157" cy="84" r="30" fill="#5c8a3a" />
            <circle cx="136" cy="98" r="20" fill="#6b9a44" />
            <circle cx="180" cy="98" r="20" fill="#6b9a44" />
          </g>
          <g className="ss-grow" style={{ animationDelay: '0.5s' }}>
            <rect x="59" y="150" width="2" height="14" fill="#5c8a3a" />
            <circle cx="60" cy="148" r="6" fill="#e78ab0" />
          </g>
          <g className="ss-grow" style={{ animationDelay: '0.8s' }}>
            <rect x="249" y="150" width="2" height="14" fill="#5c8a3a" />
            <circle cx="250" cy="148" r="6" fill="#f2c25f" />
          </g>
        </>
      )

    case 'creation-stars':
      return (
        <>
          <rect width="320" height="190" fill="#1f2b47" />
          <Sun cx={60} cy={46} r={16} />
          <g fill="#eef1f7">
            <circle cx="250" cy="50" r="20" />
            <circle cx="258" cy="46" r="17" fill="#1f2b47" />
          </g>
          <g fill="#f5edc4">
            {STARS.map(([x, y], i) => (
              <circle key={i} className="ss-twinkle" cx={x} cy={y} r={2.5} style={{ animationDelay: `${-(i * 0.35)}s` }} />
            ))}
          </g>
          <rect y="164" width="320" height="26" fill="#2a3760" />
        </>
      )

    case 'creation-sea':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <rect y="92" width="320" height="98" fill="#7fb2dd" />
          <path d="M0 92 q20 -7 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#9cc6e6" strokeWidth="3" />
          <g className="ss-dove">
            <path d="M0 44 q8 -9 16 0 q8 -9 16 0" fill="none" stroke="#5a5f66" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="ss-swim" fill="#e08a4a">
            <ellipse cx="90" cy="130" rx="16" ry="9" />
            <path d="M74 130 l-12 -7 l0 14 Z" />
            <circle cx="98" cy="127" r="2" fill="#2a2520" />
          </g>
          <g className="ss-swim" style={{ animationDelay: '-2.5s' }} fill="#5db0a0">
            <ellipse cx="212" cy="158" rx="13" ry="7" />
            <path d="M225 158 l12 -6 l0 12 Z" />
            <circle cx="204" cy="156" r="1.8" fill="#2a2520" />
          </g>
        </>
      )

    case 'creation-animals':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <path d="M0 138 q80 -20 160 0 t160 0 V190 H0 Z" fill="#8bb15e" />
          <rect y="164" width="320" height="26" fill="#79a04e" />
          <Sun cx={274} cy={34} />
          <g transform="translate(44,150)">
            <ellipse cx="0" cy="0" rx="20" ry="13" fill="#9aa0a6" />
            <circle cx="18" cy="-4" r="9" fill="#9aa0a6" />
            <path d="M26 -2 q8 4 4 14" fill="none" stroke="#9aa0a6" strokeWidth="4" strokeLinecap="round" />
            <rect x="-12" y="10" width="5" height="10" fill="#9aa0a6" />
            <rect x="6" y="10" width="5" height="10" fill="#9aa0a6" />
          </g>
          <g transform="translate(122,158)">
            <ellipse cx="0" cy="0" rx="12" ry="8" fill="#c8905a" />
            <circle cx="11" cy="-4" r="5" fill="#c8905a" />
            <rect x="-7" y="6" width="3.5" height="8" fill="#8a5f36" />
            <rect x="5" y="6" width="3.5" height="8" fill="#8a5f36" />
          </g>
          <g transform="translate(214,104)">
            <path d="M2 62 L24 62 L18 26 L8 26 Z" fill="#c98f63" />
            <circle cx="13" cy="16" r="10" fill="#e8c39e" />
            <path d="M3 14 q10 -13 20 0 q-10 -5 -20 0" fill="#3a2a1a" />
          </g>
        </>
      )

    case 'creation-rest':
      return (
        <>
          <rect width="320" height="190" fill="#f4d9a6" />
          <rect width="320" height="96" fill="#e9b98f" />
          <Sun cx={160} cy={92} r={22} />
          <path d="M0 128 q90 -30 180 0 t180 0 V190 H0 Z" fill="#8a9a5e" />
          <path d="M0 150 q100 -22 200 0 t200 0 V190 H0 Z" fill="#6f7f48" />
          <circle className="ss-twinkle" cx="60" cy="40" r="2.2" fill="#fff6da" />
          <circle className="ss-twinkle" cx="250" cy="30" r="2.2" fill="#fff6da" style={{ animationDelay: '-1s' }} />
        </>
      )

    case 'jonah-run':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <Sun cx={276} cy={34} />
          <g className="ss-ark"><Boat /></g>
          <Waves />
        </>
      )

    case 'jonah-storm':
      return (
        <>
          <rect width="320" height="190" fill="#8a95a1" />
          <g fill="#5f6a76">
            <ellipse cx="78" cy="36" rx="38" ry="16" />
            <ellipse cx="224" cy="30" rx="44" ry="18" />
            <ellipse cx="160" cy="44" rx="30" ry="13" />
          </g>
          <path d="M120 46 L112 74 L122 74 L110 104" fill="none" stroke="#f5d36a" strokeWidth="3" strokeLinecap="round" />
          <g className="ss-rain" stroke="#b7c4cf" strokeWidth="3" strokeLinecap="round">
            {RAIN_X.map((x, i) => (
              <line key={x} x1={x} y1={60} x2={x - 5} y2={74} style={{ animationDelay: `${-(i * 0.11)}s` }} />
            ))}
          </g>
          <g className="ss-toss"><Boat /></g>
          <g className="ss-waves" fill="#4f6a86"><path d="M-40 140 q18 -14 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 V190 H-40 Z" /></g>
          <g fill="#3f5872"><path d="M-40 158 q18 -12 36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 t36 0 V190 H-40 Z" /></g>
        </>
      )

    case 'jonah-fish':
      return (
        <>
          <rect width="320" height="190" fill="#dCEBF9" />
          <rect y="96" width="320" height="94" fill="#6fa8d6" />
          <path d="M0 96 q20 -7 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#9cc6e6" strokeWidth="3" />
          <g className="ss-swim">
            <ellipse cx="158" cy="140" rx="58" ry="32" fill="#4a7fa8" />
            <path d="M212 140 l32 -20 l0 40 Z" fill="#3f6f94" />
            <path d="M104 128 q-16 12 0 24 Z" fill="#cde6f5" />
            <circle cx="126" cy="128" r="4" fill="#eef4f8" />
            <circle cx="126" cy="128" r="2" fill="#2a2520" />
          </g>
        </>
      )

    case 'jonah-pray':
      return (
        <>
          <rect width="320" height="190" fill="#20404a" />
          <g fill="none" stroke="#3a6470" strokeWidth="4" strokeLinecap="round">
            <path d="M40 20 q-20 75 0 150" />
            <path d="M70 16 q-16 79 0 158" />
            <path d="M280 20 q20 75 0 150" />
            <path d="M250 16 q16 79 0 158" />
          </g>
          <g transform="translate(140,96)">
            <path d="M0 60 q20 -6 40 0 l-4 20 q-16 5 -32 0 Z" fill="#8a6a44" />
            <circle cx="20" cy="30" r="12" fill="#e8c39e" />
            <path d="M8 28 q12 -16 24 0 q-12 -6 -24 0" fill="#3a2a1a" />
            <path d="M20 42 l-6 14 l6 -2 l6 2 Z" fill="#e8c39e" />
          </g>
          <circle className="ss-twinkle" cx="92" cy="60" r="4" fill="#5a8a94" />
          <circle className="ss-twinkle" cx="230" cy="80" r="5" fill="#5a8a94" style={{ animationDelay: '-1.2s' }} />
          <circle className="ss-twinkle" cx="212" cy="40" r="3" fill="#5a8a94" style={{ animationDelay: '-0.6s' }} />
        </>
      )

    case 'jonah-nineveh':
      return (
        <>
          <rect width="320" height="190" fill="#f2e4c0" />
          <rect width="320" height="110" fill="#f7edd0" />
          <Sun cx={60} cy={40} />
          <g fill="#c9a86a">
            <rect x="180" y="70" width="120" height="90" />
            <rect x="196" y="52" width="24" height="18" />
            <rect x="236" y="46" width="24" height="24" />
            <rect x="276" y="52" width="20" height="18" />
          </g>
          <g fill="#a9884a">
            <rect x="200" y="92" width="14" height="18" />
            <rect x="230" y="92" width="14" height="18" />
            <rect x="262" y="92" width="14" height="18" />
            <rect x="230" y="126" width="18" height="34" />
          </g>
          <rect y="160" width="320" height="30" fill="#cdb98a" />
          <g transform="translate(90,108)">
            <path d="M2 52 L22 52 L17 20 L7 20 Z" fill="#8a6a44" />
            <circle cx="12" cy="12" r="9" fill="#e8c39e" />
            <path d="M3 10 q9 -13 18 0 q-9 -5 -18 0" fill="#3a2a1a" />
          </g>
        </>
      )
  }
}

/** An animated storybook scene, rendered as a looping on-brand SVG. */
export function StudyScene({ scene }: { scene: SceneKey }) {
  return (
    <svg viewBox="0 0 320 190" className="study-scene" role="img" aria-label={LABELS[scene]}>
      <Scene scene={scene} />
    </svg>
  )
}
