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
  };

  for (const day of days) {
    for (const column of day.columns) {
      if (column.length < maxRows) {
        const c = maxRows - column.length
        for (let i = 0; i < c; i++) {
          column.push({ placeholder: true })
        }
      }
    }
  };
  return (
        <section className={styles.surface}>
            <h2>行程</h2>
            <h3>September</h3>
            <div className={styles.grid} style={{ gridTemplateRows: `repeat(${maxRows + 1}, auto)` }}>
                {
                    days.flatMap(day => {
                      return [
                            <div className={styles.header} key={day.date}>
                                <div className={styles.date}><span className={styles.large}>{day.date}</span>th</div>
                                <div className={styles.day}>{day.day}</div>
                            </div>,
                            <div className={styles.columns} key={day.date + 'c'}>
                                {
                                    Object.entries(day.columns).map(([idx, column]) => (
                                        <div className={styles.column} key={idx}>
                                        {
                                            Object.entries(column).map(([idx, item]) => {
                                              if (item.placeholder) return <div className={styles.item} key={idx}></div>
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
