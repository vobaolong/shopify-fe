import { Helmet } from 'react-helmet'

const MetaData = ({ title }: { title: string }) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}

export default MetaData
