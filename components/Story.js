import SectionTitle from './SectionTitle'

export default function Story() {
  return (
        <>
            <SectionTitle title="故事背景" />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/vP3rYUNmrgU" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        </>
  )
}
