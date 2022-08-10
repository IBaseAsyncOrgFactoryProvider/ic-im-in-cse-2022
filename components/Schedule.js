import styles from '../styles/Schedule.module.css'

export default function Schedule() {
  const days = [
    {
      date: 16,
      day: 'Friday',
      columns: [
        [
          { time: '08:20–17:00', title: '乖乖上課' },
          { time: '17:50–18:00', title: '集合點名+主持說明' },
          { time: '18:00–19:30', title: '晚餐+破冰' },
          { time: '19:30–22:00', title: '闖關遊戲' },
        ],
      ],
    },
    {
      date: 17,
      day: 'Saturday',
      columns: [
        [
          { time: '07:50–08:20', title: '早操' },
          { time: '08:20–09:00', title: '早餐' },
          { time: '09:00–12:00', title: '大地遊戲' },
          { time: '12:00–13:00', title: '午餐' },
        ],
        [
          { time: '13:00–17:00', title: 'RPG' },
          { time: '17:00–17:20', title: '換衣服（制服）' },
          { time: '17:20–18:30', title: '晚餐' },
          { time: '18:30–19:00', title: '晚會前主持+破冰' },
          { time: '19:00–22:00', title: '晚會' },
        ],
      ],
    },
    {
      date: 18,
      day: 'Sunday',
      columns: [
        [
          { time: '07:50–08:20', title: '早操' },
          { time: '08:20–09:00', title: '早餐' },
          { time: '09:00–12:00', title: '斯名牌' },
          { time: '12:00–13:00', title: '午餐' },
          { time: '13:00–17:00', title: '賭場' },
          { time: '17:00–18:30', title: '結業典禮' },
          { time: '18:30', title: '滾回宿舍' },
        ],
      ],
    },
  ]
  let maxRows = 0
  for (const day of days) {
    for (const column of day.columns) {
      if (column.length > maxRows) maxRows = column.length
    }
  }

  for (const day of days) {
    for (const column of day.columns) {
      if (column.length < maxRows) {
        const c = maxRows - column.length
        for (let i = 0; i < c; i++) {
          column.push({ placeholder: true })
        }
      }
    }
  }

  let daySelectorStyles = ''
  for (const day of days) {
    daySelectorStyles += `
      #schedule-day-${day.date}-radio:checked ~ .${styles['day-selectors']} label[for="schedule-day-${day.date}-radio"] {
        color: var(--color-schedule-day-selector-active-text);
        background-color: var(--color-schedule-day-selector-active-bg);
      }

      #schedule-day-${day.date}-radio:checked ~ .${styles.grid} #schedule-day-${day.date} {
        display: contents;
      }
    `
  }

  return (
        <section className={styles.surface}>
            <style dangerouslySetInnerHTML={{ __html: daySelectorStyles }}></style>
            <h2>行程</h2>
            <h3>September</h3>
              {
                days.map((day, idx) => (
                  <input id={`schedule-day-${day.date}-radio`} type="radio" defaultChecked={idx === 0} className={styles.hide} name="schedule-day-selector" key={`schedule-day-${day.date}-radio`} />
                ))
              }
            <div className={styles['day-selectors']}>
              {
                days.map(day => (
                  <label htmlFor={`schedule-day-${day.date}-radio`} key={`schedule-day-${day.date}-radio`}>
                    {day.date}th
                  </label>
                ))
              }
            </div>
            <div className={styles.grid} style={{ gridTemplateRows: `repeat(${maxRows + 1}, auto)` }}>
                {
                    days.flatMap(day => {
                      return [
                            <div className={styles.header} key={day.date}>
                                <div className={styles.date}><span className={styles.large}>{day.date}</span>th</div>
                                <div className={styles.day}>{day.day}</div>
                            </div>,
                            <div className={styles.columns} id={`schedule-day-${day.date}`} key={day.date + 'c'}>
                                {
                                    day.columns.map((column, idx) => (
                                        <div className={styles.column} key={idx}>
                                        {
                                            column.map((item, idx) => {
                                              if (item.placeholder) return <div className={`${styles.item} ${styles.placeholder}`} key={idx}></div>
                                              return (
                                                    <div className={styles.item} key={idx}>
                                                        <div className={styles.time}>{item.time}</div>
                                                        <div className={styles.title}>{item.title}</div>
                                                    </div>
                                              )
                                            })
                                        }
                                        </div>
                                    ))
                                }
                            </div>,
                      ]
                    })
                }
            </div>
        </section>
  )
}
