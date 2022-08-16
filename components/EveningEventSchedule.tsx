import SectionTitle from './SectionTitle'

type MainEvent = {
  type: 'main'
  label: string
  seq: number
}

type ExtraEvent = {
  type: 'extra'
  label: string
}

const eveningEventSchedule = [
  [
    { type: 'main', label: '活動組舞' },
    { type: 'extra', label: '串場 - 第一場上半' },
    { type: 'main', label: '失蹤人口' },
    { type: 'extra', label: '串場 - 第一場下半' },
    { type: 'main', label: '誰' },
    { type: 'main', label: '假行僧' },
    { type: 'extra', label: '串場 - 第二場' },
  ],
  [
    { type: 'main', label: '滯留鋒' },
    { type: 'extra', label: '暗線 - 第一場' },
    { type: 'main', label: '在地球爆炸之前' },
    { type: 'main', label: '總召舞' },
    { type: 'extra', label: '​中場休息' },
  ],
  [
    { type: 'main', label: '山海、重感情的廢物' },
    { type: 'extra', label: '串場 - 第三場' },
    { type: 'main', label: '閣愛你一次' },
    { type: 'extra', label: '串場 - 第四場' },
    { type: 'main', label: '天黑黑' },
    { type: 'extra', label: '暗線 - 第二場' },
    { type: 'main', label: '當我望著你' },
  ],
  [
    { type: 'extra', label: '串場 - 第五場' },
    { type: 'main', label: '偷偷' },
    { type: 'main', label: '我要你愛' },
    { type: 'extra', label: '主持 - 有獎徵答' },
    { type: 'extra', label: '暗線 - 第二場' },
    { type: 'main', label: '關閉太陽' },
    { type: 'main', label: '大合舞' },
  ],
]

const schedule = (() => {
  const ret = []
  let prevMainSeq = 0
  for (const col of eveningEventSchedule) {
    const newCol = []
    for (const item of col) {
      if (item.type === 'main') {
        prevMainSeq += 1
        newCol.push({ ...item, seq: prevMainSeq })
      } else {
        newCol.push(item)
      }
    }
    ret.push(newCol)
  }
  return ret as (MainEvent | ExtraEvent)[][]
})()

export default function EveningEventSchedule() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .ees-container {
            display: flex;
            font-weight: bold;
            justify-content: center;
            text-align: center;
            max-width: var(--container-width);
            margin: 0 auto;
            font-size: 1.2rem;
          }

          .ees-column {
            padding: 0.25rem 1rem;
            flex: 1 1 0px;
          }

          .ees-column:not(:last-child) {
            border-right: 2px solid var(--color-primary);
          }

          .ees-event {
            margin-bottom: 1.3rem;
          }

          .ees-event.extra {
            color: var(--color-evening-event-schedule-extra);
            font-size: 0.85em;
          }

          .ees-event-main-seq {
            font-weight: 400;
            font-family: 'Poppins', 'Noto Sans TC', sans-serif;
            line-height: 1;
          }

          @media screen and (max-width: 800px) {
            .ees-container {
              font-size: 1.1rem;
              justify-content: flex-start;
            }

            .ees-column {
              min-width: 60vw;
            }

            .ees-scrollable-container {
              overflow: auto;
            }
          }
        `,
        }}
      />
      <SectionTitle title="晚會節目表" />
      <div className="ees-scrollable-container">
        <div className="ees-container">
          {schedule.map((col, idx) => (
            <div key={idx} className="ees-column">
              {col.map((item, idx) => {
                if (item.type === 'main') {
                  return (
                    <div key={idx} className="ees-event main">
                      <div className="ees-event-main-seq">表演 {item.seq}</div>
                      <div className="ees-event-main-label">{item.label}</div>
                    </div>
                  )
                } else {
                  return (
                    <div key={idx} className="ees-event extra">
                      {item.label}
                    </div>
                  )
                }
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
